/**
 * publish.js — 一键发布脚本
 *
 * 用法（在项目根目录运行）:
 *   node publish.js "更新了历史沿革板块内容"
 *   node publish.js                    （不带说明则用默认消息）
 *
 * 前提: 先在后台管理点「导出数据」下载 data.js，替换 js/data.js
 *
 * 执行步骤:
 *   1. 拆分 js/data.js → js/data/ 下 14 个板块文件
 *   2. git add js/data/ js/data.js
 *   3. git commit
 *   4. git push
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const BASE = __dirname;
const DATA_JS = path.join(BASE, 'js', 'data.js');
const OUT_DIR = path.join(BASE, 'js', 'data');

var msg = process.argv[2] || 'data: 更新网站内容';

function run(cmd) {
  console.log('> ' + cmd);
  execSync(cmd, { cwd: BASE, stdio: 'pipe' });
}

function runGet(cmd) {
  return execSync(cmd, { cwd: BASE, encoding: 'utf-8' }).trim();
}

// Step 0: 检查 data.js 是否存在
if (!fs.existsSync(DATA_JS)) {
  console.error('错误: js/data.js 不存在！请先在后台管理导出数据并替换 js/data.js');
  process.exit(1);
}

// Step 1: 拆分 data.js
console.log('\n=== Step 1: 拆分 data.js ===');
var content = fs.readFileSync(DATA_JS, 'utf-8');
var start = content.indexOf('{');
var end = content.lastIndexOf('}') + 1;
var data = JSON.parse(content.slice(start, end));

fs.mkdirSync(OUT_DIR, { recursive: true });

// core.js
var coreContent = '/* core.js - meta data + index section\n * Auto-split from data.js\n */\n';
coreContent += 'window.HM_DATA = window.HM_DATA || {};\n';
coreContent += 'window.HM_DATA.settings = ' + JSON.stringify(data.settings || {}) + ';\n';
coreContent += 'window.HM_DATA.announcements = ' + JSON.stringify(data.announcements || []) + ';\n';
coreContent += 'window.HM_DATA.sections = ' + JSON.stringify(data.sections || []) + ';\n';
coreContent += 'window.HM_DATA.content = window.HM_DATA.content || {};\n';
if (data.content && data.content.index) {
  coreContent += 'window.HM_DATA.content.index = ' + JSON.stringify(data.content.index) + ';\n';
}
// 保留 core.js 中的全局工具函数
coreContent += '\n// 全局工具函数：合并板块文件数据和 localStorage CMS 编辑\n';
coreContent += 'window.hmGetContent = function () {\n';
coreContent += '  var merged = {};\n';
coreContent += '  if (window.HM_DATA && window.HM_DATA.content) {\n';
coreContent += '    for (var k in window.HM_DATA.content) merged[k] = window.HM_DATA.content[k];\n';
coreContent += '  }\n';
coreContent += '  try {\n';
coreContent += '    var local = JSON.parse(localStorage.getItem(\'hm_content\') || \'{}\');\n';
coreContent += '    if (local && typeof local === \'object\') {\n';
coreContent += '      for (var k in local) merged[k] = local[k];\n';
coreContent += '    }\n';
coreContent += '  } catch (e) { console.error(\'[core] 数据合并异常:\', e); }\n';
coreContent += '  return merged;\n';
coreContent += '};\n';
coreContent += 'window.hmEsc = function (str) {\n';
coreContent += '  return String(str || \'\')\n';
coreContent += '    .replace(/&/g, \'&amp;\')\n';
coreContent += '    .replace(/</g, \'&lt;\')\n';
coreContent += '    .replace(/>/g, \'&gt;\')\n';
coreContent += '    .replace(/"/g, \'&quot;\');\n';
coreContent += '};\n';
coreContent += '\n// 全局净化函数：防止 XSS\n';
coreContent += 'window.hmSanitize = function (html) {\n';
coreContent += '  if (typeof html !== \'string\') return \'\';\n';
coreContent += '  if (window.DOMPurify) return window.DOMPurify.sanitize(html, { ALLOWED_TAGS: [\'p\',\'br\',\'small\',\'strong\',\'em\',\'b\',\'i\',\'span\',\'div\',\'a\',\'img\',\'ul\',\'ol\',\'li\',\'h3\',\'h4\',\'h5\',\'blockquote\',\'table\',\'tr\',\'td\',\'th\',\'thead\',\'tbody\',\'sub\',\'sup\',\'hr\'], ALLOWED_ATTR: [\'href\',\'src\',\'alt\',\'title\',\'class\',\'target\',\'style\',\'colspan\',\'rowspan\'], ALLOW_DATA_ATTR: false });\n';
coreContent += '  return html\n';
coreContent += '    .replace(/<script[\\s\\S]*?<\\/script>/gi, \'\')\n';
coreContent += '    .replace(/\\son\\w+\\s*=\\s*"[^"]*"/gi, \'\')\n';
coreContent += '    .replace(/\\son\\w+\\s*=\\s*\'[^\']*\'/gi, \'\')\n';
coreContent += '    .replace(/\\son\\w+\\s*=\\s*[^\\s>]+/gi, \'\')\n';
coreContent += '    .replace(/javascript:/gi, \'\')\n';
coreContent += '    .replace(/<iframe[\\s\\S]*?<\\/iframe>/gi, \'\');\n';
coreContent += '};\n';
coreContent += '\n// 全局安全读取 localStorage JSON 数据\n';
coreContent += 'window.hmGetJSON = function (key, expectedType, fallback) {\n';
coreContent += '  try {\n';
coreContent += '    var raw = localStorage.getItem(key);\n';
coreContent += '    if (!raw) return fallback;\n';
coreContent += '    var parsed = JSON.parse(raw);\n';
coreContent += '    if (expectedType === \'array\' && !Array.isArray(parsed)) return fallback;\n';
coreContent += '    if (expectedType === \'object\' && (typeof parsed !== \'object\' || Array.isArray(parsed) || parsed === null)) return fallback;\n';
coreContent += '    return parsed;\n';
coreContent += '  } catch (e) {\n';
coreContent += '    console.error(\'[core] localStorage 读取异常:\', key, e);\n';
coreContent += '    return fallback;\n';
coreContent += '  }\n';
coreContent += '};\n';
coreContent += '\n// 动态加载 DOMPurify（异步，不阻塞页面）\n';
coreContent += '(function () {\n';
coreContent += '  if (window.DOMPurify) return;\n';
coreContent += '  var s = document.createElement(\'script\');\n';
coreContent += '  s.src = \'https://cdn.jsdelivr.net/npm/dompurify@3.2.4/dist/purify.min.js\';\n';
coreContent += '  s.async = true;\n';
coreContent += '  s.onerror = function () { console.warn(\'[core] DOMPurify 加载失败，使用降级净化\'); };\n';
coreContent += '  document.head.appendChild(s);\n';
coreContent += '})();\n';

fs.writeFileSync(path.join(OUT_DIR, 'core.js'), coreContent, 'utf-8');
console.log('core.js: ' + (coreContent.length / 1024).toFixed(1) + ' KB');

var count = 0;
for (var sectionId in data.content) {
  if (sectionId === 'index') continue;
  var sectionContent = '/* ' + sectionId + '.js - ' + sectionId + ' section data\n */\n';
  sectionContent += 'window.HM_DATA = window.HM_DATA || {};\n';
  sectionContent += 'window.HM_DATA.content = window.HM_DATA.content || {};\n';
  sectionContent += 'window.HM_DATA.content.' + sectionId + ' = ' + JSON.stringify(data.content[sectionId]) + ';\n';
  fs.writeFileSync(path.join(OUT_DIR, sectionId + '.js'), sectionContent, 'utf-8');
  console.log(sectionId + '.js: ' + (sectionContent.length / 1024).toFixed(1) + ' KB');
  count++;
}
console.log('拆分完成: ' + (count + 1) + ' 个文件');

// Step 2: git add
console.log('\n=== Step 2: git add ===');
run('git add js/data/ js/data.js');

// Step 3: git commit
console.log('\n=== Step 3: git commit ===');
var status = runGet('git status --porcelain');
if (!status) {
  console.log('没有改动，跳过提交');
} else {
  run('git commit -m "' + msg + '"');
  console.log('提交成功: ' + msg);
}

// Step 4: git push
console.log('\n=== Step 4: git push ===');
run('git push origin fix-for-codex');
console.log('推送完成!');

console.log('\n=== 发布完成 ===');
console.log('GitHub Pages 将在 1-2 分钟内自动部署');
