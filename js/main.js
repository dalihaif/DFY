/* ============================================================
   共享 JS — 主题切换 + 导航 + 动画
   ============================================================ */

(function () {
  'use strict';

  // -------- Theme --------
  var THEME_KEY = 'museum-theme';
  var html = document.documentElement;

  function getTheme() {
    return localStorage.getItem(THEME_KEY) || 'dark';
  }

  function applyTheme(t) {
    html.setAttribute('data-theme', t);
    var btn = document.querySelector('.btn-theme');
    if (btn) btn.textContent = t === 'dark' ? '☀️' : '🌙';
    localStorage.setItem(THEME_KEY, t);
  }

  function toggleTheme() {
    applyTheme(getTheme() === 'dark' ? 'light' : 'dark');
  }

  // apply on load
  applyTheme(getTheme());

  // expose
  window.toggleTheme = toggleTheme;

  // -------- 数据读取（优先 data.js，fallback localStorage）--------
  // data.js 注入 window.HM_DATA，包含 content/settings/announcements/sections
  // 若 data.js 字段为空对象/空数组，则回退到 localStorage（本地编辑预览）
  var _hmData = (window.HM_DATA && typeof window.HM_DATA === 'object') ? window.HM_DATA : {};

  function _hasData(obj) {
    if (!obj) return false;
    if (Array.isArray(obj)) return obj.length > 0;
    return Object.keys(obj).length > 0;
  }

  // -------- Hospital age auto-calc --------
  // Read founding year from admin settings if available, else default 1991
  var hmSettings = {};
  try {
    if (_hasData(_hmData.settings)) {
      hmSettings = _hmData.settings;
    } else {
      hmSettings = JSON.parse(localStorage.getItem('hm_settings') || '{}');
    }
  } catch(e) {}
  var FOUNDED_YEAR = hmSettings.foundedYear || 1991;
  var nowYear = new Date().getFullYear();
  var hospitalAge = nowYear - FOUNDED_YEAR;

  // Fill all .hospital-age spans
  document.querySelectorAll('.hospital-age').forEach(function (el) {
    el.textContent = '' + hospitalAge;
  });

  // Fill all .hospital-year-now spans
  document.querySelectorAll('.hospital-year-now').forEach(function (el) {
    el.textContent = '' + nowYear;
  });

  // Also update meta description
  var metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc && hospitalAge) {
    metaDesc.setAttribute('content',
      metaDesc.getAttribute('content').replace(/\d+年/, hospitalAge + '\u5E74'));
  }

  // -------- Content from localStorage (主) or data.js (备) --------
  // 后台 CMS 编辑后保存到 localStorage → 前台自动生效
  // data.js 作为发布版本的快照，localStorage 优先于 data.js
  var hmContent = {};
  try {
    var localContent = JSON.parse(localStorage.getItem('hm_content') || 'null');
    var dataJsContent = _hmData && _hmData.content || null;
    var localHasData = localContent && typeof localContent === 'object' && _hasData(localContent);
    var dataJsHasData = _hasData(dataJsContent);

    // 获取后台最后编辑时间
    var lastEdit = localStorage.getItem('hm_last_edit') || '0';
    console.log('[Frontend] localStorage hm_content: ' + (localHasData ? '存在(' + Object.keys(localContent).length + '个section, 编辑时间=' + lastEdit + ')' : '无数据'));
    console.log('[Frontend] data.js content: ' + (dataJsHasData ? '存在(' + Object.keys(dataJsContent).length + '个section)' : '无数据'));

    if (localHasData) {
      // localStorage 有数据 → 优先使用（后台 CMS 刚编辑过的）
      hmContent = localContent;
      console.log('[Frontend] 数据源: localStorage (CMS 编辑数据)');
    } else if (dataJsHasData) {
      // 无本地编辑 → 使用 data.js（发布版本/首次加载）
      hmContent = dataJsContent;
      // 同步到 localStorage 作为初始数据
      try { localStorage.setItem('hm_content', JSON.stringify(hmContent)); localStorage.setItem('hm_last_edit', Date.now().toString()); } catch(e) {}
      console.log('[Frontend] 数据源: data.js (初始化本地缓存)');
    } else {
      console.log('[Frontend] 数据源: 无数据 (hmContent = {})');
    }
  } catch(e) { console.error('[Frontend] 数据读取异常:', e); }

  // 打印 staff 数据
  try {
    var _sc = hmContent.staff && Array.isArray(hmContent.staff.profiles) ? hmContent.staff.profiles.length : 0;
    console.log('[Frontend] staff.profiles 数量: ' + _sc);
  } catch(e) {}

  // Detect current page section
  function getCurrentSection() {
    var path = window.location.pathname;
    var map = {
      '01-history': 'history', '02-people': 'people', '03-disciplines': 'disciplines',
      '04-campus': 'campus', '05-education': 'education', '06-culture': 'culture',
      '07-tech': 'tech', '08-duty': 'duty', '09-honors': 'honors',
      '10-vision': 'vision', '11-structure': 'structure', '12-leadership': 'leadership',
      '13-staff': 'staff'
    };
    for (var k in map) { if (path.indexOf(k) >= 0) return hmContent[map[k]]; }
    return null;
  }

  var sectionContent = getCurrentSection();
  if (sectionContent) {
    // ---- Hero ----
    if (sectionContent.hero) {
      var h = sectionContent.hero;
      var heroBg = document.querySelector('.page-hero-bg');
      if (heroBg && h.bgImage) heroBg.setAttribute('src', h.bgImage);
      var heroNum = document.querySelector('.page-hero-num');
      if (heroNum && h.num) heroNum.textContent = h.num;
      var heroTitle = document.querySelector('.page-hero-title');
      if (heroTitle && h.title) heroTitle.textContent = h.title;
      var heroSub = document.querySelector('.page-hero-sub');
      if (heroSub && h.subtitle) heroSub.textContent = h.subtitle;
      var heroDesc = document.querySelector('.page-hero-desc');
      if (heroDesc && h.desc) heroDesc.textContent = h.desc;
    }

    // ---- Timeline (history) ----
    if (Array.isArray(sectionContent.timeline) && sectionContent.timeline.length > 0) {
      var tlContainer = document.querySelector('.timeline');
      if (tlContainer) {
        var tlHTML = '';
        sectionContent.timeline.forEach(function(t, i) {
          var side = i % 2 === 0 ? 'left' : 'right';
          if (side === 'left') {
            tlHTML += '<div class="tl-node left"><div class="tl-content fade-in"><div class="tl-year">' + esc(t.year) + '</div><div class="tl-title">' + esc(t.title) + '</div><p class="tl-desc">' + esc(t.desc) + '</p></div><div class="tl-dot-col"><div class="tl-dot">' + esc(t.dot||'●') + '</div></div><div></div></div>';
          } else {
            tlHTML += '<div class="tl-node right"><div></div><div class="tl-dot-col"><div class="tl-dot">' + esc(t.dot||'●') + '</div></div><div class="tl-content fade-in"><div class="tl-year">' + esc(t.year) + '</div><div class="tl-title">' + esc(t.title) + '</div><p class="tl-desc">' + esc(t.desc) + '</p></div></div>';
          }
        });
        tlContainer.innerHTML = tlHTML;
      }
    }

    // ---- Content Blocks ----
    if (Array.isArray(sectionContent.blocks) && sectionContent.blocks.length > 0) {
      var blockHeaders = document.querySelectorAll('.block-header');
      var contentPairs = document.querySelectorAll('.content-pair');
      var imgSlots = document.querySelectorAll('.img-slot');

      sectionContent.blocks.forEach(function(b, i) {
        // Update block header
        if (blockHeaders[i]) {
          var bh = blockHeaders[i];
          var numEl = bh.querySelector('.block-num');
          var titleEl = bh.querySelector('.block-title');
          var subEl = bh.querySelector('.block-sub');
          if (numEl && b.num) numEl.textContent = b.num;
          if (titleEl && b.title) titleEl.textContent = b.title;
          if (subEl && b.subtitle) subEl.textContent = b.subtitle;
        }
        // Update content text
        if (contentPairs[i]) {
          var ct = contentPairs[i].querySelector('.content-text');
          if (ct && b.text) ct.innerHTML = b.text;
        }
        // Update image slot
        if (imgSlots[i]) {
          var is = imgSlots[i];
          var iconEl = is.querySelector('.img-slot-icon');
          var labelEl = is.querySelector('.img-slot-label');
          var sizeEl = is.querySelector('.img-slot-size');
          if (iconEl && b.imgIcon) iconEl.textContent = b.imgIcon;
          if (labelEl && b.imgLabel) labelEl.innerHTML = b.imgLabel;
          if (sizeEl && b.imgSize) sizeEl.textContent = b.imgSize;
          // 若提供了真实图片URL，替换占位div为实际img
          if (b.imgUrl) {
            var existImg = is.querySelector('img.slot-real-img');
            if (!existImg) {
              existImg = document.createElement('img');
              existImg.className = 'slot-real-img';
              existImg.style.cssText = 'width:100%;height:100%;object-fit:cover;border-radius:inherit;position:absolute;top:0;left:0;';
              is.style.position = 'relative';
              is.appendChild(existImg);
            }
            existImg.src = b.imgUrl;
            existImg.alt = b.imgLabel || '';
            existImg.setAttribute('data-lightbox', b.imgUrl);
            existImg.setAttribute('data-lightbox-caption', b.imgLabel || '');
            existImg.style.cursor = 'zoom-in';
            // 隐藏占位内容（图标/标签/尺寸文字）
            [iconEl, labelEl, sizeEl].forEach(function(el) { if (el) el.style.display = 'none'; });
          }
        }
      });
    }

    // ---- Leaders (院长/书记)  + Leadership (领导团队) 动态渲染 ----
    if (Array.isArray(sectionContent.leaders) && sectionContent.leaders.length > 0) {
      // ====== 历任院领导 (02-people.html) ======
      var leaderGrid = document.getElementById('leader-grid-all');
      if (leaderGrid) {
        // 直接渲染全部历任院领导（不再按旧 category 过滤）
        var allLeaders = sectionContent.leaders;

        var lh = '';
        allLeaders.forEach(function(l, i) {
          var staggerN = (i % 5) + 1;
          var hasPhoto = !!(l.photo && l.photo.trim());
          var hasName = !!(l.name && l.name !== '[待补充]');
          lh += '<div class="leader-card fade-in stagger-' + staggerN + '">';
          // 照片区
          lh += '<div class="leader-photo' + (hasPhoto ? ' has-real-img' : '') + '" style="position:relative;overflow:hidden;">';
          if (hasPhoto) {
            lh += '<img class="leader-real-img" src="' + esc(l.photo.trim()) + '" alt="' + esc(l.name || '') + '" data-lightbox="' + esc(l.photo.trim()) + '" data-lightbox-caption="' + esc(l.name || '') + '" style="cursor:zoom-in;width:100%;height:100%;object-fit:cover;border-radius:inherit;position:absolute;top:0;left:0;">';
          }
          lh += '<span class="leader-photo-icon"' + (hasName && !hasPhoto ? ' style="font-size:36px;opacity:0.85"' : '') + '>' + (hasName && !hasPhoto ? l.name.charAt(0) : '👤') + '</span>';
          if (!hasPhoto) {
            lh += '<span class="leader-photo-hint">院领导照片</span>';
          }
          lh += '</div>';
          // 信息
          lh += '<div class="leader-name">' + esc(l.name || '[待补充]') + '</div>';
          lh += '<div class="leader-position">' + esc(l.position || l.category || '') + '</div>';
          lh += '<div class="leader-years">' + esc(l.years || '') + '</div>';
          if (l.era) {
            lh += '<span class="leader-era"' + (l.years && l.years.indexOf('至今')>=0 ? ' style="color:var(--gold-light);"' : '') + '>' + esc(l.era) + '</span>';
          }
          lh += '<p class="leader-desc">' + esc(l.desc || '') + '</p>';
          lh += '</div>';
        });
        leaderGrid.innerHTML = lh;
      }

      // ====== 领导团队 (12-leadership.html) ======
      var lshipGrid = document.querySelector('.leadership-grid');
      if (lshipGrid) {
        // 只渲染有 role 的数据（leadership 模式），跳过 category 模式的数据
        var lshipLeaders = sectionContent.leaders.filter(function(l) { return l.role; });
        if (lshipLeaders.length === 0) {
          // 如果没有 role 字段的数据，就用全部（可能是老数据升级）
          lshipLeaders = sectionContent.leaders;
        }
        var lsh = '';
        lshipLeaders.forEach(function(l, i) {
          var staggerN = i < 4 ? (i + 1) : ((i - 4) % 4 + 1);
          var hasPhoto = !!(l.photo && l.photo.trim());
          var hasName = !!(l.name && l.name !== '[待补充]');
          lsh += '<div class="leadership-card fade-in stagger-' + staggerN + '">';
          lsh += '<div class="leadership-photo' + (hasPhoto ? ' has-real-img' : '') + '" style="position:relative;overflow:hidden;">';
          if (hasPhoto) {
            lsh += '<img class="leadership-real-img" src="' + esc(l.photo.trim()) + '" alt="' + esc(l.name || '') + '" data-lightbox="' + esc(l.photo.trim()) + '" data-lightbox-caption="' + esc(l.name + (l.role ? ' · ' + l.role : '')) + '" style="cursor:zoom-in;width:100%;height:100%;object-fit:cover;border-radius:inherit;position:absolute;top:0;left:0;">';
          }
          if (hasName && !hasPhoto) {
            lsh += '<span class="leadership-photo-char">' + l.name.charAt(0) + '</span>';
          } else {
            lsh += '<span class="leadership-photo-icon">👨‍⚕️</span>';
            if (!hasPhoto) {
              lsh += '<span class="leadership-photo-hint">照片 4:5 竖版</span>';
            }
          }
          lsh += '</div>';
          lsh += '<div class="leadership-info">';
          lsh += '<div class="leadership-name">' + esc(l.name || '[待补充]') + '</div>';
          lsh += '<div class="leadership-role">' + esc(l.role || '') + '</div>';
          lsh += '<div class="leadership-responsibility">' + esc(l.duty || '') + '</div>';
          lsh += '<div class="leadership-resume">' + esc(l.resume || '') + '</div>';
          lsh += '</div>';
          lsh += '</div>';
        });
        lshipGrid.innerHTML = lsh;
      }
    }

    // ====== Profiles 专家群像 (02-people) - 动态渲染 ======
    if (Array.isArray(sectionContent.profiles) && sectionContent.profiles.length > 0) {
      var acGrid = document.getElementById('profile-grid-academic');
      if (acGrid) {
        var ach = '';
        sectionContent.profiles.forEach(function(p, i) {
          ach += renderProfileCard(p, i);
        });
        acGrid.innerHTML = ach;
      }
    }

    // ====== Profiles2 医学人才 (02-people) - 动态渲染 ======
    if (Array.isArray(sectionContent.profiles2) && sectionContent.profiles2.length > 0) {
      var tlGrid = document.getElementById('profile-grid-talent');
      if (tlGrid) {
        var tlh = '';
        sectionContent.profiles2.forEach(function(p, i) {
          tlh += renderProfileCard(p, i);
        });
        tlGrid.innerHTML = tlh;
      }
    }

    // ====== StatsCards 专家群像数据 (02-people) - 动态渲染 ======
    if (Array.isArray(sectionContent.statsCards) && sectionContent.statsCards.length > 0) {
      var scGrid = document.getElementById('data-grid-academic');
      if (scGrid) {
        var sch = '';
        sectionContent.statsCards.forEach(function(d, i) {
          sch += '<div class="data-card fade-in stagger-' + (i + 1) + '">' +
            '<div class="data-card-value">' + esc(d.value) + '</div>' +
            '<div class="data-card-label">' + esc(d.label) + '</div></div>';
        });
        scGrid.innerHTML = sch;
      }
    }

    // ====== DataCards 医学人才统计 (02-people) - 动态渲染 ======
    if (Array.isArray(sectionContent.dataCards) && sectionContent.dataCards.length > 0) {
      var psBanner = document.getElementById('people-stats-banner');
      if (psBanner) {
        var psh = '';
        sectionContent.dataCards.forEach(function(d, i) {
          psh += '<div class="people-stat">' +
            '<span>' + esc(d.value) + '</span>' +
            '<label>' + esc(d.label) + '</label>' +
            (d.note ? '<small>' + esc(d.note) + '</small>' : '') +
            '</div>';
        });
        psBanner.innerHTML = psh;
        // 更新副标题
        var altBlock = psBanner.closest('.section-block');
        if (altBlock && sectionContent.dataCards.length >= 4) {
          var pSub = altBlock.querySelector('.block-sub');
          if (pSub) {
            var dc = sectionContent.dataCards;
            pSub.textContent = '全院职工' + (dc[0] ? dc[0].value : '') + '人 · 卫技人员' + (dc[1] ? dc[1].value : '') + '人 · 博士' + (dc[2] ? dc[2].value : '') + '人 · 硕士' + (dc[3] ? dc[3].value : '') + '人';
          }
        }
      }
    }

    // ---- Party 党建力量 (02-people) ----
    if (sectionContent.party && typeof sectionContent.party === 'object') {
      var p = sectionContent.party;
      // 更新副标题
      var partyBlock = document.querySelector('.section-body > .section-block:nth-of-type(4)');
      if (partyBlock) {
        var partySub = partyBlock.querySelector('.block-sub');
        if (partySub && p.branches && p.subBranches && p.members) {
          partySub.textContent = p.branches + '个党总支 · ' + p.subBranches + '个党支部 · ' + p.members + '名党员 · 汇聚发展磅礴力量';
        }
      }
      var partyCards = document.querySelectorAll('.party-card');
      var partyNums = [p.branches, p.subBranches, p.members];
      var partyLabels = [
        p.branches ? '党总支' : null,
        p.subBranches ? '党支部' : null,
        p.members ? '党员' : null
      ];
      var partyNotes = [
        '覆盖全院各系统',
        '含1个直属党支部',
        '教工' + (p.staffMembers || '') + ' · 研究生' + (p.gradMembers || '')
      ];
      partyCards.forEach(function(card, i) {
        var numEl = card.querySelector('.party-card-num');
        var labelEl = card.querySelector('.party-card-label');
        var noteEl = card.querySelector('.party-card-note');
        if (numEl && partyNums[i]) numEl.textContent = partyNums[i];
        if (labelEl && partyLabels[i]) labelEl.textContent = partyLabels[i];
        if (noteEl && partyNotes[i]) noteEl.textContent = partyNotes[i];
      });
      // 正文标题和内容
      var contentPairs = document.querySelectorAll('.section-block .content-pair');
      contentPairs.forEach(function(cp) {
        var h4s = cp.querySelectorAll('h4');
        var ps = cp.querySelectorAll('p');
        // 党建力量 section: 第4个 section-block 内的 content-pair
        var sectionBlocks = document.querySelectorAll('.section-body > .section-block');
        if (sectionBlocks.length >= 4) {
          var partyBlock = sectionBlocks[3]; // 第4个 (0-indexed: 3) = 党建力量
          var partyCP = partyBlock.querySelector('.content-pair');
          if (partyCP && cp === partyCP) {
            var cp_h4s = partyCP.querySelectorAll('h4');
            var cp_ps = partyCP.querySelectorAll('p');
            if (cp_h4s[0] && p.textTitle) cp_h4s[0].textContent = p.textTitle;
            if (cp_ps[0] && p.text) cp_ps[0].textContent = p.text;
            if (cp_h4s[1] && p.textTitle2) cp_h4s[1].textContent = p.textTitle2;
            if (cp_ps[1] && p.text2) cp_ps[1].textContent = p.text2;
          }
        }
      });
      // 配图区域
      var partyBlock = document.querySelector('.section-body > .section-block:nth-of-type(4)');
      if (partyBlock) {
        var imgSlot = partyBlock.querySelector('.img-slot');
        if (imgSlot) {
          var iconEl = imgSlot.querySelector('.img-slot-icon');
          var labelEl = imgSlot.querySelector('.img-slot-label');
          var sizeEl = imgSlot.querySelector('.img-slot-size');
          if (iconEl && p.imgIcon) iconEl.textContent = p.imgIcon;
          if (labelEl && p.imgLabel) labelEl.innerHTML = p.imgLabel;
          if (sizeEl && p.imgSize) sizeEl.textContent = p.imgSize;
        }
      }
    }

    // ====== RoleModels 榜样的力量 (02-people) - 动态渲染 ======
    if (Array.isArray(sectionContent.roleModels) && sectionContent.roleModels.length > 0) {
      var rmGrid = document.getElementById('profile-grid-rolemodel');
      if (rmGrid) {
        var rmh = '';
        sectionContent.roleModels.forEach(function(r, i) {
          rmh += renderProfileCard(r, i);
        });
        rmGrid.innerHTML = rmh;
      }
    }

    // ---- Gallery ----
    if (Array.isArray(sectionContent.gallery) && sectionContent.gallery.length > 0) {
      var galleryGrid = document.querySelector('.gallery-grid');
      if (galleryGrid) {
        var gHTML = '';
        sectionContent.gallery.forEach(function(g, i) {
          var stagger = ((i % 4) + 1);
          if (g.url) {
            // 有真实图片/资料URL：渲染为可点击的图片卡片
            var isImg = /\.(jpg|jpeg|png|gif|webp|svg|bmp)(\?.*)?$/i.test(g.url);
            if (isImg) {
              // 图片：显示真实图片缩略图，支持 lightbox 点击放大
              gHTML += '<div class="gallery-item fade-in stagger-' + stagger + '" data-src="' + esc(g.url) + '" style="cursor:zoom-in;padding:0;overflow:hidden;">' +
                '<img src="' + esc(g.url) + '" alt="' + esc(g.label) + '" style="width:100%;height:180px;object-fit:cover;border-radius:inherit;" onerror="this.style.display=\'none\';this.nextSibling.style.display=\'flex\'">' +
                '<div style="display:none;align-items:center;justify-content:center;height:180px;font-size:2.5rem;">' + esc(g.icon || '📷') + '</div>' +
                '<div class="gallery-item-label" style="padding:8px 12px;">' + esc(g.label) + '</div></div>';
            } else {
              // 文件/资料：显示下载图标，点击跳转
              gHTML += '<a class="gallery-item fade-in stagger-' + stagger + '" href="' + esc(g.url) + '" target="_blank" rel="noopener" style="text-decoration:none;">' +
                '<div class="gallery-item-icon" style="font-size:2.5rem;">' + esc(g.icon || '📄') + '</div>' +
                '<div class="gallery-item-label">' + esc(g.label) + '</div>' +
                '<div style="font-size:10px;color:var(--text-muted,#888);margin-top:4px;word-break:break-all;padding:0 8px;">🔗 ' + esc(g.url.replace(/^https?:\/\//, '').substring(0, 40)) + (g.url.length > 50 ? '…' : '') + '</div></a>';
            }
          } else {
            // 无URL：显示占位 Emoji（原有逻辑）
            gHTML += '<div class="gallery-item fade-in stagger-' + stagger + '"><div class="gallery-item-icon">' + esc(g.icon) + '</div><div class="gallery-item-label">' + esc(g.label) + '</div></div>';
          }
        });
        galleryGrid.innerHTML = gHTML;

        // 重新绑定图片 lightbox 事件
        galleryGrid.querySelectorAll('.gallery-item[data-src]').forEach(function(item) {
          item.addEventListener('click', function() {
            var src = item.getAttribute('data-src');
            var overlay = document.createElement('div');
            overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.88);z-index:9999;display:flex;align-items:center;justify-content:center;cursor:zoom-out;';
            var img = document.createElement('img');
            img.src = src;
            img.style.cssText = 'max-width:90vw;max-height:90vh;border-radius:12px;box-shadow:0 20px 60px rgba(0,0,0,0.7);';
            overlay.appendChild(img);
            overlay.addEventListener('click', function() { document.body.removeChild(overlay); });
            document.body.appendChild(overlay);
          });
        });
      }
    }
  }

  // helper
  function esc(s) {
    if (!s) return '';
    var d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  // 通用 profile 卡片 HTML 生成（专家群像/医学人才/榜样人物共用）
  function renderProfileCard(p, i) {
    var staggerN = (i % 4) + 1;
    var hasPhoto = !!(p.photo && p.photo.trim());
    var hasName = !!(p.name && p.name !== '[待补充]');
    var h = '<div class="profile-card fade-in stagger-' + staggerN + '">';
    // 照片区
    h += '<div class="profile-photo' + (hasPhoto ? ' has-real-img' : '') + '" style="position:relative;overflow:hidden;">';
    if (hasPhoto) {
      h += '<img class="profile-real-img" src="' + esc(p.photo.trim()) + '" alt="' + esc(p.name || '') + '" data-lightbox="' + esc(p.photo.trim()) + '" data-lightbox-caption="' + esc(p.name || '') + '" style="cursor:zoom-in;width:100%;height:100%;object-fit:cover;border-radius:inherit;position:absolute;top:0;left:0;">';
    }
    if (hasName && !hasPhoto) {
      h += '<span class="profile-photo-char">' + esc(p.name.charAt(0)) + '</span>';
    }
    h += '<span class="profile-photo-icon"' + (hasName && !hasPhoto ? ' style="display:none"' : '') + '>👨‍⚕️</span>';
    if (!hasPhoto) {
      h += '<span class="profile-photo-hint">照片 3:4</span>';
    }
    h += '</div>';
    // 信息
    h += '<div class="profile-info">';
    h += '<div class="profile-name">' + esc(p.name || '[待补充]') + '</div>';
    h += '<div class="profile-title">' + esc(p.title || '') + '</div>';
    h += '<span class="profile-dept">' + esc(p.dept || '') + '</span>';
    h += '<p class="profile-desc">' + esc(p.desc || '') + '</p>';
    h += '</div>';
    h += '</div>';
    return h;
  }

  // -------- Navbar scroll --------
  var navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', function () {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  // -------- Mobile menu --------
  window.toggleMenu = function () {
    var menu = document.getElementById('navMenu');
    if (menu) menu.classList.toggle('open');
  };

  // close menu on link click
  document.addEventListener('click', function (e) {
    if (e.target.closest('.nav-menu a')) {
      var menu = document.getElementById('navMenu');
      if (menu) menu.classList.remove('open');
    }
  });

  // -------- Hero flip --------
  var flipTrack = document.getElementById('heroFlipTrack');
  if (flipTrack) {
    var items = flipTrack.querySelectorAll('.hero-flip-item');
    var total = items.length;
    var idx = 0;

    function getItemH() {
      return items[0] ? items[0].offsetHeight : 56;
    }

    function flipNext() {
      idx = (idx + 1) % total;
      flipTrack.style.transform = 'translateY(-' + (idx * getItemH()) + 'px)';
    }

    var flipInterval = setInterval(flipNext, 3500);

    /* cleanup on page unload to prevent memory leak */
    window.addEventListener('beforeunload', function () {
      clearInterval(flipInterval);
    });

    window.addEventListener('resize', function () {
      flipTrack.style.transform = 'translateY(-' + (idx * getItemH()) + 'px)';
    });
  }

  // -------- Scroll fade-in --------
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.fade-in, .fade-in-scale').forEach(function (el) {
    observer.observe(el);
  });

  // -------- Active nav link (index page) --------
  var sections = document.querySelectorAll('section[id]');
  if (sections.length > 0) {
    var navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          navLinks.forEach(function (a) {
            a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
          });
        }
      });
    }, { threshold: 0.3 });
    sections.forEach(function (s) { sectionObserver.observe(s); });
  }

  // -------- 公告数据读取 ---------
  // 优先级: localStorage（后台管理实时数据） > data.js（持久化导出数据）
  // 公告属于动态内容，后台管理修改后应立即在前端可见，无需重新导出 data.js
  // 首次访问时自动将 data.js 数据同步到 localStorage
  var hmAnnouncements = [];
  try {
    var localAnn = JSON.parse(localStorage.getItem('hm_announcements') || 'null');
    if (localAnn && Array.isArray(localAnn) && localAnn.length > 0) {
      hmAnnouncements = localAnn;
    } else if (_hasData(_hmData.announcements)) {
      // data.js 有数据但 localStorage 为空 → 首次同步
      hmAnnouncements = _hmData.announcements;
      try { localStorage.setItem('hm_announcements', JSON.stringify(hmAnnouncements)); } catch(e) {}
    } else {
      hmAnnouncements = [];
    }
  } catch(e) {}

  // -------- 公告卡片动态渲染（替换 index.html 静态硬编码）--------
  function renderFrontAnnouncements() {
    var grid = document.querySelector('.announcements-grid');
    if (!grid) return;
    var catMap = { notice: '通知', event: '活动', hr: '人事', academic: '科研' };
    // 只显示已发布的，按日期倒序
    var published = hmAnnouncements.filter(function(a){ return a.published !== false; });
    published.sort(function(a,b){ return (b.date||'').localeCompare(a.date||''); });

    var html = '';
    if (published.length > 0) {
      // 最多展示6条
      var display = published.slice(0, 6);
      display.forEach(function(a, i){
        var tagText = catMap[a.category] || a.category || '公告';
        var tagClass = a.category || 'notice';
        // data-ann-idx 关联到 published 数组索引，modal 用于从 hmAnnouncements 查找原始数据
        html += '<div class="announce-card fade-in stagger-'+(i+1)+'" data-ann-idx="'+i+'">'
          + '<div class="announce-card-top">'
            + '<span class="announce-card-date">' + (a.date||'') + '</span>'
            + '<span class="announce-card-tag ' + tagClass + '">' + tagText + '</span>'
          + '</div>'
          + '<h4 class="announce-card-title">' + (a.title||'') + '</h4>'
          + '<p class="announce-card-desc">' + (a.content||'') + '</p>'
          + '<div class="announce-card-footer"><span aria-hidden="true">📌</span> ' + (a.dept||'') + '</div>'
        + '</div>';
      });
    } else {
      // 无公告时显示提示（替换所有静态卡片）
      html = '<div class="announce-card" style="grid-column:1/-1;text-align:center;padding:48px 24px;opacity:0.6;">'
        + '<div style="font-size:48px;margin-bottom:12px;">📋</div>'
        + '<p style="color:var(--text-secondary);font-size:14px;">暂无最新公告，敬请关注</p>'
        + '<p style="color:var(--text-muted);font-size:12px;">请前往 <a href="../admin/index.html" style="color:var(--gold);">后台管理</a> 发布公告</p>'
        + '</div>';
    }
    grid.innerHTML = html;
    // 将新生成的公告卡片注册到 IntersectionObserver
    // （因为卡片是动态替换的，需要在渲染后重新观察）
    grid.querySelectorAll('.fade-in').forEach(function (el) {
      observer.observe(el);
    });
  }
  renderFrontAnnouncements();

  // -------- 首页动态渲染 --------
  (function renderIndexPage() {
    var isIndex = window.location.pathname === '/' || window.location.pathname.endsWith('/index.html') || window.location.pathname === '/index.html';
    if (!isIndex) return;

    var indexData = hmContent.index;
    if (!indexData) { console.log('[Frontend] hmContent.index 无数据，使用静态 HTML'); return; }

    // Hero
    if (indexData.hero) {
      var h = indexData.hero;
      if (h.bgImage) { var bg = document.querySelector('.hero-bg'); if (bg) bg.src = h.bgImage; }
      if (h.title) { var t = document.querySelector('.hero-title'); if (t) t.textContent = h.title; }
      if (h.tag) { var tag = document.querySelector('.hero-tag'); if (tag) tag.innerHTML = '<span>🏛</span><span>' + h.tag + ' · 建院<span class="hospital-age"></span>年</span>'; }
      if (h.desc) { var d = document.querySelector('.hero-desc'); if (d) d.textContent = h.desc; }

      // Flip items
      var track = document.getElementById('heroFlipTrack');
      if (track && Array.isArray(h.flipItems) && h.flipItems.length > 0) {
        track.innerHTML = h.flipItems.map(function(f) {
          return '<span class="hero-flip-item">' + f + '</span>';
        }).join('');
      }

      // CTA buttons
      if (h.cta1Text) { var c1 = document.querySelector('.btn-primary'); if (c1) c1.textContent = h.cta1Text; }
      if (h.cta1Link) { var c1a = document.querySelector('.btn-primary'); if (c1a) c1a.href = h.cta1Link; }
      if (h.cta2Text) { var c2 = document.querySelector('.btn-outline'); if (c2) c2.textContent = h.cta2Text; }
    }

    // Section Cards
    var cards = indexData.sectionCards;
    if (Array.isArray(cards) && cards.length > 0) {
      var grid = document.querySelector('.sections-grid');
      if (grid) {
        grid.innerHTML = cards.map(function(c, i) {
          var st = (i % 6) + 1;
          return '<a href="' + c.link + '" class="section-card fade-in stagger-' + st + '">' +
            '<span class="section-card-num">' + c.num + '</span>' +
            '<div class="section-card-icon">' + c.icon + '</div>' +
            '<div class="section-card-title">' + c.title + '</div>' +
            '<div class="section-card-sub">' + c.sub + '</div>' +
            '<p class="section-card-desc">' + c.desc + '</p>' +
            '<div class="section-card-arrow">进入板块 →</div></a>';
        }).join('');
      }
    }

    // Footer
    if (indexData.footer) {
      var f = indexData.footer;
      if (f.slogan) { var s = document.querySelector('.footer-slogan'); if (s) s.innerHTML = f.slogan.replace(/\n/g,'<br>'); }
      if (f.addr) { var a = document.querySelector('.footer-addr'); if (a) a.innerHTML = f.addr; }
      if (f.phones) {
        var pw = document.querySelector('.footer-phones');
        if (pw) { pw.innerHTML = f.phones.split('|').map(function(p){ return '<span>' + p.trim() + '</span>'; }).join(''); }
      }
      if (f.copyright) { var cr = document.querySelector('.footer-bottom'); if (cr) cr.textContent = f.copyright; }
    }

    // Stats-bar
    var statsBar = indexData.statsBar;
    if (Array.isArray(statsBar) && statsBar.length > 0) {
      var statsContainer = document.querySelector('.stats-bar .container');
      if (statsContainer) {
        statsContainer.innerHTML = statsBar.map(function(s) {
          return '<div class="stat-item"><span class="stat-value">' + s.value + '<small>' + s.unit + '</small></span><span class="stat-label">' + s.label + '</span></div>';
        }).join('');
      }
    }

    // Gallery
    var gallery = indexData.gallery;
    if (Array.isArray(gallery) && gallery.length > 0) {
      var galleryGrid = document.querySelector('.gallery-grid');
      if (galleryGrid) {
        galleryGrid.innerHTML = gallery.map(function(g, i) {
          var staggerN = (i % 4) + 1;
          var cleanLabel = g.label.replace(/<[^>]+>/g, '');
          if (g.url && g.url.trim()) {
            // 有图片URL → 显示缩略图+底部标签+点击放大
            return '<div class="gallery-item fade-in stagger-' + staggerN + '" data-lightbox="' + g.url.trim() + '" data-lightbox-caption="' + cleanLabel + '">' +
              '<img src="' + g.url.trim() + '" alt="' + cleanLabel + '">' +
              '<div class="gallery-item-label" style="position:absolute;bottom:0;left:0;right:0;background:rgba(0,0,0,0.6);color:#fff;padding:6px 10px;z-index:2">' + cleanLabel + '</div></div>';
          }
          // 无图片 → 图标+文字占位
          return '<div class="gallery-item fade-in stagger-' + staggerN + '">' +
            '<div class="gallery-item-icon">' + g.icon + '</div>' +
            '<div class="gallery-item-label">' + g.label + '</div></div>';
        }).join('');
      }
    }
    console.log('[Frontend] 首页已从 CMS 数据动态渲染');
  })();

  // -------- 公告纪实弹出（data-ann-idx 关联后台原始数据）--------
  document.addEventListener('click', function(ev) {
    var card = ev.target.closest('.announce-card');
    if (!card) return;
    if (ev.target.closest('a')) return; // 不拦截链接点击

    // 从 data-ann-idx 查后台原始数据（避免读截断的 DOM textContent）
    var idx = parseInt(card.getAttribute('data-ann-idx'), 10);
    var a = null;
    if (!isNaN(idx)) {
      var published = hmAnnouncements.filter(function(x){ return x.published !== false; });
      published.sort(function(x,y){ return (y.date||'').localeCompare(x.date||''); });
      a = published[idx] || null;
    }
    // fallback：如果索引失效则从 DOM 读取
    var catMap = { notice: '通知', event: '活动', hr: '人事', academic: '科研' };
    var titleText = a ? a.title : (card.querySelector('.announce-card-title')||{}).textContent||'';
    var descText  = a ? (a.content||'') : (card.querySelector('.announce-card-desc')||{}).textContent||'';
    var dateText  = a ? (a.date||'') : (card.querySelector('.announce-card-date')||{}).textContent||'';
    var tagText   = a ? (catMap[a.category]||a.category||'公告') : ((card.querySelector('.announce-card-tag')||{}).textContent||'');
    var tagClass  = a ? (a.category||'notice') : ((card.querySelector('.announce-card-tag')||{}).className||'').replace('announce-card-tag','').trim();
    var srcText   = a ? (a.dept||'') : '';
    if (!srcText) {
      var footer = card.querySelector('.announce-card-footer');
      srcText = footer ? footer.textContent.replace(/^\s*📌\s*/, '').trim() : '';
    }

    // build overlay
    var overlay = document.createElement('div');
    overlay.className = 'announce-modal-overlay';

    var box = document.createElement('div');
    box.className = 'announce-modal-box';

    box.innerHTML =
      '<button class="announce-modal-close" title="关闭">&times;</button>' +
      '<div class="announce-modal-header">' +
        '<span class="announce-card-tag ' + tagClass + '">' + tagText + '</span>' +
        '<span class="announce-modal-date">' + dateText + '</span>' +
      '</div>' +
      '<h3 class="announce-modal-title">' + titleText + '</h3>' +
      '<div class="announce-modal-body">' + descText + '</div>' +
      '<div class="announce-modal-footer"><span>📌</span> 发布部门：' + srcText + '</div>';

    overlay.appendChild(box);

    function close() {
      if (overlay.parentNode) {
        overlay.classList.remove('active');
        setTimeout(function () {
          if (overlay.parentNode) document.body.removeChild(overlay);
        }, 280);
      }
    }

    overlay.addEventListener('click', function (ev2) {
      if (ev2.target === overlay) close();
    });
    box.querySelector('.announce-modal-close').addEventListener('click', close);
    document.addEventListener('keydown', function escHandler(ev2) {
      if (ev2.key === 'Escape') { close(); document.removeEventListener('keydown', escHandler); }
    });

    document.body.appendChild(overlay);
    requestAnimationFrame(function () { overlay.classList.add('active'); });
  });

  // -------- 统一 Lightbox 放大查看 --------
  function openLightbox(src, caption) {
    if (!src) return;
    var overlay = document.createElement('div');
    overlay.className = 'hm-lightbox-overlay';
    overlay.style.cssText = [
      'position:fixed;inset:0;z-index:99999;',
      'background:rgba(0,0,0,0.92);',
      'display:flex;flex-direction:column;align-items:center;justify-content:center;',
      'cursor:zoom-out;',
      'opacity:0;transition:opacity 0.22s ease;'
    ].join('');

    var img = document.createElement('img');
    img.src = src;
    img.style.cssText = [
      'max-width:90vw;max-height:82vh;',
      'border-radius:8px;',
      'box-shadow:0 24px 80px rgba(0,0,0,0.8);',
      'object-fit:contain;',
      'transition:transform 0.22s ease;',
      'pointer-events:none;'
    ].join('');
    overlay.appendChild(img);

    // 底部说明文字
    if (caption) {
      var cap = document.createElement('p');
      cap.textContent = caption;
      cap.style.cssText = 'margin:16px 0 0;color:rgba(255,255,255,0.7);font-size:13px;max-width:80vw;text-align:center;pointer-events:none;';
      overlay.appendChild(cap);
    }

    // 右上关闭按钮
    var closeBtn = document.createElement('button');
    closeBtn.textContent = '✕';
    closeBtn.style.cssText = [
      'position:fixed;top:20px;right:24px;',
      'background:rgba(255,255,255,0.12);border:none;',
      'color:#fff;font-size:20px;cursor:pointer;',
      'width:40px;height:40px;border-radius:50%;',
      'display:flex;align-items:center;justify-content:center;',
      'transition:background 0.15s;',
      'z-index:100000;'
    ].join('');
    closeBtn.addEventListener('mouseenter', function() { closeBtn.style.background = 'rgba(255,255,255,0.28)'; });
    closeBtn.addEventListener('mouseleave', function() { closeBtn.style.background = 'rgba(255,255,255,0.12)'; });
    overlay.appendChild(closeBtn);

    function closeLightbox() {
      overlay.style.opacity = '0';
      setTimeout(function() { if (overlay.parentNode) document.body.removeChild(overlay); }, 220);
      document.removeEventListener('keydown', keyHandler);
    }
    function keyHandler(ev) {
      if (ev.key === 'Escape') closeLightbox();
    }

    overlay.addEventListener('click', function(ev) {
      if (ev.target === overlay) closeLightbox();
    });
    closeBtn.addEventListener('click', function(ev) { ev.stopPropagation(); closeLightbox(); });
    document.addEventListener('keydown', keyHandler);

    document.body.appendChild(overlay);
    requestAnimationFrame(function() { overlay.style.opacity = '1'; });
  }

  // --- gallery-item[data-src] ---
  document.addEventListener('click', function(ev) {
    var item = ev.target.closest('.gallery-item[data-src]');
    if (item) {
      var src = item.getAttribute('data-src');
      var label = item.querySelector('.gallery-item-label');
      openLightbox(src, label ? label.textContent : '');
    }
  });

  // --- 所有带 data-lightbox 的图片（统一委托）---
  document.addEventListener('click', function(ev) {
    var el = ev.target.closest('[data-lightbox]');
    if (el) {
      var src = el.getAttribute('data-lightbox') || el.src || '';
      var cap = el.getAttribute('data-lightbox-caption') || el.alt || '';
      openLightbox(src, cap);
    }
  });

  // --- 为静态 HTML 中的人物照片绑定 lightbox（动态渲染的在渲染时直接加 data-lightbox）---
  function bindStaticPhotos() {
    // 已渲染的真实图片
    ['.leader-real-img', '.profile-real-img', '.leadership-real-img', '.slot-real-img'].forEach(function(sel) {
      document.querySelectorAll(sel).forEach(function(img) {
        if (!img.hasAttribute('data-lightbox')) {
          img.setAttribute('data-lightbox', img.src);
          img.setAttribute('data-lightbox-caption', img.alt || '');
          img.style.cursor = 'zoom-in';
        }
      });
    });
  }
  // 页面加载 + 短暂延迟（等待动态渲染完成）
  bindStaticPhotos();
  setTimeout(bindStaticPhotos, 800);

  // ============ 职工名录 专用渲染与搜索（分页版，3000+人无误）============
  (function initStaffPage() {
    var isStaffPage = window.location.pathname.indexOf('13-staff') >= 0;
    if (!isStaffPage) return;
    console.log('[StaffPage] 初始化开始, pathname=' + window.location.pathname);

    // 读取职工数据
    var staffData = [];
    try {
      var staffSec = hmContent.staff || {};
      if (Array.isArray(staffSec.profiles)) {
        staffData = staffSec.profiles;
      }
    } catch(e) { console.error('[StaffPage] 读取 staff 数据异常:', e); }

    console.log('[StaffPage] staffData.length=' + staffData.length);

    if (!staffData.length) {
      console.log('[StaffPage] 无职工数据，渲染空状态');
      // 显示空状态
      var eGrid = document.getElementById('staffGrid');
      var eEmpty = document.getElementById('staffEmpty');
      if (eGrid) eGrid.innerHTML = '';
      if (eEmpty) eEmpty.style.display = 'block';
      return;
    }

    // 按姓名排序
    staffData.sort(function(a, b) { return (a.employeeId || '').localeCompare(b.employeeId || ''); });

    var PAGE_SIZE = 60;         // 每页数量：10行 × 6列（桌面端）
    var currentPage = 1;
    var currentFilterText = '';
    var currentFilterDept = 'all';

    var grid = document.getElementById('staffGrid');
    var empty = document.getElementById('staffEmpty');
    var searchInput = document.getElementById('staffSearch');
    var deptFilter = document.getElementById('staffDeptFilter');

    if (!grid) return;

    // ▸ 分页区域（插入 grid 后面）
    var pageWrap = document.createElement('div');
    pageWrap.className = 'staff-page-wrap';
    pageWrap.innerHTML =
      '<div class="staff-page-top">' +
        '<span class="staff-page-summary" id="staffPageSummary"></span>' +
        '<div class="staff-page-nav" id="staffPageNav"></div>' +
      '</div>';
    grid.parentNode.insertBefore(pageWrap, grid.nextSibling);

    var pageSummaryEl = document.getElementById('staffPageSummary');
    var pageNavEl = document.getElementById('staffPageNav');

    // 收集科室列表
    var depts = {};
    staffData.forEach(function(s) { if (s.dept) depts[s.dept] = true; });
    var deptList = Object.keys(depts).sort(function(a, b) { return a.localeCompare(b, 'zh'); });

    if (deptFilter && deptList.length > 1) {
      deptList.forEach(function(d) {
        var btn = document.createElement('button');
        btn.className = 'staff-filter-btn';
        btn.textContent = d;
        btn.setAttribute('data-dept', d);
        deptFilter.appendChild(btn);
      });
    }

    // 过滤后数据集
    function getFiltered() {
      var q = (currentFilterText || '').toLowerCase();
      var dept = currentFilterDept;
      return staffData.filter(function(s) {
        if (q) {
          var match = (s.name || '').indexOf(q) >= 0
                   || (s.title || '').indexOf(q) >= 0
                   || (s.dept || '').indexOf(q) >= 0
                   || (s.position || '').indexOf(q) >= 0
                   || (s.desc || '').indexOf(q) >= 0;
          if (!match) return false;
        }
        if (dept && dept !== 'all' && s.dept !== dept) return false;
        return true;
      });
    }

    function escHtml2(s) {
      if (!s) return '';
      return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    // 渲染单张卡片 HTML
    function cardHtml(s) {
      var ph = s.photo || '';
      var hasPhoto = ph && ph.trim().length > 0;
      var h = '<div class="profile-card staff-card fade-in">';
      h += '<div class="profile-photo' + (hasPhoto ? ' has-real-img' : '') + '">';
      if (hasPhoto) {
        h += '<img class="profile-real-img" src="' + escHtml2(ph) + '" alt="' + escHtml2(s.name || '') + '" loading="lazy" data-lightbox="' + escHtml2(ph) + '" data-lightbox-caption="' + escHtml2(s.name || '') + '">';
      }
      h += '<span class="profile-photo-icon">👤</span>';
      if (!hasPhoto) {
        h += '<span class="profile-photo-char">' + (s.name ? s.name.charAt(0) : '?') + '</span>';
      }
      h += '</div><div class="profile-info">';
      if (s.employeeId) {
        h += '<span class="staff-id-badge">' + escHtml2(s.employeeId) + '</span>';
      }
      h += '<div class="profile-name">' + escHtml2(s.name || '[待补充]') + '</div>';
      h += '<div class="profile-title">' + escHtml2(s.title || '') + '</div>';
      if (s.position) {
        h += '<span class="staff-position-badge">' + escHtml2(s.position) + '</span>';
      }
      h += '<span class="profile-dept">' + escHtml2(s.dept || '') + '</span>';
      if (s.desc) {
        h += '<p class="profile-desc">' + escHtml2(s.desc) + '</p>';
      }
      h += '</div></div>';
      return h;
    }

    // 生成页码按钮 HTML
    function paginationHtml(totalPages, cur) {
      if (totalPages <= 1) return '';
      var h = '';
      // 上一页
      h += '<button class="sp-btn sp-prev" data-page="' + (cur - 1) + '"' + (cur <= 1 ? ' disabled' : '') + '>‹</button>';

      // 页码按钮（最多显示 7 个）
      var pages = [];
      if (totalPages <= 7) {
        for (var i = 1; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        if (cur > 3) pages.push('...');
        var start = Math.max(2, cur - 1);
        var end = Math.min(totalPages - 1, cur + 1);
        for (var i = start; i <= end; i++) pages.push(i);
        if (cur < totalPages - 2) pages.push('...');
        pages.push(totalPages);
      }

      pages.forEach(function(p) {
        if (p === '...') {
          h += '<span class="sp-ellipsis">…</span>';
        } else {
          h += '<button class="sp-btn sp-num' + (p === cur ? ' active' : '') + '" data-page="' + p + '">' + p + '</button>';
        }
      });

      // 下一页
      h += '<button class="sp-btn sp-next" data-page="' + (cur + 1) + '"' + (cur >= totalPages ? ' disabled' : '') + '>›</button>';
      return h;
    }

    // 核心渲染：仅渲染当前页
    function renderPage() {
      var filtered = getFiltered();
      var total = filtered.length;
      var totalPages = Math.ceil(total / PAGE_SIZE);
      if (totalPages === 0) totalPages = 1;

      // 修正当前页越界
      if (currentPage > totalPages) currentPage = totalPages;
      if (currentPage < 1) currentPage = 1;

      var startIdx = (currentPage - 1) * PAGE_SIZE;
      var batch = filtered.slice(startIdx, startIdx + PAGE_SIZE);

      // 渲染卡片（仅当前页）
      var html = '';
      batch.forEach(function(s) { html += cardHtml(s); });
      grid.innerHTML = html;

      // 空状态
      if (empty) empty.style.display = total === 0 ? '' : 'none';

      // 摘要：共 X 人 · 第 Y/Z 页
      pageSummaryEl.textContent = '共 ' + total + ' 人 · 第 ' + currentPage + '/' + totalPages + ' 页';

      // 页码
      pageNavEl.innerHTML = paginationHtml(totalPages, currentPage);

      // Observer + lightbox
      grid.querySelectorAll('.fade-in').forEach(function(el) { observer.observe(el); });
      setTimeout(bindStaticPhotos, 100);
    }

    // 切换到指定页
    function goToPage(p) {
      var filtered = getFiltered();
      var totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
      var target = Math.max(1, Math.min(p, totalPages));
      if (target === currentPage) return;
      currentPage = target;
      renderPage();
      // 滚动到 grid 顶部
      grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // 筛选/搜索变化 → 重置到第1页
    function resetAndRender() {
      currentPage = 1;
      renderPage();
    }

    // 分页按钮点击（事件委托）
    pageNavEl.addEventListener('click', function(ev) {
      var btn = ev.target.closest('.sp-btn');
      if (!btn || btn.disabled) return;
      var p = parseInt(btn.getAttribute('data-page'), 10);
      if (!isNaN(p)) goToPage(p);
    });

    // 搜索
    if (searchInput) {
      searchInput.addEventListener('input', function() {
        currentFilterText = searchInput.value;
        resetAndRender();
      });
    }

    // 科室筛选
    if (deptFilter) {
      deptFilter.addEventListener('click', function(ev) {
        var btn = ev.target.closest('.staff-filter-btn');
        if (!btn) return;
        deptFilter.querySelectorAll('.staff-filter-btn').forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        currentFilterDept = btn.getAttribute('data-dept');
        resetAndRender();
      });
    }

    // 初始渲染
    renderPage();
  })();

})();
