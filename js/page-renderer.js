/**
 * 前台页面渲染引擎 - page-renderer.js
 * 功能：从 localStorage（同步自服务器）读取 hm_content，动态渲染前台页面内容
 * 用法：在每个 pages/*.html 的 <body data-section="history"> 中声明板块ID，然后引入此脚本
 *
 * 数据来源：localStorage.hm_content[sectionId]
 * 支持类型：hero / block / timeline / gallery / leader / leadership / profile / dataCard / staffRoster
 */

(function () {
  'use strict';

  // ======================================
  // 工具函数
  // ======================================
  function esc(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function getContent() {
    try {
      return JSON.parse(localStorage.getItem('hm_content') || '{}');
    } catch (e) { return {}; }
  }

  function getSettings() {
    try {
      return JSON.parse(localStorage.getItem('hm_settings') || '{}');
    } catch (e) { return {}; }
  }

  // ======================================
  // 获取当前页面的板块ID
  // 方式1：<body data-section="history">
  // 方式2：从文件名推断 (01-history.html → history)
  // ======================================
  function getSectionId() {
    var bodyAttr = document.body.getAttribute('data-section');
    if (bodyAttr) return bodyAttr;

    var filename = location.pathname.split('/').pop();
    var match = filename.match(/^\d+-(.+)\.html$/);
    if (match) return match[1];

    return null;
  }

  // ======================================
  // 渲染 Hero 区
  // ======================================
  function renderHero(hero) {
    if (!hero) return;

    // 背景图
    if (hero.bgImage) {
      var bgImg = document.querySelector('.page-hero-bg');
      if (bgImg) {
        bgImg.src = hero.bgImage;
        bgImg.style.display = '';
      }
    }

    // 编号标签
    if (hero.num) {
      var numEl = document.querySelector('.page-hero-num');
      if (numEl) numEl.textContent = hero.num;
    }

    // 主标题
    if (hero.title) {
      var titleEl = document.querySelector('.page-hero-title');
      if (titleEl) titleEl.textContent = hero.title;
      // 同步浏览器标题
      document.title = hero.title + ' — 云端院史馆';
    }

    // 副标题
    if (hero.subtitle) {
      var subEl = document.querySelector('.page-hero-sub');
      if (subEl) subEl.textContent = hero.subtitle;
    }

    // 描述文字
    if (hero.desc) {
      var descEl = document.querySelector('.page-hero-desc');
      if (descEl) {
        // 保留 <span class="hospital-age"> 等动态元素
        var ageSpans = descEl.querySelectorAll('.hospital-age, .hospital-year-now');
        var ageValues = {};
        ageSpans.forEach(function (sp) {
          ageValues[sp.className] = sp.textContent;
        });
        descEl.innerHTML = esc(hero.desc).replace(/\n/g, '<br>');
        // 恢复动态span（如果desc文字中没有这些span，则追加）
      }
    }
  }

  // ======================================
  // 渲染内容区块（block）
  // ======================================
  function renderBlocks(blocks) {
    if (!Array.isArray(blocks) || blocks.length === 0) return;

    var sectionBody = document.querySelector('.section-body');
    if (!sectionBody) return;

    // 找到所有现有的 .section-block 元素
    var existingBlocks = sectionBody.querySelectorAll('.section-block');

    blocks.forEach(function (blk, idx) {
      var el = existingBlocks[idx];
      if (!el) return; // 只更新已存在的区块，不新增（防止破坏HTML结构）

      // 编号
      var numEl = el.querySelector('.block-num');
      if (numEl && blk.num) numEl.textContent = blk.num;

      // 标题
      var titleEl = el.querySelector('.block-title');
      if (titleEl && blk.title) titleEl.textContent = blk.title;

      // 副标题
      var subEl = el.querySelector('.block-sub');
      if (subEl && blk.subtitle) subEl.textContent = blk.subtitle;

      // 正文
      var textEl = el.querySelector('.content-text');
      if (textEl && blk.text) {
        // text 字段本身可能包含HTML
        textEl.innerHTML = blk.text;
      }

      // 图片槽
      var imgSlot = el.querySelector('.img-slot');
      if (imgSlot) {
        if (blk.imgUrl) {
          // 有真实图片URL则渲染图片
          imgSlot.innerHTML =
            '<img src="' + esc(blk.imgUrl) + '" alt="' + esc(blk.imgLabel || '') + '" ' +
            'style="width:100%;height:100%;object-fit:cover;border-radius:8px;" ' +
            'onerror="this.parentNode.innerHTML=\'<div class=img-slot-icon>' + esc(blk.imgIcon || '📷') + '</div><div class=img-slot-label>' + esc(blk.imgLabel || '') + '</div>\'">';
        } else {
          var iconEl = imgSlot.querySelector('.img-slot-icon');
          var labelEl = imgSlot.querySelector('.img-slot-label');
          var sizeEl = imgSlot.querySelector('.img-slot-size');
          if (iconEl && blk.imgIcon) iconEl.textContent = blk.imgIcon;
          if (labelEl && blk.imgLabel) labelEl.textContent = blk.imgLabel;
          if (sizeEl && blk.imgSize) sizeEl.textContent = blk.imgSize;
        }
      }
    });
  }

  // ======================================
  // 渲染时间线（timeline）
  // ======================================
  function renderTimeline(timeline) {
    if (!Array.isArray(timeline) || timeline.length === 0) return;

    var tlContainer = document.querySelector('.timeline');
    if (!tlContainer) return;

    var existingNodes = tlContainer.querySelectorAll('.tl-node');

    timeline.forEach(function (item, idx) {
      var node = existingNodes[idx];
      if (!node) return;

      var yearEl = node.querySelector('.tl-year');
      var titleEl = node.querySelector('.tl-title');
      var descEl = node.querySelector('.tl-desc');
      var dotEl = node.querySelector('.tl-dot');

      if (yearEl && item.year) yearEl.textContent = item.year;
      if (titleEl && item.title) titleEl.textContent = item.title;
      if (descEl && item.desc) descEl.textContent = item.desc;
      if (dotEl && item.dot) dotEl.textContent = item.dot;
    });
  }

  // ======================================
  // 渲染图片画廊（gallery）
  // ======================================
  function renderGallery(gallery) {
    if (!Array.isArray(gallery) || gallery.length === 0) return;

    var galleryGrid = document.querySelector('.gallery-grid');
    if (!galleryGrid) return;

    var existingItems = galleryGrid.querySelectorAll('.gallery-item');

    gallery.forEach(function (item, idx) {
      var el = existingItems[idx];
      if (!el) return;

      var iconEl = el.querySelector('.gallery-item-icon');
      var labelEl = el.querySelector('.gallery-item-label');

      if (item.imgUrl) {
        // 有真实图片URL
        el.style.backgroundImage = 'url(' + item.imgUrl + ')';
        el.style.backgroundSize = 'cover';
        el.style.backgroundPosition = 'center';
        if (iconEl) iconEl.style.display = 'none';
        if (labelEl) labelEl.textContent = item.label || '';
      } else {
        if (iconEl && item.icon) iconEl.textContent = item.icon;
        if (labelEl && item.label) labelEl.textContent = item.label;
      }
    });
  }

  // ======================================
  // 渲染历任院领导（leader）
  // ======================================
  function renderLeaders(leaders) {
    if (!Array.isArray(leaders) || leaders.length === 0) return;

    var prezSection = document.querySelector('.leaders-section, .section-block--leaders');
    if (!prezSection) return;

    // 分组：院长 / 党委书记
    var presidents = leaders.filter(function (l) { return l.category === '院长' || !l.category || l.category === 'president'; });
    var secretaries = leaders.filter(function (l) { return l.category === '党委书记' || l.category === 'secretary'; });

    function renderGroup(items, gridSelector) {
      var grid = prezSection.querySelector(gridSelector);
      if (!grid || items.length === 0) return;
      grid.innerHTML = items.map(function (p) {
        var photoHtml = p.photo
          ? '<img src="' + esc(p.photo) + '" alt="' + esc(p.name) + '" onerror="this.style.display=\'none\'">'
          : '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:2rem;color:var(--accent)">👤</div>';
        return '<div class="leader-card">' +
          '<div class="leader-photo">' + photoHtml + '</div>' +
          '<div class="leader-info">' +
            '<div class="leader-name">' + esc(p.name) + '</div>' +
            '<div class="leader-years">' + esc(p.years || '') + '</div>' +
            (p.era ? '<div class="leader-era">' + esc(p.era) + '</div>' : '') +
            (p.desc ? '<p class="leader-desc">' + esc(p.desc) + '</p>' : '') +
          '</div></div>';
      }).join('');
    }

    renderGroup(presidents, '.presidents-grid, .leader-grid--president');
    renderGroup(secretaries, '.secretaries-grid, .leader-grid--secretary');
  }

  // ======================================
  // 渲染当届领导班子（leadership）
  // ======================================
  function renderLeadership(leadershipList) {
    if (!Array.isArray(leadershipList) || leadershipList.length === 0) return;

    var grid = document.querySelector('.leadership-grid, .current-leaders-grid');
    if (!grid) return;

    grid.innerHTML = leadershipList.map(function (p) {
      var photoHtml = p.photo
        ? '<img src="' + esc(p.photo) + '" alt="' + esc(p.name) + '" onerror="this.style.display=\'none\'">'
        : '<div style="font-size:3rem;text-align:center;padding:20px;color:var(--accent)">👤</div>';
      return '<div class="leadership-card">' +
        '<div class="leadership-photo">' + photoHtml + '</div>' +
        '<div class="leadership-info">' +
          '<div class="leadership-name">' + esc(p.name) + '</div>' +
          '<div class="leadership-role">' + esc(p.role || '') + '</div>' +
          (p.duty ? '<p class="leadership-duty">' + esc(p.duty) + '</p>' : '') +
          (p.resume ? '<p class="leadership-resume">' + esc(p.resume) + '</p>' : '') +
        '</div></div>';
    }).join('');
  }

  // ======================================
  // 渲染人物名片（profile）
  // ======================================
  function renderProfiles(secData) {
    function doRender(items, gridSelector) {
      if (!Array.isArray(items) || items.length === 0) return;
      var grid = document.querySelector(gridSelector);
      if (!grid) return;
      grid.innerHTML = items.map(function (p) {
        var photoHtml = p.photo
          ? '<img src="' + esc(p.photo) + '" alt="' + esc(p.name) + '" style="width:100%;height:100%;object-fit:cover;" onerror="this.style.display=\'none\'">'
          : '<div style="font-size:2rem;text-align:center;padding:20px;color:var(--accent)">👤</div>';
        return '<div class="profile-card">' +
          '<div class="profile-photo">' + photoHtml + '</div>' +
          '<div class="profile-info">' +
            '<div class="profile-name">' + esc(p.name) + '</div>' +
            (p.title ? '<div class="profile-title">' + esc(p.title) + '</div>' : '') +
            (p.dept ? '<div class="profile-dept">' + esc(p.dept) + '</div>' : '') +
            (p.desc ? '<p class="profile-desc">' + esc(p.desc) + '</p>' : '') +
          '</div></div>';
      }).join('');
    }

    if (secData.profiles) doRender(secData.profiles, '.profiles-grid, .profile-grid--primary');
    if (secData.profiles2) doRender(secData.profiles2, '.profiles2-grid, .profile-grid--secondary');
  }

  // ======================================
  // 渲染数据卡（dataCard）
  // ======================================
  function renderDataCards(dataCards) {
    if (!Array.isArray(dataCards) || dataCards.length === 0) return;

    var grid = document.querySelector('.data-cards-grid, .stats-grid');
    if (!grid) return;

    var existingCards = grid.querySelectorAll('.data-card, .stat-card');
    dataCards.forEach(function (dc, idx) {
      var card = existingCards[idx];
      if (!card) return;
      var iconEl = card.querySelector('.dc-icon-display, .stat-icon');
      var valueEl = card.querySelector('.dc-value-display, .stat-value');
      var labelEl = card.querySelector('.dc-label-display, .stat-label');
      var noteEl = card.querySelector('.dc-note-display, .stat-note');
      if (iconEl && dc.icon) iconEl.textContent = dc.icon;
      if (valueEl && dc.value) valueEl.textContent = dc.value;
      if (labelEl && dc.label) labelEl.textContent = dc.label;
      if (noteEl && dc.note) noteEl.textContent = dc.note;
    });
  }

  // ======================================
  // 渲染网站设置（settings）
  // ======================================
  function renderSettings(settings) {
    if (!settings) return;

    // 页脚版权文字
    if (settings.footer_text) {
      document.querySelectorAll('.footer-copyright').forEach(function (el) {
        el.textContent = settings.footer_text;
      });
    }

    // 官网链接
    if (settings.officialUrl) {
      document.querySelectorAll('a.btn-official').forEach(function (el) {
        el.href = settings.officialUrl;
      });
    }
  }

  // ======================================
  // 主渲染函数
  // ======================================
  function renderPage() {
    var secId = getSectionId();
    if (!secId) {
      console.warn('[page-renderer] 无法获取板块ID，请在 <body data-section="xxx"> 中声明');
      return;
    }

    var content = getContent();
    var secData = content[secId];
    if (!secData) {
      // 服务器数据尚未同步，稍后重试
      return;
    }

    var settings = getSettings();
    renderSettings(settings);

    // 按数据类型分别渲染
    if (secData.hero)       renderHero(secData.hero);
    if (secData.blocks)     renderBlocks(secData.blocks);
    if (secData.timeline)   renderTimeline(secData.timeline);
    if (secData.gallery)    renderGallery(secData.gallery);
    if (secData.leaders)    renderLeaders(secData.leaders);
    if (secData.leaders && secData.leaders.some(function(l){ return l.role; }))
                            renderLeadership(secData.leaders);
    if (secData.profiles || secData.profiles2) renderProfiles(secData);
    if (secData.dataCards)  renderDataCards(secData.dataCards);

    console.log('[page-renderer] 板块 "' + secId + '" 内容已渲染');
  }

  // ======================================
  // 初始化 — 等 DOM + 数据都就绪后渲染
  // ======================================
  function init() {
    // 立即尝试渲染（localStorage 中已有数据时直接生效）
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', renderPage);
    } else {
      renderPage();
    }

    // 监听服务器数据加载完毕事件（localStorage-sync.js 触发）
    window.addEventListener('serverDataLoaded', function () {
      renderPage();
    });
  }

  init();

  // 暴露给外部调用
  window.PageRenderer = { render: renderPage, getSectionId: getSectionId };

})();
