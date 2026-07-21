/**
 * data-loader.js — 按需加载板块数据
 *
 * 工作原理：
 * 1. core.js (defer) 已在 HTML 中引入，包含 settings/announcements/sections/content.index
 * 2. 本脚本根据当前页面 URL 判断需要哪些板块
 * 3. 动态创建 <script> 标签加载对应板块文件
 * 4. 加载完成后派发 hm:dataready 事件，main.js/features.js/page-renderer.js 监听此事件
 * 5. 搜索页：先加载所有小板块（~27KB），派发 hm:dataready，再延迟加载 staff.js（441KB），派发 hm:staffready
 *
 * 效果：普通页面仅下载 ~5KB 数据（而非 759KB），搜索页 staff 数据不阻塞首屏
 */
(function () {
  'use strict';

  // 所有板块（除 index，index 在 core.js 中）
  var ALL_SECTIONS = [
    'history', 'people', 'disciplines', 'campus', 'education',
    'culture', 'tech', 'duty', 'honors', 'vision',
    'structure', 'leadership', 'staff'
  ];

  // 检测路径：pages/ 子目录用 ../js/data/，根目录用 js/data/
  var isInPages = location.pathname.indexOf('/pages/') >= 0;
  var dataPath = isInPages ? '../js/data/' : 'js/data/';

  // 根据当前页面确定需要加载哪些板块
  function getNeededSections() {
    var filename = location.pathname.split('/').pop() || 'index.html';

    // 搜索页需要全部板块
    if (filename === 'search.html') return 'all';

    // 时间轴页只需 history
    if (filename === 'timeline.html') return ['history'];

    // 留言墙页不需要额外板块（公告在 core.js 中）
    if (filename === 'messages.html') return [];

    // 首页不需要额外板块（index 在 core.js 中）
    if (filename === 'index.html' || filename === '') return [];

    // 板块页：01-history.html → history
    var match = filename.match(/^\d+-(.+)\.html$/);
    if (match) return [match[1]];

    return [];
  }

  // 动态加载单个 JS 文件
  function loadScript(src) {
    return new Promise(function (resolve) {
      var s = document.createElement('script');
      s.src = src;
      s.async = true;
      s.onload = function () { resolve(); };
      s.onerror = function () {
        console.warn('[DataLoader] 加载失败: ' + src);
        resolve(); // 不阻塞，继续执行
      };
      document.head.appendChild(s);
    });
  }

  // 派发事件
  function fireEvent(name) {
    var evt;
    try {
      evt = new CustomEvent(name);
    } catch (e) {
      evt = document.createEvent('Event');
      evt.initEvent(name, true, true);
    }
    window.dispatchEvent(evt);
    document.dispatchEvent(evt);
  }

  var needed = getNeededSections();

  // 无需额外板块（首页、留言墙等）
  if (needed === 'all') {
    // ===== 搜索页：先加载小板块，再延迟加载 staff =====
    var smallSections = ALL_SECTIONS.filter(function (s) { return s !== 'staff'; });

    // 并行加载所有小板块（合计 ~27KB）
    Promise.all(smallSections.map(function (s) {
      return loadScript(dataPath + s + '.js');
    })).then(function () {
      // 小板块就绪 → 搜索可以立即工作（除 staff 外）
      fireEvent('hm:dataready');

      // 延迟加载 staff（441KB），不阻塞首屏
      setTimeout(function () {
        loadScript(dataPath + 'staff.js').then(function () {
          fireEvent('hm:staffready');
        });
      }, 300);
    });

  } else if (needed.length > 0) {
    // ===== 普通板块页：加载对应板块 =====
    Promise.all(needed.map(function (s) {
      return loadScript(dataPath + s + '.js');
    })).then(function () {
      fireEvent('hm:dataready');
    });

  } else {
    // ===== 无需额外数据（首页、留言墙等） =====
    // core.js 已包含所需数据，延迟派发以确保 main.js/features.js 已注册监听器
    // （defer 脚本按序同步执行，data-loader 在 main.js 之前，同步派发会导致事件丢失）
    setTimeout(function () { fireEvent('hm:dataready'); }, 0);
  }
})();
