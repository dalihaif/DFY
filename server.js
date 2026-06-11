const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
 
 // 全局未捕获异常处理 - 防止服务器在后台无声崩溃
 process.on('unhandledRejection', (reason, promise) => {
   console.error('[Server] 未捕获的 Promise 拒绝:', reason?.message || reason);
 });
 
 const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'server', 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// ============ 认证配置 ============
const ADMIN_PASSWORD_HASH = process.env.DFY_ADMIN_PASSWORD || 'dfy@2026!';

// 认证中间件 — 保护所有写API
function requireAuth(req, res, next) {
  if (req.method === 'GET') return next();
  if (req.path === '/api/login' || req.path === '/api/setup-password') return next();
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: '未认证，请先登录后台' });
  }
  const token = auth.slice(7);
  if (token !== ADMIN_PASSWORD_HASH) {
    const adminHash = db && db.data ? db.data['hm_admin_hash'] : null;
    if (adminHash && token === adminHash) return next();
    return res.status(403).json({ error: '认证失败，令牌无效' });
  }
  next();
}

app.use(requireAuth);

// 中间件
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.static(__dirname));

// 确保数据目录存在
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// ============ lowdb 集成 ============

let db = null;

// 从旧的 JSON 文件迁移数据到 lowdb
function migrateOldData() {
  const migrations = {
    hm_content: 'hm_content.json',
    hm_settings: 'hm_settings.json',
    hm_admin_sections: 'hm_admin_sections.json',
    hm_announcements: 'hm_announcements.json',
    hm_staff: 'hm_staff.json'
  };
  const data = {};
  let migrated = 0;
  for (const [key, filename] of Object.entries(migrations)) {
    const filePath = path.join(DATA_DIR, filename);
    if (fs.existsSync(filePath)) {
      try {
        const raw = fs.readFileSync(filePath, 'utf8');
        data[key] = JSON.parse(raw);
        migrated++;
      } catch (e) {
        console.error('  迁移文件失败 ' + filename + ':', e.message);
        data[key] = key === 'hm_settings' ? {} : [];
      }
    } else {
      data[key] = key === 'hm_settings' ? {} : [];
    }
  }
  if (migrated > 0) {
    console.log('  从旧 JSON 文件迁移了 ' + migrated + ' 张表');
  }
  return data;
}

// 数据库默认结果
function getDefaultData() {
  return {
    hm_content: {},
    hm_settings: {},
    hm_admin_sections: [],
    hm_announcements: [],
    hm_staff: [],
    hm_admin_hash: null
  };
}

// 初始化 lowdb
async function initDB() {
  const { Low } = await import('lowdb');
  const { JSONFile } = await import('lowdb/node');
  const adapter = new JSONFile(DB_FILE);
  if (fs.existsSync(DB_FILE)) {
    db = new Low(adapter, getDefaultData());
    await db.read();
    console.log('  已加载 lowdb 数据库 ' + DB_FILE);
  } else {
    const migratedData = migrateOldData();
    const defaults = getDefaultData();
    const initialData = { ...defaults, ...migratedData };
    db = new Low(adapter, initialData);
    await db.write();
    console.log('  已创建 lowdb 数据库 ' + DB_FILE);
  }
  return db;
}

function readTable(tableName) {
  if (!db || !db.data) return null;
  return db.data[tableName];
}

async function writeTable(tableName, data) {
  if (!db) return false;
  try {
    db.data[tableName] = data;
    await db.write();
    return true;
  } catch (err) {
    console.error('[Server] 写入表 ' + tableName + ' 失败:', err.message);
    return false;
  }
}

// ============ API 路由 ============

// 登录验证
app.post('/api/login', (req, res) => {
  const { password } = req.body || {};
  if (!password) {
    return res.status(400).json({ success: false, error: '请提供密码' });
  }
  const expected = Buffer.from('dfy@2026!' + password).toString('base64');
  const adminHash = readTable('hm_admin_hash');
  if (adminHash) {
    if (expected === adminHash) {
      return res.json({ success: true, token: expected });
    }
    return res.status(403).json({ success: false, error: '密码错误' });
  }
  // 首次使用，接受任意密码作为设置
  return res.json({ success: true, token: expected, isSetup: true });
});

// 前端设置密码
app.post('/api/setup-password', async (req, res) => {
  try {
  const { hash } = req.body || {};
  if (!hash || hash.length < 10) {
    return res.status(400).json({ success: false, error: '密码太短' });
  }
  await writeTable('hm_admin_hash', hash);
  res.json({ success: true });
  } catch (err) {
    console.error('[Server] /api/setup-password 处理失败:', err.message);
    res.status(500).json({ success: false, error: '服务器错误' });
  }
});

// 密码设置状态
app.get('/api/setup-status', (req, res) => {
  const hash = readTable('hm_admin_hash');
  res.json({ setup: !hash });
});

// 获取所有数据
app.get('/api/all-data', async (req, res) => {
  const tables = ['hm_content', 'hm_settings', 'hm_admin_sections', 'hm_announcements', 'hm_staff'];
  const result = {};
  tables.forEach(key => {
    result[key] = readTable(key) ?? (key === 'hm_settings' ? {} : []);
  });
  res.json(result);
});

// 内容管理 API
app.get('/api/content', (req, res) => {
  res.json(readTable('hm_content') ?? {});
});
app.post('/api/content', async (req, res) => {
  try {
  const success = await writeTable('hm_content', req.body);
  res.json({ success });
  } catch (err) {
    console.error('[Server] /api/content 处理失败:', err.message);
    res.status(500).json({ success: false, error: '服务器错误' });
  }
});

// 设置管理 API
app.get('/api/settings', (req, res) => {
  res.json(readTable('hm_settings') ?? {});
});
app.post('/api/settings', async (req, res) => {
  try {
  const success = await writeTable('hm_settings', req.body);
  res.json({ success });
  } catch (err) {
    console.error('[Server] /api/settings 处理失败:', err.message);
    res.status(500).json({ success: false, error: '服务器错误' });
  }
});

// 板块管理 API
app.get('/api/sections', (req, res) => {
  res.json(readTable('hm_admin_sections') ?? []);
});
app.post('/api/sections', async (req, res) => {
  try {
  const success = await writeTable('hm_admin_sections', req.body);
  res.json({ success });
  } catch (err) {
    console.error('[Server] /api/sections 处理失败:', err.message);
    res.status(500).json({ success: false, error: '服务器错误' });
  }
});

// 公告管理 API
app.get('/api/announcements', (req, res) => {
  res.json(readTable('hm_announcements') ?? []);
});
app.post('/api/announcements', async (req, res) => {
  try {
  const success = await writeTable('hm_announcements', req.body);
  res.json({ success });
  } catch (err) {
    console.error('[Server] /api/announcements 处理失败:', err.message);
    res.status(500).json({ success: false, error: '服务器错误' });
  }
});

// 职工管理 API
app.get('/api/staff', (req, res) => {
  res.json(readTable('hm_staff') ?? []);
});
app.post('/api/staff', async (req, res) => {
  try {
  const success = await writeTable('hm_staff', req.body);
  res.json({ success });
  } catch (err) {
    console.error('[Server] /api/staff 处理失败:', err.message);
    res.status(500).json({ success: false, error: '服务器错误' });
  }
});

// ============ 图片上传 API ============
const UPLOAD_DIR = path.join(__dirname, 'assets', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

let multer;
try { multer = require('multer'); } catch(e) { multer = null; }

if (multer) {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOAD_DIR),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname) || '.png';
      const name = Date.now() + '-' + Math.random().toString(36).slice(2, 8) + ext;
      cb(null, name);
    }
  });
  const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      if (/\.(jpg|jpeg|png|gif|webp|svg|ico)$/i.test(path.extname(file.originalname))) return cb(null, true);
      cb(new Error('不支持的文件格式，仅限图片'));
    }
  });
  app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ success: false, error: '未收到文件' });
    res.json({ success: true, url: '/assets/uploads/' + req.file.filename });
  });
} else {
  // base64 上传方案（无需额外依赖）
  app.post('/api/upload', async (req, res) => {
    try {
      const { data, name } = req.body || {};
      if (!data) return res.status(400).json({ success: false, error: '未提供图片数据' });
      const matches = data.match(/^data:image\/(\w+);base64,(.+)$/);
      if (!matches) return res.status(400).json({ success: false, error: '图片数据格式错误' });
      const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1];
      const buffer = Buffer.from(matches[2], 'base64');
      const filename = (name || 'upload-' + Date.now()).replace(/[^a-zA-Z0-9_-]/g, '') + '.' + ext;
      fs.writeFileSync(path.join(UPLOAD_DIR, filename), buffer);
      res.json({ success: true, url: '/assets/uploads/' + filename });
    } catch (e) {
      res.status(500).json({ success: false, error: '上传失败: ' + e.message });
    }
  });
}

// 列出已上传图片
app.get('/api/uploads', (req, res) => {
  try {
    if (!fs.existsSync(UPLOAD_DIR)) return res.json([]);
    const files = fs.readdirSync(UPLOAD_DIR)
      .filter(f => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(f))
      .map(f => ({ name: f, url: '/assets/uploads/' + f, size: fs.statSync(path.join(UPLOAD_DIR, f)).size }))
      .sort((a, b) => b.size - a.size);
    res.json(files);
  } catch (e) { res.json([]); }
});

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', db: 'lowdb', timestamp: new Date().toISOString() });
});

// ============ 启动服务器 ============
// ============ 全局错误处理中间件 ============
app.use((err, req, res, next) => {
  console.error('[Server] 未处理的错误:', err.message || err);
  res.status(500).json({ success: false, error: '服务器内部错误' });
});
 
initDB().then(() => {
  app.listen(PORT, () => {
    console.log('�� 服务器运行在 http://localhost:' + PORT);
    console.log('�� 数据库 lowdb (' + DB_FILE + ')');
  });
}).catch(err => {
  console.error('数据库初始化失败:', err);
  process.exit(1);
});
