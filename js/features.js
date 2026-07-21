/* ============================================================
   院史馆功能增强 - features.js
   包含：全站搜索、图片灯箱、留言墙、横向时间轴
   ============================================================ */

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

  function highlight(text, keyword) {
    if (!keyword) return esc(text);
    var regex = new RegExp('(' + keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
    return esc(text).replace(regex, '<mark>$1</mark>');
  }

  // 获取所有内容数据（统一调用 core.js 的全局合并函数）
  function getAllContent() {
    return window.hmGetContent ? window.hmGetContent() : {};
  }

  // 板块中文名称映射
  var SECTION_NAMES = {
    'history': '历史沿革',
    'people': '人物风采',
    'disciplines': '学科建设',
    'campus': '院区建设',
    'education': '教学人才',
    'culture': '文化建设',
    'tech': '科技交流',
    'duty': '责任担当',
    'honors': '荣誉殿堂',
    'vision': '展望未来',
    'structure': '组织架构',
    'leadership': '领导团队',
    'staff': '职工名录'
  };

  var SECTION_URLS = {
    'history': '01-history.html',
    'people': '02-people.html',
    'disciplines': '03-disciplines.html',
    'campus': '04-campus.html',
    'education': '05-education.html',
    'culture': '06-culture.html',
    'tech': '07-tech.html',
    'duty': '08-duty.html',
    'honors': '09-honors.html',
    'vision': '10-vision.html',
    'structure': '11-structure.html',
    'leadership': '12-leadership.html',
    'staff': '13-staff.html'
  };

  // ======================================
  // 1. 全站搜索功能
  // ======================================
  var SiteSearch = {
    // 构建搜索索引：扁平化所有可搜索内容
    buildIndex: function () {
      var content = getAllContent();
      var index = [];

      for (var sectionId in content) {
        if (!content.hasOwnProperty(sectionId)) continue;
        var sec = content[sectionId];
        var sectionName = SECTION_NAMES[sectionId] || sectionId;
        var sectionUrl = '../pages/' + (SECTION_URLS[sectionId] || '');

        // Hero 区
        if (sec.hero) {
          index.push({
            section: sectionName,
            sectionId: sectionId,
            url: sectionUrl,
            title: sec.hero.title || sectionName,
            snippet: sec.hero.desc || sec.hero.subtitle || ''
          });
        }

        // Blocks 内容块
        if (Array.isArray(sec.blocks)) {
          sec.blocks.forEach(function (blk) {
            index.push({
              section: sectionName,
              sectionId: sectionId,
              url: sectionUrl,
              title: blk.title || '',
              snippet: blk.text || blk.subtitle || ''
            });
          });
        }

        // Timeline 时间节点
        if (Array.isArray(sec.timeline)) {
          sec.timeline.forEach(function (t) {
            index.push({
              section: sectionName,
              sectionId: sectionId,
              url: sectionUrl,
              title: t.year + ' - ' + (t.title || ''),
              snippet: t.desc || ''
            });
          });
        }

        // 人物 / 领导
        var peopleLists = ['leaders', 'profiles', 'profiles2'];
        peopleLists.forEach(function (key) {
          if (Array.isArray(sec[key])) {
            sec[key].forEach(function (p) {
              index.push({
                section: sectionName,
                sectionId: sectionId,
                url: sectionUrl,
                title: p.name || '',
                snippet: (p.role || p.title || p.dept || '') + ' ' + (p.desc || p.duty || p.resume || '')
              });
            });
          }
        });

        // 数据卡片
        if (Array.isArray(sec.dataCards)) {
          sec.dataCards.forEach(function (dc) {
            index.push({
              section: sectionName,
              sectionId: sectionId,
              url: sectionUrl,
              title: dc.label || '',
              snippet: dc.value + ' ' + (dc.note || '')
            });
          });
        }

        // 公告（首页数据）
        if (sectionId === 'announcements' && Array.isArray(sec)) {
          sec.forEach(function (a) {
            index.push({
              section: '医院公告',
              sectionId: 'announcements',
              url: '../index.html#announcements',
              title: a.title || '',
              snippet: a.desc || ''
            });
          });
        }
      }

      return index;
    },

    // 执行搜索
    search: function (keyword) {
      if (!keyword || keyword.trim().length < 1) return [];
      var kw = keyword.trim().toLowerCase();
      var index = this.buildIndex();
      var results = [];

      index.forEach(function (item) {
        var titleMatch = item.title && item.title.toLowerCase().indexOf(kw) > -1;
        var snippetMatch = item.snippet && item.snippet.toLowerCase().indexOf(kw) > -1;
        var sectionMatch = item.section && item.section.toLowerCase().indexOf(kw) > -1;

        if (titleMatch || snippetMatch || sectionMatch) {
          // 计算权重：标题命中 > 板块命中 > 摘要命中
          var score = 0;
          if (titleMatch) score += 10;
          if (sectionMatch) score += 5;
          if (snippetMatch) score += 2;

          results.push({
            section: item.section,
            sectionId: item.sectionId,
            url: item.url,
            title: item.title,
            snippet: this._extractSnippet(item.snippet, kw),
            score: score
          });
        }
      }.bind(this));

      // 按权重排序
      results.sort(function (a, b) { return b.score - a.score; });
      return results;
    },

    // 提取关键词附近的摘要片段
    _extractSnippet: function (text, kw) {
      if (!text) return '';
      var lower = text.toLowerCase();
      var idx = lower.indexOf(kw);
      if (idx === -1) return text.substring(0, 120) + (text.length > 120 ? '...' : '');

      var start = Math.max(0, idx - 40);
      var end = Math.min(text.length, idx + kw.length + 80);
      var snippet = text.substring(start, end);
      if (start > 0) snippet = '...' + snippet;
      if (end < text.length) snippet = snippet + '...';
      return snippet;
    },

    // 渲染搜索结果
    renderResults: function (containerId, keyword) {
      var container = document.getElementById(containerId);
      if (!container) return;

      var results = this.search(keyword);

      if (results.length === 0) {
        container.innerHTML =
          '<div class="search-empty">' +
          '<div class="search-empty-icon">🔍</div>' +
          '<div>未找到与 "<strong>' + esc(keyword) + '</strong>" 相关的内容</div>' +
          '<div style="font-size:0.85rem;margin-top:8px;opacity:0.7;">试试其他关键词，如：历史、专家、三甲、抗疫等</div>' +
          '</div>';
        return;
      }

      container.innerHTML = results.map(function (r) {
        return '<a class="search-result-item" href="' + esc(r.url) + '" style="text-decoration:none;display:block;">' +
          '<span class="search-result-section">' + esc(r.section) + '</span>' +
          '<div class="search-result-title">' + highlight(r.title, keyword) + '</div>' +
          '<div class="search-result-snippet">' + highlight(r.snippet, keyword) + '</div>' +
          '</a>';
      }).join('');
    }
  };

  // ======================================
  // 2. 图片灯箱 Lightbox
  // ======================================
  var Lightbox = {
    images: [], // 当前灯箱图集 [{src, caption}]
    currentIndex: 0,
    overlay: null,

    init: function () {
      // 创建灯箱 DOM
      this.overlay = document.createElement('div');
      this.overlay.className = 'lightbox-overlay';
      this.overlay.innerHTML =
        '<div class="lightbox-img-wrapper">' +
        '<button class="lightbox-close" aria-label="关闭">✕</button>' +
        '<button class="lightbox-prev" aria-label="上一张">‹</button>' +
        '<img src="" alt="">' +
        '<button class="lightbox-next" aria-label="下一张">›</button>' +
        '<div class="lightbox-caption"></div>' +
        '</div>';
      document.body.appendChild(this.overlay);

      // 事件绑定
      var self = this;
      this.overlay.querySelector('.lightbox-close').addEventListener('click', function () { self.close(); });
      this.overlay.querySelector('.lightbox-prev').addEventListener('click', function (e) { e.stopPropagation(); self.prev(); });
      this.overlay.querySelector('.lightbox-next').addEventListener('click', function (e) { e.stopPropagation(); self.next(); });
      this.overlay.addEventListener('click', function (e) {
        if (e.target === self.overlay) self.close();
      });

      // 键盘控制
      document.addEventListener('keydown', function (e) {
        if (!self.overlay.classList.contains('active')) return;
        if (e.key === 'Escape') self.close();
        if (e.key === 'ArrowLeft') self.prev();
        if (e.key === 'ArrowRight') self.next();
      });
    },

    // 打开灯箱，images 为数组，index 为起始索引
    open: function (images, index) {
      if (!this.overlay) this.init();
      this.images = images || [];
      this.currentIndex = index || 0;
      this._showCurrent();
      this.overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    },

    close: function () {
      this.overlay.classList.remove('active');
      document.body.style.overflow = '';
    },

    prev: function () {
      if (this.images.length <= 1) return;
      this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
      this._showCurrent();
    },

    next: function () {
      if (this.images.length <= 1) return;
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
      this._showCurrent();
    },

    _showCurrent: function () {
      var img = this.overlay.querySelector('img');
      var caption = this.overlay.querySelector('.lightbox-caption');
      var item = this.images[this.currentIndex];
      if (!item) return;
      img.src = item.src;
      img.alt = item.caption || '';
      caption.textContent = item.caption || (this.currentIndex + 1) + ' / ' + this.images.length;

      // 单图隐藏左右按钮
      var prevBtn = this.overlay.querySelector('.lightbox-prev');
      var nextBtn = this.overlay.querySelector('.lightbox-next');
      if (this.images.length <= 1) {
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
      } else {
        prevBtn.style.display = '';
        nextBtn.style.display = '';
      }
    },

    // 绑定全站内容图片
    bindAllContentImages: function () {
      var selectors = [
        '.section-body img',
        '.gallery-section img',
        '.content-pair img',
        '.page-hero-bg',
        '.img-slot img',
        '.data-card img',
        '.honor-item img',
        '.leader-card img',
        '.profile-card img'
      ];
      var allImgs = [];
      selectors.forEach(function (sel) {
        var found = document.querySelectorAll(sel);
        found.forEach(function (img) {
          // 跳过小图标和logo
          if (img.classList.contains('nav-logo-img')) return;
          var src = img.getAttribute('src') || '';
          if (src.indexOf('logo') > -1 || src.indexOf('icon') > -1) return;
          if (allImgs.indexOf(img) === -1) allImgs.push(img);
        });
      });

      allImgs.forEach(function (img, idx) {
        img.style.cursor = 'zoom-in';
        img.style.transition = 'transform 0.3s ease';
        img.addEventListener('mouseenter', function () { img.style.transform = 'scale(1.02)'; });
        img.addEventListener('mouseleave', function () { img.style.transform = 'scale(1)'; });
        img.addEventListener('click', function (e) {
          e.stopPropagation();
          Lightbox.open(allImgs, idx);
        });
      });
    },

    // 自动绑定画廊元素
    bindGallery: function (gallerySelector) {
      var gallery = document.querySelector(gallerySelector);
      if (!gallery) return;

      var items = gallery.querySelectorAll('.gallery-item');
      var images = [];

      items.forEach(function (item, idx) {
        // 提取背景图或 img 的 src
        var src = '';
        var bgImage = item.style.backgroundImage;
        if (bgImage && bgImage !== 'none') {
          src = bgImage.replace(/url\(['"]?([^'"]+)['"]?\)/, '$1');
        } else {
          var imgEl = item.querySelector('img');
          if (imgEl) src = imgEl.src;
        }

        if (!src) return;

        var label = item.querySelector('.gallery-item-label');
        images.push({
          src: src,
          caption: label ? label.textContent.trim() : ''
        });

        item.classList.add('lightbox-item');
        item.addEventListener('click', function (e) {
          e.preventDefault();
          Lightbox.open(images, idx);
        });
      });
    }
  };

  // ======================================
  // 3. 留言墙 Message Wall
  // ======================================
  var MessageWall = {
    STORAGE_KEY: 'hm_messages',

    // 获取所有留言
    getMessages: function () {
      try {
        return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
      } catch (e) { return []; }
    },

    // 保存留言
    saveMessage: function (data) {
      var messages = this.getMessages();
      var newMsg = {
        id: Date.now(),
        name: data.name || '匿名职工',
        department: data.department || '',
        content: data.content || '',
        createdAt: new Date().toISOString(),
        likes: 0,
        likedBy: [],
        replies: []
      };
      messages.unshift(newMsg); // 最新在前
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(messages));
      return newMsg;
    },

    // 删除留言（管理员用，预留接口）
    deleteMessage: function (id) {
      var messages = this.getMessages();
      messages = messages.filter(function (m) { return m.id !== id; });
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(messages));
    },

    // 格式化日期
    formatDate: function (isoStr) {
      var d = new Date(isoStr);
      var y = d.getFullYear();
      var m = String(d.getMonth() + 1).padStart(2, '0');
      var day = String(d.getDate()).padStart(2, '0');
      var h = String(d.getHours()).padStart(2, '0');
      var min = String(d.getMinutes()).padStart(2, '0');
      return y + '-' + m + '-' + day + ' ' + h + ':' + min;
    },

    // 获取头像文字（姓名首字）
    getAvatarChar: function (name) {
      if (!name) return '匿';
      return name.charAt(0);
    },

    // 渲染留言列表
    render: function (containerId) {
      var container = document.getElementById(containerId);
      if (!container) return;

      var messages = this.getMessages();

      if (messages.length === 0) {
        container.innerHTML =
          '<div class="messages-empty">' +
          '<div class="messages-empty-icon">💬</div>' +
          '<div>还没有留言，快来写下第一条寄语吧！</div>' +
          '</div>';
        return;
      }

      container.innerHTML = messages.map(function (msg) {
        var deptHtml = msg.department
          ? '<span class="message-dept">' + esc(msg.department) + '</span>'
          : '';
        return '<div class="message-card" data-id="' + msg.id + '">' +
          '<div class="message-card-header">' +
          '<div class="message-avatar">' + esc(this.getAvatarChar(msg.name)) + '</div>' +
          '<div class="message-meta">' +
          '<div class="message-name">' + esc(msg.name) + '</div>' +
          '<div class="message-date">' + this.formatDate(msg.createdAt) + '</div>' +
          '</div>' +
          '</div>' +
          '<div class="message-content">' + esc(msg.content).replace(/\n/g, '<br>') + '</div>' +
          deptHtml +
          '<div class="message-actions">' +
            '<button class="message-like-btn" data-action="like">' +
              '<span class="like-icon">♡</span> ' +
              '<span class="like-count">' + (msg.likes || 0) + '</span>' +
            '</button>' +
            '<button class="message-reply-btn" data-action="reply">💬 回复 ' + ((msg.replies || []).length || '') + '</button>' +
          '</div>' +
          '<div class="reply-form" data-reply-form>' +
            '<input type="text" placeholder="写下你的回复..." maxlength="100">' +
            '<button data-reply-submit>发送</button>' +
          '</div>' +
          '<div class="message-replies" data-replies>' + this._renderReplies(msg.replies || []) + '</div>' +
          '</div>';
      }.bind(this)).join('');

      // 绑定点赞和回复事件
      this._bindCardEvents(container);
    },

    // 渲染回复列表
    _renderReplies: function (replies) {
      if (!replies || replies.length === 0) return '';
      return replies.map(function (r) {
        return '<div class="message-reply-item">' +
          '<span class="reply-name">' + this._esc(r.name || '匿名') + '</span>' +
          this._esc(r.content) +
          '<span class="reply-time">' + this.formatDate(r.createdAt) + '</span>' +
          '</div>';
      }.bind(this)).join('');
    },

    // 绑定卡片事件
    _bindCardEvents: function (container) {
      var self = this;
      container.querySelectorAll('.message-card').forEach(function (card) {
        var id = parseInt(card.getAttribute('data-id'));

        // 点赞
        card.querySelector('[data-action="like"]').addEventListener('click', function () {
          self.toggleLike(id);
        });

        // 回复按钮
        card.querySelector('[data-action="reply"]').addEventListener('click', function () {
          var form = card.querySelector('[data-reply-form]');
          form.classList.toggle('open');
          if (form.classList.contains('open')) {
            form.querySelector('input').focus();
          }
        });

        // 回复提交
        card.querySelector('[data-reply-submit]').addEventListener('click', function () {
          var input = card.querySelector('input');
          var content = input.value.trim();
          if (!content) return;
          self.addReply(id, { name: '访客', content: content });
          input.value = '';
          card.querySelector('[data-reply-form]').classList.remove('open');
        });
      });
    },

    // 切换点赞
    toggleLike: function (msgId) {
      var messages = this.getMessages();
      var msg = messages.find(function (m) { return m.id === msgId; });
      if (!msg) return;

      msg.likes = (msg.likes || 0) + 1;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(messages));

      // 更新UI
      var card = document.querySelector('.message-card[data-id="' + msgId + '"]');
      if (card) {
        var btn = card.querySelector('[data-action="like"]');
        btn.classList.add('liked');
        btn.querySelector('.like-count').textContent = msg.likes;
        btn.querySelector('.like-icon').textContent = '♥';
      }
    },

    // 添加回复
    addReply: function (msgId, reply) {
      var messages = this.getMessages();
      var msg = messages.find(function (m) { return m.id === msgId; });
      if (!msg) return;

      if (!msg.replies) msg.replies = [];
      msg.replies.push({
        id: Date.now(),
        name: reply.name || '访客',
        content: reply.content,
        createdAt: new Date().toISOString()
      });

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(messages));

      // 更新UI
      var card = document.querySelector('.message-card[data-id="' + msgId + '"]');
      if (card) {
        var repliesEl = card.querySelector('[data-replies]');
        repliesEl.innerHTML = this._renderReplies(msg.replies);
        var replyBtn = card.querySelector('[data-action="reply"]');
        replyBtn.textContent = '💬 回复 ' + msg.replies.length;
      }
    },

    _esc: function (str) {
      var div = document.createElement('div');
      div.textContent = str || '';
      return div.innerHTML;
    },

    // 绑定表单提交
    bindForm: function (formId, listId) {
      var form = document.getElementById(formId);
      if (!form) return;

      var self = this;
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var nameInput = form.querySelector('input[name="name"]');
        var deptInput = form.querySelector('input[name="department"]');
        var contentInput = form.querySelector('textarea[name="content"]');

        var content = contentInput ? contentInput.value.trim() : '';
        if (!content) {
          alert('请输入留言内容');
          return;
        }

        self.saveMessage({
          name: nameInput ? nameInput.value.trim() : '',
          department: deptInput ? deptInput.value.trim() : '',
          content: content
        });

        // 重置表单
        if (contentInput) contentInput.value = '';
        // 重新渲染
        self.render(listId);

        // 简单提示
        var btn = form.querySelector('.btn-submit-msg');
        if (btn) {
          var origText = btn.textContent;
          btn.textContent = '✓ 发布成功';
          setTimeout(function () { btn.textContent = origText; }, 1500);
        }
      });
    },

    // ======================================
    // 精简版留言墙 — 自动注入到内容页面底部
    // ======================================
    initInline: function () {
      // 只在有翻页导航的内容页面注入，排除留言墙主页面
      var pageNav = document.querySelector('.page-nav');
      if (!pageNav) return;
      if (location.pathname.indexOf('messages.html') !== -1) return;

      // 判断链接路径（pages/ 子目录 vs 根目录）
      var inPagesDir = location.pathname.indexOf('/pages/') !== -1;
      var msgLink = inPagesDir ? 'messages.html' : 'pages/messages.html';

      // 构建精简版留言墙
      var section = document.createElement('section');
      section.className = 'inline-msg-wall';
      section.innerHTML =
        '<div class="inline-msg-inner">' +
          '<div class="inline-msg-head">' +
            '<h3 class="inline-msg-title">💬 院史寄语</h3>' +
            '<p class="inline-msg-sub">留下你的祝福与感悟，共同书写大附院的历史</p>' +
          '</div>' +
          '<form class="inline-msg-form" id="inlineMsgForm">' +
            '<div class="inline-msg-form-row">' +
              '<input type="text" name="name" placeholder="姓名（选填）" maxlength="20">' +
              '<input type="text" name="department" placeholder="科室/部门（选填）" maxlength="30">' +
            '</div>' +
            '<textarea name="content" placeholder="写下您对医院的祝福、感悟或期待..." maxlength="500" required></textarea>' +
            '<div class="inline-msg-form-bottom">' +
              '<span class="inline-msg-tip">💡 留言保存在本地浏览器</span>' +
              '<button type="submit" class="btn-submit-msg">发布寄语</button>' +
            '</div>' +
          '</form>' +
          '<div class="inline-msg-list" id="inlineMsgList"></div>' +
          '<a href="' + msgLink + '" class="inline-msg-more">查看全部寄语 →</a>' +
        '</div>';

      // 插入到 page-nav 之前
      pageNav.parentNode.insertBefore(section, pageNav);

      // 渲染最近 3 条留言
      this._renderInline('inlineMsgList');

      // 绑定表单
      var self = this;
      var form = document.getElementById('inlineMsgForm');
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var nameInput = form.querySelector('input[name="name"]');
        var deptInput = form.querySelector('input[name="department"]');
        var contentInput = form.querySelector('textarea[name="content"]');
        var content = contentInput ? contentInput.value.trim() : '';
        if (!content) { alert('请输入留言内容'); return; }

        self.saveMessage({
          name: nameInput ? nameInput.value.trim() : '',
          department: deptInput ? deptInput.value.trim() : '',
          content: content
        });

        if (contentInput) contentInput.value = '';
        self._renderInline('inlineMsgList');

        var btn = form.querySelector('.btn-submit-msg');
        if (btn) {
          var origText = btn.textContent;
          btn.textContent = '✓ 发布成功';
          setTimeout(function () { btn.textContent = origText; }, 1500);
        }
      });
    },

    // 渲染精简版留言列表（最近 3 条）
    _renderInline: function (containerId) {
      var container = document.getElementById(containerId);
      if (!container) return;

      var messages = this.getMessages();
      if (messages.length === 0) {
        container.innerHTML =
          '<div class="inline-msg-empty">' +
          '<span class="inline-msg-empty-icon">💬</span>' +
          '<span>还没有留言，快来写下第一条寄语吧！</span>' +
          '</div>';
        return;
      }

      var recent = messages.slice(0, 3);
      var self = this;
      container.innerHTML = recent.map(function (msg) {
        var deptHtml = msg.department
          ? '<span class="message-dept">' + esc(msg.department) + '</span>'
          : '';
        return '<div class="message-card inline-msg-card" data-id="' + msg.id + '">' +
          '<div class="message-card-header">' +
          '<div class="message-avatar">' + esc(self.getAvatarChar(msg.name)) + '</div>' +
          '<div class="message-meta">' +
          '<div class="message-name">' + esc(msg.name) + '</div>' +
          '<div class="message-date">' + self.formatDate(msg.createdAt) + '</div>' +
          '</div>' +
          '</div>' +
          '<div class="message-content">' + esc(msg.content).replace(/\n/g, '<br>') + '</div>' +
          deptHtml +
          '<div class="message-actions">' +
            '<button class="message-like-btn" data-action="like">' +
              '<span class="like-icon">♡</span> ' +
              '<span class="like-count">' + (msg.likes || 0) + '</span>' +
            '</button>' +
          '</div>' +
          '</div>';
      }).join('');

      // 绑定点赞事件
      container.querySelectorAll('.message-card').forEach(function (card) {
        var id = parseInt(card.getAttribute('data-id'));
        var likeBtn = card.querySelector('[data-action="like"]');
        if (likeBtn) {
          likeBtn.addEventListener('click', function () {
            self.toggleLike(id);
          });
        }
      });

      // 如果超过 3 条，显示总数提示
      if (messages.length > 3) {
        var moreEl = document.querySelector('.inline-msg-more');
        if (moreEl) {
          moreEl.textContent = '查看全部 ' + messages.length + ' 条寄语 →';
        }
      }
    }
  };

  // ======================================
  // 4. 横向时间轴渲染
  // ======================================
  var HorizontalTimeline = {
    render: function (containerId, timelineData) {
      var container = document.getElementById(containerId);
      if (!container || !Array.isArray(timelineData)) return;

      var nodesHtml = timelineData.map(function (item, idx) {
        var position = idx % 2 === 0 ? 'ht-top' : 'ht-bottom';
        var icon = item.icon || '📌';
        return '<div class="ht-node ' + position + '">' +
          '<div class="ht-dot"></div>' +
          '<div class="ht-year">' + esc(item.year) + '</div>' +
          '<div class="ht-card">' +
          '<div class="ht-card-icon">' + icon + '</div>' +
          '<div class="ht-card-title">' + esc(item.title) + '</div>' +
          '<div class="ht-card-desc">' + esc(item.desc || '') + '</div>' +
          '</div>' +
          '</div>';
      }).join('');

      container.innerHTML =
        '<div class="ht-track">' +
        '<div class="ht-line"></div>' +
        '<div class="ht-nodes">' + nodesHtml + '</div>' +
        '</div>';
    },

    // 从现有数据中提取时间轴数据并渲染
    renderFromContent: function (containerId) {
      var content = getAllContent();
      var history = content.history;
      if (!history || !Array.isArray(history.timeline)) {
        // 没有数据时使用默认示例数据
        var defaultData = [
          { year: '1991', title: '医院获批成立', desc: '经云南省人民政府批准，大理学院附属医院正式立项筹建。', icon: '🏛️' },
          { year: '1997', title: '正式开诊运营', desc: '医院完成一期建设，正式面向社会提供医疗服务。', icon: '🏥' },
          { year: '2003', title: '并入大理学院', desc: '正式成为大理学院直属附属医院，教学医疗融合发展。', icon: '🎓' },
          { year: '2008', title: '二期扩建完成', desc: '住院大楼落成启用，床位规模大幅提升。', icon: '🏗️' },
          { year: '2015', title: '三甲评审通过', desc: '成功通过三级甲等综合医院评审，迈入高质量发展新阶段。', icon: '🏆' },
          { year: '2020', title: '驰援抗疫一线', desc: '派出多批医疗队驰援武汉、瑞丽等地，彰显大附院担当。', icon: '🚑' },
          { year: '2023', title: '凤仪院区启用', desc: '一院两区格局形成，区域医疗中心建设加速推进。', icon: '🌟' },
          { year: '2026', title: '建院35周年', desc: '三十五载砥砺奋进，向着滇西医疗高地目标持续迈进。', icon: '🎂' }
        ];
        this.render(containerId, defaultData);
        return;
      }
      this.render(containerId, history.timeline);
    }
  };

  // ======================================
  // 导航栏搜索框初始化
  // ======================================
  function initNavSearch() {
    var navActions = document.querySelector('.nav-actions');
    if (!navActions) return;
    if (document.querySelector('.nav-search-box')) return; // 已初始化

    var searchBox = document.createElement('div');
    searchBox.className = 'nav-search-box';
    searchBox.innerHTML =
      '<span class="nav-search-icon">🔍</span>' +
      '<input type="text" class="nav-search-input" placeholder="搜索院史..." id="navSearchInput">';

    // 插入到主题切换按钮前面
    var themeBtn = navActions.querySelector('.btn-theme');
    if (themeBtn) {
      navActions.insertBefore(searchBox, themeBtn);
    } else {
      navActions.insertBefore(searchBox, navActions.firstChild);
    }

    var input = searchBox.querySelector('input');
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && input.value.trim()) {
        window.location.href = '../pages/search.html?q=' + encodeURIComponent(input.value.trim());
      }
    });
  }

  // ======================================
  // 5. 人物详情弹窗
  // ======================================
  var PersonModal = {
    _overlay: null,

    init: function () {
      // 自动绑定人物卡片点击
      var cards = document.querySelectorAll('.leader-card, .profile-card');
      cards.forEach(function (card) {
        card.style.cursor = 'pointer';
        card.addEventListener('click', function () {
          var name = card.querySelector('.leader-name, .profile-name')?.textContent || '';
          var position = card.querySelector('.leader-position, .profile-position')?.textContent || '';
          var years = card.querySelector('.leader-years, .profile-years')?.textContent || '';
          var desc = card.querySelector('.leader-desc, .profile-desc')?.textContent || '';
          var era = card.querySelector('.leader-era, .profile-era')?.textContent || '';
          var photo = card.querySelector('img')?.src || '';

          PersonModal.open({
            name: name,
            position: position,
            years: years,
            desc: desc,
            era: era,
            photo: photo
          });
        });
      });
    },

    open: function (person) {
      if (!this._overlay) {
        this._build();
      }

      // 填充数据
      var nameEl = this._overlay.querySelector('.person-modal-name');
      var posEl = this._overlay.querySelector('.person-modal-position');
      var yearsEl = this._overlay.querySelector('.person-modal-years');
      var descEl = this._overlay.querySelector('.person-modal-desc');
      var eraEl = this._overlay.querySelector('.person-modal-era');
      var avatarEl = this._overlay.querySelector('.person-modal-avatar');

      nameEl.textContent = person.name || '未知';
      posEl.textContent = person.position || '';
      yearsEl.textContent = person.years || '';
      descEl.textContent = person.desc || '暂无详细介绍';
      eraEl.textContent = person.era || '';
      eraEl.style.display = person.era ? 'inline-block' : 'none';

      if (person.photo) {
        avatarEl.innerHTML = '<img src="' + person.photo + '" alt="' + person.name + '">';
      } else {
        avatarEl.textContent = person.name ? person.name.charAt(0) : '?';
      }

      this._overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    },

    close: function () {
      if (this._overlay) {
        this._overlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    },

    _build: function () {
      var overlay = document.createElement('div');
      overlay.className = 'person-modal-overlay';
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-modal', 'true');
      overlay.innerHTML =
        '<div class="person-modal">' +
          '<button class="person-modal-close" aria-label="关闭">✕</button>' +
          '<div class="person-modal-header">' +
            '<div class="person-modal-avatar"></div>' +
            '<div class="person-modal-info">' +
              '<h3 class="person-modal-name"></h3>' +
              '<div class="person-modal-position"></div>' +
              '<div class="person-modal-years"></div>' +
            '</div>' +
          '</div>' +
          '<div class="person-modal-body">' +
            '<span class="person-modal-era"></span>' +
            '<p class="person-modal-desc"></p>' +
            '<div class="person-modal-section">' +
              '<h4>主要贡献</h4>' +
              '<p>点击人物卡片查看更多详细信息。可在后台管理系统中补充完善人物履历、学术成就、代表作品等内容。</p>' +
            '</div>' +
          '</div>' +
        '</div>';

      document.body.appendChild(overlay);
      this._overlay = overlay;

      // 关闭事件
      overlay.querySelector('.person-modal-close').addEventListener('click', function () {
        PersonModal.close();
      });
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) PersonModal.close();
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && PersonModal._overlay && PersonModal._overlay.classList.contains('active')) PersonModal.close();
      });
    }
  };

  // ======================================
  // 6. 视觉增强模块
  // ======================================
  var Visuals = {
    // 数字滚动计数动画
    animateCounters: function () {
      var counters = document.querySelectorAll('.stat-value, .dc-value-display, .data-card-value');
      if (counters.length === 0) return;

      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var el = entry.target;
            if (el.dataset.counted) return;
            el.dataset.counted = 'true';
            Visuals._countUp(el);
            observer.unobserve(el);
          }
        });
      }, { threshold: 0.5 });

      counters.forEach(function (el) { observer.observe(el); });
    },

    _countUp: function (el) {
      var text = el.textContent;
      // 提取数字部分
      var match = text.match(/([\d.]+)/);
      if (!match) return;

      var target = parseFloat(match[1]);
      var suffix = text.replace(match[1], '');
      var isFloat = match[1].indexOf('.') > -1;
      var duration = 1500;
      var startTime = null;

      el.classList.add('counting');

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        // easeOutQuart
        var eased = 1 - Math.pow(1 - progress, 4);
        var current = target * eased;

        var display = isFloat
          ? current.toFixed(2)
          : Math.floor(current).toLocaleString();

        el.innerHTML = display + (suffix ? '<small>' + suffix.replace(/<\/?small>/g, '') + '</small>' : '');

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.classList.remove('counting');
        }
      }

      requestAnimationFrame(step);
    },

    // Hero 背景视差
    initParallax: function () {
      var heroBg = document.querySelector('.hero-bg, .page-hero-bg');
      if (!heroBg) return;

      window.addEventListener('scroll', function () {
        var scrollY = window.scrollY;
        if (scrollY < window.innerHeight) {
          heroBg.style.transform = 'translateY(' + (scrollY * 0.3) + 'px) scale(1.05)';
        }
      }, { passive: true });
    },

    // 打字机效果（替换hero-flip）
    initTypewriter: function () {
      var track = document.getElementById('heroFlipTrack');
      if (!track) return;

      var items = track.querySelectorAll('.hero-flip-item');
      if (items.length === 0) return;

      var texts = [];
      items.forEach(function (item) { texts.push(item.textContent.trim()); });

      // 替换为打字机容器
      var container = document.createElement('span');
      container.className = 'hero-typewriter';
      var cursor = document.createElement('span');
      cursor.className = 'hero-typewriter-cursor';
      track.parentNode.replaceChild(container, track);
      track.parentNode.appendChild(cursor);

      var currentIndex = 0;
      var charIndex = 0;
      var isDeleting = false;

      function tick() {
        var currentText = texts[currentIndex];

        if (!isDeleting) {
          charIndex++;
          container.textContent = currentText.substring(0, charIndex);
          if (charIndex === currentText.length) {
            isDeleting = true;
            setTimeout(tick, 2000);
            return;
          }
          setTimeout(tick, 80);
        } else {
          charIndex--;
          container.textContent = currentText.substring(0, charIndex);
          if (charIndex === 0) {
            isDeleting = false;
            currentIndex = (currentIndex + 1) % texts.length;
            setTimeout(tick, 500);
            return;
          }
          setTimeout(tick, 40);
        }
      }

      setTimeout(tick, 800);
    },

    // 滚动渐入动画（IntersectionObserver）
    initScrollReveal: function () {
      var elements = document.querySelectorAll('.fade-in, .slide-left, .slide-right, .scale-in');
      if (elements.length === 0) return;

      // 先把所有元素设为初始状态
      elements.forEach(function (el) {
        el.style.opacity = '0';
      });

      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            entry.target.style.opacity = '';
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });

      elements.forEach(function (el) { observer.observe(el); });
    },

    // 图片懒加载淡入 + 原生lazy
    initLazyImages: function () {
      var images = document.querySelectorAll('img');
      if (images.length === 0) return;

      images.forEach(function (img) {
        // 异步解码，避免阻塞主线程
        if (!img.hasAttribute('decoding')) img.setAttribute('decoding', 'async');

        // 跳过首屏Hero大图（不lazy，保证首屏体验）
        var isHero = img.classList.contains('page-hero-bg') ||
                     img.classList.contains('hero-bg-image') ||
                     img.closest('.hero, .page-hero');

        if (!isHero && !img.hasAttribute('loading')) {
          img.setAttribute('loading', 'lazy');
        }

        // 淡入效果
        if (img.complete && img.naturalWidth > 0) {
          img.classList.add('loaded');
          return;
        }
        img.classList.add('lazy-img');
        img.addEventListener('load', function () {
          img.classList.add('loaded');
        });
        img.addEventListener('error', function () {
          img.classList.add('loaded');
        });
      });
    },

    // 按钮涟漪效果
    initRipple: function () {
      var buttons = document.querySelectorAll('.btn-primary, .btn-outline, .btn-tour, .btn-submit-msg');
      buttons.forEach(function (btn) {
        btn.addEventListener('click', function (e) {
          var rect = btn.getBoundingClientRect();
          var ripple = document.createElement('span');
          ripple.className = 'btn-ripple';
          var size = Math.max(rect.width, rect.height);
          ripple.style.width = ripple.style.height = size + 'px';
          ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
          ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
          btn.appendChild(ripple);
          setTimeout(function () { ripple.remove(); }, 600);
        });
      });
    },

    // 导航栏滚动变色
    initNavScroll: function () {
      var navbar = document.querySelector('.navbar');
      if (!navbar) return;

      function onScroll() {
        if (window.scrollY > 30) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      }

      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    },

    // 移动端底部导航
    initMobileNav: function () {
      if (window.innerWidth > 768) return;
      if (document.querySelector('.mobile-bottom-nav')) return;

      var nav = document.createElement('div');
      nav.className = 'mobile-bottom-nav';
      nav.innerHTML =
        '<a href="../index.html" class="mobile-nav-item"><span class="icon">🏛</span><span>首页</span></a>' +
        '<a href="timeline.html" class="mobile-nav-item"><span class="icon">⏳</span><span>时间轴</span></a>' +
        '<a href="search.html" class="mobile-nav-item"><span class="icon">🔍</span><span>搜索</span></a>' +
        '<a href="messages.html" class="mobile-nav-item"><span class="icon">💬</span><span>寄语</span></a>' +
        '<a href="04-campus.html" class="mobile-nav-item"><span class="icon">🏥</span><span>院区</span></a>';

      // 首页路径修正
      if (location.pathname.indexOf('/pages/') === -1) {
        nav.innerHTML =
          '<a href="index.html" class="mobile-nav-item active"><span class="icon">🏛</span><span>首页</span></a>' +
          '<a href="pages/timeline.html" class="mobile-nav-item"><span class="icon">⏳</span><span>时间轴</span></a>' +
          '<a href="pages/search.html" class="mobile-nav-item"><span class="icon">🔍</span><span>搜索</span></a>' +
          '<a href="pages/messages.html" class="mobile-nav-item"><span class="icon">💬</span><span>寄语</span></a>' +
          '<a href="pages/04-campus.html" class="mobile-nav-item"><span class="icon">🏥</span><span>院区</span></a>';
      }

      document.body.appendChild(nav);
    },

    // 无障碍：跳过导航链接
    initSkipLink: function () {
      if (document.querySelector('.skip-link')) return;
      var skip = document.createElement('a');
      skip.className = 'skip-link';
      skip.href = '#main-content';
      skip.textContent = '跳过导航，直达内容';
      document.body.insertBefore(skip, document.body.firstChild);

      // 给主内容区加id
      var main = document.querySelector('.section-body, .search-page-wrapper, .timeline-page-wrapper, .message-wall-wrapper');
      if (main && !main.id) {
        main.id = 'main-content';
      }
    },

    // 无障碍：自动补充图片alt属性
    initImageAlt: function () {
      var images = document.querySelectorAll('img:not([alt])');
      images.forEach(function (img) {
        var src = img.getAttribute('src') || '';
        var name = src.split('/').pop().replace(/\.[^.]+$/, '').replace(/[_-]/g, ' ');
        img.setAttribute('alt', name || '院史馆图片');
      });
    },

    // 悬浮快捷按钮
    initQuickActions: function () {
      if (document.querySelector('.quick-actions')) return;

      var isHome = location.pathname.indexOf('/pages/') === -1;
      var prefix = isHome ? 'pages/' : '';

      var wrap = document.createElement('div');
      wrap.className = 'quick-actions';
      wrap.innerHTML =
        '<a href="' + prefix + 'search.html" class="quick-btn quick-btn-search" title="搜索">🔍</a>' +
        '<a href="' + prefix + 'messages.html" class="quick-btn quick-btn-message" title="留言">💬</a>' +
        '<button class="quick-btn quick-btn-top" title="返回顶部">↑</button>';

      document.body.appendChild(wrap);

      // 滚动显示
      var topBtn = wrap.querySelector('.quick-btn-top');
      window.addEventListener('scroll', function () {
        if (window.scrollY > 400) {
          wrap.classList.add('visible');
          topBtn.classList.add('visible');
        } else {
          topBtn.classList.remove('visible');
          if (window.scrollY < 100) wrap.classList.remove('visible');
        }
      }, { passive: true });

      // 返回顶部
      topBtn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    },

    // 一键初始化全部
    initAll: function () {
      this.initNavScroll();
      this.initParallax();
      this.initScrollReveal();
      this.initLazyImages();
      this.initRipple();
      this.animateCounters();
      this.initTypewriter();
      this.initMobileNav();
      this.initSkipLink();
      this.initImageAlt();
      this.initQuickActions();
    }
  };

  // ======================================
  // ======================================
  // 8. 时间轴详情弹窗
  // ======================================
  var TimelineModal = {
    _overlay: null,
    _data: [],

    init: function (timelineData) {
      if (timelineData) this._data = timelineData;

      // 自动绑定横向时间轴节点
      var nodes = document.querySelectorAll('.ht-node');
      nodes.forEach(function (node, idx) {
        node.style.cursor = 'pointer';
        node.addEventListener('click', function () {
          var data = timelineData ? timelineData[idx] : null;
          if (!data) {
            // 从DOM提取
            data = {
              year: node.querySelector('.ht-year')?.textContent || '',
              title: node.querySelector('.ht-title')?.textContent || '',
              desc: node.querySelector('.ht-desc')?.textContent || '',
              tag: node.querySelector('.ht-tag')?.textContent || ''
            };
          }
          TimelineModal.open(data);
        });
      });
    },

    open: function (item) {
      if (!this._overlay) this._build();

      this._overlay.querySelector('.timeline-modal-year').textContent = item.year || '';
      this._overlay.querySelector('.timeline-modal-title').textContent = item.title || '';
      this._overlay.querySelector('.timeline-modal-desc').textContent = item.desc || '暂无详细介绍';
      var tagEl = this._overlay.querySelector('.timeline-modal-tag');
      if (item.tag) {
        tagEl.textContent = item.tag;
        tagEl.style.display = 'inline-block';
      } else {
        tagEl.style.display = 'none';
      }

      this._overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    },

    close: function () {
      if (this._overlay) {
        this._overlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    },

    _build: function () {
      var overlay = document.createElement('div');
      overlay.className = 'timeline-modal-overlay';
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-modal', 'true');
      overlay.innerHTML =
        '<div class="timeline-modal">' +
          '<button class="timeline-modal-close" aria-label="关闭">✕</button>' +
          '<div class="timeline-modal-header">' +
            '<h2 class="timeline-modal-year"></h2>' +
            '<h3 class="timeline-modal-title"></h3>' +
            '<span class="timeline-modal-tag"></span>' +
          '</div>' +
          '<div class="timeline-modal-body">' +
            '<p class="timeline-modal-desc"></p>' +
            '<div class="timeline-modal-section">' +
              '<h4>历史意义</h4>' +
              '<p>该事件是医院发展历程中的重要里程碑，标志着医院在对应时期迈上了新的发展台阶，为后续建设奠定了坚实基础。</p>' +
            '</div>' +
          '</div>' +
        '</div>';

      document.body.appendChild(overlay);
      this._overlay = overlay;

      overlay.querySelector('.timeline-modal-close').addEventListener('click', function () {
        TimelineModal.close();
      });
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) TimelineModal.close();
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') TimelineModal.close();
      });
    }
  };

  // ======================================
  // 10. 侧边目录导航
  // ======================================
  var SidebarTOC = {
    init: function () {
      // 只在板块页面启用
      var blocks = document.querySelectorAll('.section-block');
      if (blocks.length < 3) return;

      var toc = document.createElement('nav');
      toc.className = 'sidebar-toc';
      toc.setAttribute('aria-label', '页面目录');

      var listHtml = '<div class="toc-title">目录</div><ul class="toc-list">';
      var count = 0;

      blocks.forEach(function (block, idx) {
        var titleEl = block.querySelector('.block-title');
        if (!titleEl) return;
        var title = titleEl.textContent.trim();
        var id = 'section-' + idx;
        block.id = id;
        count++;
        listHtml += '<li class="toc-item" data-target="' + id + '">' + title + '</li>';
      });

      listHtml += '</ul>';
      if (count < 3) return; // 少于3个不显示

      toc.innerHTML = listHtml;
      document.body.appendChild(toc);
      toc.classList.add('visible');

      // 点击跳转
      toc.querySelectorAll('.toc-item').forEach(function (item) {
        item.addEventListener('click', function () {
          var target = document.getElementById(item.getAttribute('data-target'));
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
      });

      // 滚动高亮
      var tocItems = toc.querySelectorAll('.toc-item');
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.id;
            tocItems.forEach(function (it) {
              it.classList.toggle('active', it.getAttribute('data-target') === id);
            });
          }
        });
      }, { threshold: 0.3, rootMargin: '-80px 0px -60% 0px' });

      blocks.forEach(function (b) { observer.observe(b); });
    }
  };

  // ======================================
  // 11. 荣誉殿堂年代筛选
  // ======================================
  var HonorsFilter = {
    init: function () {
      var filters = document.querySelectorAll('.honor-filter');
      var groups = document.querySelectorAll('.honor-era-group');
      if (!filters.length) return;

      filters.forEach(function (btn) {
        btn.addEventListener('click', function () {
          var era = btn.getAttribute('data-era');

          // 更新按钮状态
          filters.forEach(function (f) { f.classList.remove('active'); });
          btn.classList.add('active');

          // 显示/隐藏分组
          groups.forEach(function (g) {
            if (era === 'all' || g.getAttribute('data-era') === era) {
              g.classList.remove('hidden');
            } else {
              g.classList.add('hidden');
            }
          });
        });
      });
    }
  };

  // 暴露到全局
  // ======================================
  window.MuseumFeatures = {
    SiteSearch: SiteSearch,
    Lightbox: Lightbox,
    MessageWall: MessageWall,
    HorizontalTimeline: HorizontalTimeline,
    PersonModal: PersonModal,
    HonorsFilter: HonorsFilter,
    Visuals: Visuals,
    initNavSearch: initNavSearch
  };

  // 自动初始化（页面加载后）
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initNavSearch();
      Visuals.initAll();
      PersonModal.init();
      HonorsFilter.init();
      Lightbox.bindAllContentImages();
      TimelineModal.init();
      SidebarTOC.init();
      MessageWall.initInline();
    });
  } else {
    initNavSearch();
    Visuals.initAll();
    PersonModal.init();
    HonorsFilter.init();
    Lightbox.bindAllContentImages();
    TimelineModal.init();
    SidebarTOC.init();
    MessageWall.initInline();
  }

})();
