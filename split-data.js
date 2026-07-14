/**
 * split-data.js — 将 data.js 拆分为按板块独立文件
 *
 * 用法（在项目根目录运行）:
 *   node split-data.js
 *
 * 或用 Python:
 *   python split-data.py
 *
 * 拆分结果:
 *   js/data/core.js       — settings/announcements/sections/content.index
 *   js/data/{section}.js  — 每个板块一个文件（history, people, ..., staff）
 *
 * Admin 后台导出 data.js 后，运行此脚本即可更新所有板块文件。
 */
const fs = require('fs');
const path = require('path');

const BASE = __dirname;
const DATA_JS = path.join(BASE, 'js', 'data.js');
const OUT_DIR = path.join(BASE, 'js', 'data');

// Read data.js
const content = fs.readFileSync(DATA_JS, 'utf-8');
const start = content.indexOf('{');
const end = content.lastIndexOf('}') + 1;
const data = JSON.parse(content.slice(start, end));

// Ensure output directory exists
fs.mkdirSync(OUT_DIR, { recursive: true });

// Write core.js
const corePath = path.join(OUT_DIR, 'core.js');
let coreContent = '/* core.js - meta data + index section\n * Auto-split from data.js\n */\n';
coreContent += 'window.HM_DATA = window.HM_DATA || {};\n';
coreContent += 'window.HM_DATA.settings = ' + JSON.stringify(data.settings || {}) + ';\n';
coreContent += 'window.HM_DATA.announcements = ' + JSON.stringify(data.announcements || []) + ';\n';
coreContent += 'window.HM_DATA.sections = ' + JSON.stringify(data.sections || []) + ';\n';
coreContent += 'window.HM_DATA.content = window.HM_DATA.content || {};\n';
if (data.content && data.content.index) {
  coreContent += 'window.HM_DATA.content.index = ' + JSON.stringify(data.content.index) + ';\n';
}
fs.writeFileSync(corePath, coreContent, 'utf-8');
console.log('core.js: ' + (coreContent.length / 1024).toFixed(1) + ' KB');

// Write per-section files
let count = 0;
for (const sectionId in data.content) {
  if (sectionId === 'index') continue;
  const sectionPath = path.join(OUT_DIR, sectionId + '.js');
  let sectionContent = '/* ' + sectionId + '.js - ' + sectionId + ' section data\n */\n';
  sectionContent += 'window.HM_DATA = window.HM_DATA || {};\n';
  sectionContent += 'window.HM_DATA.content = window.HM_DATA.content || {};\n';
  sectionContent += 'window.HM_DATA.content.' + sectionId + ' = ' + JSON.stringify(data.content[sectionId]) + ';\n';
  fs.writeFileSync(sectionPath, sectionContent, 'utf-8');
  console.log(sectionId + '.js: ' + (sectionContent.length / 1024).toFixed(1) + ' KB');
  count++;
}

console.log('\nDone! ' + (count + 1) + ' files written to js/data/');
console.log('Original data.js: ' + (content.length / 1024).toFixed(1) + ' KB');
