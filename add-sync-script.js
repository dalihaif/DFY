/**
 * 批量添加 localStorage-sync.js 到所有 HTML 文件
 * 使用方法：node add-sync-script.js
 */

const fs = require('fs');
const path = require('path');

const SCRIPT_TAG = '  <!-- ====== 数据同步脚本（自动同步 localStorage 到服务器）====== -->\n  <script src="js/localStorage-sync.js"></script>';

const HTML_FILES = [
  'index.html',
  'admin/index.html',
  ...fs.readdirSync('pages').filter(f => f.endsWith('.html')).map(f => `pages/${f}`)
];

let addedCount = 0;
let skippedCount = 0;

HTML_FILES.forEach(filePath => {
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️ 文件不存在: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  // 检查是否已经添加过
  if (content.includes('localStorage-sync.js')) {
    console.log(`⏭️ 跳过（已存在）: ${filePath}`);
    skippedCount++;
    return;
  }

  // 在第一个 <script> 标签之前插入
  const insertPos = content.indexOf('<script');
  if (insertPos === -1) {
    console.warn(`⚠️ 未找到 <script> 标签: ${filePath}`);
    return;
  }

  const before = content.substring(0, insertPos);
  const after = content.substring(insertPos);
  
  content = before + SCRIPT_TAG + '\n' + after;

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ 已添加: ${filePath}`);
  addedCount++;
});

console.log(`\n完成！添加了 ${addedCount} 个文件，跳过 ${skippedCount} 个文件。`);
