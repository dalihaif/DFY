/**
 * 批量给所有 pages/*.html 添加：
 * 1. <body data-section="xxx"> 属性
 * 2. 引入 page-renderer.js 脚本
 */
const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'pages');

// 文件名 → 板块ID 映射
const sectionMap = {
  '01-history.html':     'history',
  '02-people.html':      'people',
  '03-disciplines.html': 'disciplines',
  '04-campus.html':      'campus',
  '05-education.html':   'education',
  '06-culture.html':     'culture',
  '07-tech.html':        'tech',
  '08-duty.html':        'duty',
  '09-honors.html':      'honors',
  '10-vision.html':      'vision',
  '11-structure.html':   'structure',
  '12-leadership.html':  'leadership',
  '13-staff.html':       'staff'
};

let changed = 0;

Object.entries(sectionMap).forEach(([filename, sectionId]) => {
  const filePath = path.join(pagesDir, filename);
  if (!fs.existsSync(filePath)) {
    console.log(`[跳过] ${filename} 不存在`);
    return;
  }

  let html = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // 1. 给 <body> 添加 data-section 属性（如果没有）
  if (!html.includes('data-section=')) {
    html = html.replace(/<body(\s[^>]*)?>/, (match, attrs) => {
      attrs = attrs || '';
      return `<body${attrs} data-section="${sectionId}">`;
    });
    modified = true;
    console.log(`[✓] ${filename} 添加 data-section="${sectionId}"`);
  } else {
    console.log(`[跳过] ${filename} 已有 data-section`);
  }

  // 2. 在 localStorage-sync.js 后面添加 page-renderer.js（如果没有）
  if (!html.includes('page-renderer.js')) {
    html = html.replace(
      '<script src="../js/localStorage-sync.js"></script>',
      '<script src="../js/localStorage-sync.js"></script>\n  <script src="../js/page-renderer.js"></script>'
    );
    modified = true;
    console.log(`[✓] ${filename} 添加 page-renderer.js`);
  } else {
    console.log(`[跳过] ${filename} 已有 page-renderer.js`);
  }

  if (modified) {
    fs.writeFileSync(filePath, html, 'utf8');
    changed++;
  }
});

console.log(`\n完成！共修改 ${changed} 个文件`);
