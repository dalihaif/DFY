const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'server', 'data');

// 中间件
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.static(__dirname));

// 确保数据目录存在
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// 读取数据文件
function readDataFile(filename) {
  const filePath = path.join(DATA_DIR, filename);
  try {
    if (!fs.existsSync(filePath)) {
      return [];
    }
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    console.error(`读取文件失败 ${filename}:`, e);
    return [];
  }
}

// 写入数据文件
function writeDataFile(filename, data) {
  const filePath = path.join(DATA_DIR, filename);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (e) {
    console.error(`写入文件失败 ${filename}:`, e);
    return false;
  }
}

// API 路由

// 获取所有数据（用于初始化）
app.get('/api/all-data', (req, res) => {
  const files = [
    'hm_content.json',
    'hm_settings.json',
    'hm_admin_sections.json',
    'hm_announcements.json',
    'hm_staff.json'
  ];
  
  const result = {};
  files.forEach(file => {
    const key = file.replace('.json', '');
    result[key] = readDataFile(file);
  });
  
  res.json(result);
});

// 内容管理 API
app.get('/api/content', (req, res) => {
  const data = readDataFile('hm_content.json');
  res.json(data);
});

app.post('/api/content', (req, res) => {
  const success = writeDataFile('hm_content.json', req.body);
  res.json({ success });
});

// 设置管理 API
app.get('/api/settings', (req, res) => {
  const data = readDataFile('hm_settings.json');
  res.json(data);
});

app.post('/api/settings', (req, res) => {
  const success = writeDataFile('hm_settings.json', req.body);
  res.json({ success });
});

// 板块管理 API
app.get('/api/sections', (req, res) => {
  const data = readDataFile('hm_admin_sections.json');
  res.json(data);
});

app.post('/api/sections', (req, res) => {
  const success = writeDataFile('hm_admin_sections.json', req.body);
  res.json({ success });
});

// 公告管理 API
app.get('/api/announcements', (req, res) => {
  const data = readDataFile('hm_announcements.json');
  res.json(data);
});

app.post('/api/announcements', (req, res) => {
  const success = writeDataFile('hm_announcements.json', req.body);
  res.json({ success });
});

// 职工管理 API
app.get('/api/staff', (req, res) => {
  const data = readDataFile('hm_staff.json');
  res.json(data);
});

app.post('/api/staff', (req, res) => {
  const success = writeDataFile('hm_staff.json', req.body);
  res.json({ success });
});

// 上传图片 API
app.post('/api/upload', (req, res) => {
  // 这里需要添加图片上传逻辑
  // 可以使用 multer 中间件
  res.json({ success: true, url: '' });
});

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`✅ 服务器运行在 http://localhost:${PORT}`);
  console.log(`📂 数据目录: ${DATA_DIR}`);
});
