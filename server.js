const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'server', 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

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
        const parsed = JSON.parse(raw);
        // settings 是对象，其余是数组
        data[key] = parsed;
        migrated++;
      } catch (e) {
        console.error(`  迁移文件失败 ${filename}:`, e.message);
        data[key] = key === 'hm_settings' ? {} : [];
      }
    } else {
      data[key] = key === 'hm_settings' ? {} : [];
    }
  }

  if (migrated > 0) {
    console.log(`  从旧 JSON 文件迁移了 ${migrated} 张表`);
  }
  return data;
}

// 数据库默认结构
function getDefaultData() {
  return {
    hm_content: [],
    hm_settings: {
      title: '大理大学第一附属医院云端院史馆',
      logo_text: '云端院史馆',
      footer_text: '© 2026 大理大学第一附属医院（云南省第四人民医院）版权所有',
      contact_phone: '0872-2201062',
      address: '云南省大理白族自治州大理市嘉士伯大道32号',
      email: 'office@dali.edu.cn'
    },
    hm_admin_sections: [],
    hm_announcements: [],
    hm_staff: []
  };
}

// 初始化 lowdb（异步，因为 v7 是 ESM）
async function initDB() {
  // 动态导入 ESM 模块
  const { Low } = await import('lowdb');
  const { JSONFile } = await import('lowdb/node');

  const adapter = new JSONFile(DB_FILE);

  // 如果 db.json 已存在，直接加载；否则从旧文件迁移
  if (fs.existsSync(DB_FILE)) {
    db = new Low(adapter, getDefaultData());
    await db.read();
    console.log('  已加载 lowdb 数据库: ' + DB_FILE);
  } else {
    const migratedData = migrateOldData();
    const defaults = getDefaultData();
    const initialData = { ...defaults, ...migratedData };
    db = new Low(adapter, initialData);
    await db.write();
    console.log('  已创建 lowdb 数据库: ' + DB_FILE);
  }

  return db;
}

// 通用读写函数（替代旧的 readDataFile / writeDataFile）
function readTable(tableName) {
  if (!db || !db.data) return null;
  return db.data[tableName];
}

async function writeTable(tableName, data) {
  if (!db) return false;
  db.data[tableName] = data;
  await db.write();
  return true;
}

// ============ API 路由 ============

// 获取所有数据（用于初始化）
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
  res.json(readTable('hm_content') ?? []);
});

app.post('/api/content', async (req, res) => {
  const success = await writeTable('hm_content', req.body);
  res.json({ success });
});

// 设置管理 API
app.get('/api/settings', (req, res) => {
  res.json(readTable('hm_settings') ?? {});
});

app.post('/api/settings', async (req, res) => {
  const success = await writeTable('hm_settings', req.body);
  res.json({ success });
});

// 板块管理 API
app.get('/api/sections', (req, res) => {
  res.json(readTable('hm_admin_sections') ?? []);
});

app.post('/api/sections', async (req, res) => {
  const success = await writeTable('hm_admin_sections', req.body);
  res.json({ success });
});

// 公告管理 API
app.get('/api/announcements', (req, res) => {
  res.json(readTable('hm_announcements') ?? []);
});

app.post('/api/announcements', async (req, res) => {
  const success = await writeTable('hm_announcements', req.body);
  res.json({ success });
});

// 职工管理 API
app.get('/api/staff', (req, res) => {
  res.json(readTable('hm_staff') ?? []);
});

app.post('/api/staff', async (req, res) => {
  const success = await writeTable('hm_staff', req.body);
  res.json({ success });
});

// 上传图片 API
app.post('/api/upload', (req, res) => {
  res.json({ success: true, url: '' });
});

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', db: 'lowdb', timestamp: new Date().toISOString() });
});

// ============ 启动服务器 ============

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ 服务器运行在 http://localhost:${PORT}`);
    console.log(`🗄️  数据库: lowdb (${DB_FILE})`);
  });
}).catch(err => {
  console.error('数据库初始化失败:', err);
  process.exit(1);
});
