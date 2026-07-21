/* core.js - meta data + index section
 * Auto-split from data.js
 * Contains: settings, announcements, sections, content.index
 */
window.HM_DATA = window.HM_DATA || {};
window.HM_DATA.settings = {"siteTitle": "云端院史馆", "siteSubtitle": "大理大学第一附属医院", "officialUrl": "https://www.dfy.dali.edu.cn", "contactEmail": "", "contactPhone": "", "foundedYear": 1991};
window.HM_DATA.announcements = [{"id": 1, "title": "大理大学第一附属医院2025年度工作报告", "date": "2025-05-20", "category": "notice", "dept": "院办", "content": "年度工作报告全文…", "published": true}, {"id": 2, "title": "关于开展2025年\"5·12\"国际护士节系列活动的通知", "date": "2025-05-10", "category": "event", "dept": "护理部", "content": "活动详情…", "published": true}, {"id": 3, "title": "关于2025年职称评审工作的通知", "date": "2025-05-08", "category": "hr", "dept": "人事科", "content": "评审条件与流程…", "published": true}, {"id": 4, "title": "关于召开2025年科研工作推进会的通知", "date": "2025-04-28", "category": "academic", "dept": "科研科", "content": "会议议程…", "published": true}, {"id": 5, "title": "2025年劳动节放假及值班安排", "date": "2025-04-25", "category": "notice", "dept": "院办", "content": "值班表…", "published": true}, {"id": 6, "title": "关于启动2026年度国家自然科学基金申报工作的通知", "date": "2025-04-15", "category": "academic", "dept": "科研科", "content": "申报指南…", "published": true}, {"id": 7, "title": "云端院史馆声明 ", "date": "2026-06-11", "category": "notice", "dept": "综合档案室", "content": "此云端院史馆非官网，系个人兴趣所致，加之对医院的热爱而创作。", "published": true}];
window.HM_DATA.sections = {"index": {"title": "网站首页", "status": "published", "updatedAt": "2026-06-11", "notes": ""}, "history": {"title": "历史沿革", "status": "published", "updatedAt": "2026-06-11", "notes": ""}, "people": {"title": "人物风采", "status": "published", "updatedAt": "2026-06-11", "notes": ""}, "disciplines": {"title": "学科建设", "status": "published", "updatedAt": "2026-06-11", "notes": ""}, "campus": {"title": "院区建设", "status": "published", "updatedAt": "2026-06-11", "notes": ""}, "education": {"title": "教学人才", "status": "published", "updatedAt": "2026-06-11", "notes": ""}, "culture": {"title": "文化建设", "status": "published", "updatedAt": "2026-06-11", "notes": ""}, "tech": {"title": "科技交流", "status": "published", "updatedAt": "2026-06-11", "notes": ""}, "duty": {"title": "责任担当", "status": "published", "updatedAt": "2026-06-11", "notes": ""}, "honors": {"title": "荣誉殿堂", "status": "published", "updatedAt": "2026-06-11", "notes": ""}, "vision": {"title": "展望未来", "status": "published", "updatedAt": "2026-06-11", "notes": ""}, "structure": {"title": "组织架构", "status": "published", "updatedAt": "2026-06-11", "notes": ""}, "leadership": {"title": "领导团队", "status": "published", "updatedAt": "2026-06-11", "notes": ""}, "staff": {"title": "职工名录", "status": "published", "updatedAt": "2026-06-11", "notes": ""}};
window.HM_DATA.content = window.HM_DATA.content || {};
window.HM_DATA.content.index = {"gallery": [{"icon": "📷", "label": "1992年奠基典礼<br><small>历史影像</small>", "url": "../assets/images/kgdl.webp"}, {"icon": "📷", "label": "1997年正式开诊<br><small>珍贵历史</small>", "url": "../assets/images/kzys.webp"}, {"icon": "📷", "label": "2015年三甲评审<br><small>里程碑时刻</small>", "url": "/assets/images/sjzp.webp"}, {"icon": "📷", "label": "2020年抗疫驰援<br><small>逆行英雄</small>", "url": ""}], "hero": {"bgImage": "", "title": "", "tag": "", "desc": "", "flipItems": [], "cta1Text": "", "cta1Link": "", "cta2Text": ""}, "sectionCards": [], "footer": {"slogan": "", "addr": "", "phones": "", "copyright": ""}, "statsBar": [{"value": "162", "unit": "亩", "label": "总占地面积"}, {"value": "1946", "unit": "人", "label": "全院职工"}, {"value": "1500", "unit": "张", "label": "编制床位"}, {"value": "11.15", "unit": "亿", "label": "资产总额"}, {"value": "41", "unit": "个", "label": "临床科室"}]};

// 全局工具函数：合并板块文件数据和 localStorage CMS 编辑
window.hmGetContent = function () {
  var merged = {};
  if (window.HM_DATA && window.HM_DATA.content) {
    for (var k in window.HM_DATA.content) merged[k] = window.HM_DATA.content[k];
  }
  try {
    var local = JSON.parse(localStorage.getItem('hm_content') || '{}');
    if (local && typeof local === 'object') {
      for (var k in local) merged[k] = local[k];
    }
  } catch (e) { console.error('[core] 数据合并异常:', e); }
  return merged;
};
window.hmEsc = function (str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
};

// 全局净化函数：防止 XSS
// 优先使用 DOMPurify（动态加载），降级到轻量正则净化
window.hmSanitize = function (html) {
  if (typeof html !== 'string') return '';
  // DOMPurify 已加载则使用
  if (window.DOMPurify) return window.DOMPurify.sanitize(html, { ALLOWED_TAGS: ['p','br','small','strong','em','b','i','span','div','a','img','ul','ol','li','h3','h4','h5','blockquote','table','tr','td','th','thead','tbody','sub','sup','hr'], ALLOWED_ATTR: ['href','src','alt','title','class','target','style','colspan','rowspan'], ALLOW_DATA_ATTR: false });
  // 降级：移除 script/事件属性/javascript 协议
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/\son\w+\s*=\s*"[^"]*"/gi, '')
    .replace(/\son\w+\s*=\s*'[^']*'/gi, '')
    .replace(/\son\w+\s*=\s*[^\s>]+/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, '');
};

// 全局安全读取 localStorage JSON 数据
// key: localStorage 键名, expectedType: 'array'|'object'|null(不校验), fallback: 失败时的默认值
window.hmGetJSON = function (key, expectedType, fallback) {
  try {
    var raw = localStorage.getItem(key);
    if (!raw) return fallback;
    var parsed = JSON.parse(raw);
    if (expectedType === 'array' && !Array.isArray(parsed)) return fallback;
    if (expectedType === 'object' && (typeof parsed !== 'object' || Array.isArray(parsed) || parsed === null)) return fallback;
    return parsed;
  } catch (e) {
    console.error('[core] localStorage 读取异常:', key, e);
    return fallback;
  }
};

// 动态加载 DOMPurify（异步，不阻塞页面）
(function () {
  if (window.DOMPurify) return;
  var s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/npm/dompurify@3.2.4/dist/purify.min.js';
  s.async = true;
  s.onerror = function () { console.warn('[core] DOMPurify 加载失败，使用降级净化'); };
  document.head.appendChild(s);
})();
