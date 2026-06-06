/**
 * 云端院史馆 · 后台管理系统
 * 基于 AdminLTE 3.x + localStorage
 * 管理 12 板块 + 公告 + 系统设置
 */

// ====== 数据模型 ======
const SECTIONS = [
  { id: 'history',     name: '历史沿革', icon: 'fas fa-history',       color: '#2980b9', page: '01-history.html' },
  { id: 'people',      name: '人物风采', icon: 'fas fa-users',         color: '#e67e22', page: '02-people.html' },
  { id: 'disciplines', name: '学科建设', icon: 'fas fa-microscope',    color: '#27ae60', page: '03-disciplines.html' },
  { id: 'campus',      name: '院区建设', icon: 'fas fa-building',      color: '#8e44ad', page: '04-campus.html' },
  { id: 'education',   name: '教学人才', icon: 'fas fa-graduation-cap',color: '#e91e63', page: '05-education.html' },
  { id: 'culture',     name: '文化建设', icon: 'fas fa-heart',         color: '#f57c00', page: '06-culture.html' },
  { id: 'tech',        name: '科技交流', icon: 'fas fa-robot',         color: '#1565c0', page: '07-tech.html' },
  { id: 'duty',        name: '责任担当', icon: 'fas fa-shield-alt',    color: '#c62828', page: '08-duty.html' },
  { id: 'honors',      name: '荣誉殿堂', icon: 'fas fa-trophy',        color: '#f9a825', page: '09-honors.html' },
  { id: 'vision',      name: '展望未来', icon: 'fas fa-eye',           color: '#00695c', page: '10-vision.html' },
  { id: 'structure',   name: '组织架构', icon: 'fas fa-sitemap',       color: '#4527a0', page: '11-structure.html' },
  { id: 'leadership',  name: '领导团队', icon: 'fas fa-user-tie',      color: '#bf360c', page: '12-leadership.html' }
];

// 初始化数据
function initData() {
  if (!localStorage.getItem('hm_admin_sections')) {
    var data = {};
    SECTIONS.forEach(function(s) {
      data[s.id] = { title: s.name, status: 'published', updatedAt: new Date().toISOString().split('T')[0], notes: '' };
    });
    localStorage.setItem('hm_admin_sections', JSON.stringify(data));
  }
  if (!localStorage.getItem('hm_announcements')) {
    var anns = [
      { id: 1, title: '大理大学第一附属医院2024年度工作报告', date: '2025-05-20', category: 'notice', dept: '院办', published: true },
      { id: 2, title: '关于开展2025年"5·12"国际护士节系列活动的通知', date: '2025-05-10', category: 'event', dept: '护理部', published: true },
      { id: 3, title: '关于2025年职称评审工作的通知', date: '2025-05-08', category: 'hr', dept: '人事科', published: true },
      { id: 4, title: '关于召开2025年科研工作推进会的通知', date: '2025-04-28', category: 'academic', dept: '科研科', published: true },
      { id: 5, title: '2025年劳动节放假及值班安排', date: '2025-04-25', category: 'notice', dept: '院办', published: true },
      { id: 6, title: '关于启动2026年度国家自然科学基金申报工作的通知', date: '2025-04-15', category: 'academic', dept: '科研科', published: true }
    ];
    localStorage.setItem('hm_announcements', JSON.stringify(anns));
  }
  if (!localStorage.getItem('hm_settings')) {
    var settings = {
      siteTitle: '云端院史馆',
      siteSubtitle: '大理大学第一附属医院',
      officialUrl: 'https://www.dfy.dali.edu.cn',
      contactEmail: '',
      contactPhone: ''
    };
    localStorage.setItem('hm_settings', JSON.stringify(settings));
  }
}

// ====== 页面路由 ======
var currentPage = 'dashboard';

function navigateTo(pageId) {
  currentPage = pageId;
  // 更新侧边栏 active
  $('.nav-sidebar .nav-link').removeClass('active');
  $('.nav-sidebar .nav-link[data-page="' + pageId + '"]').addClass('active');

  // 渲染内容
  var html = '';
  switch (pageId) {
    case 'dashboard':     html = renderDashboard(); break;
    case 'announcements': html = renderAnnouncements(); break;
    case 'settings':      html = renderSettings(); break;
    default:
      var sec = SECTIONS.find(function(s) { return s.id === pageId; });
      if (sec) { html = renderSectionEditor(sec); }
      else { html = renderDashboard(); }
  }

  var titleMap = {
    dashboard: '控制台', announcements: '公告管理', settings: '网站设置'
  };
  var sec = SECTIONS.find(function(s) { return s.id === pageId; });
  var pageTitle = titleMap[pageId] || (sec ? sec.name : '控制台');
  $('#page-title').text(pageTitle);

  var bc = '<li class="breadcrumb-item"><a href="#" data-nav="dashboard">控制台</a></li>';
  if (pageId !== 'dashboard') {
    bc += '<li class="breadcrumb-item active">' + pageTitle + '</li>';
  } else {
    bc = '<li class="breadcrumb-item active">控制台</li>';
  }
  $('#breadcrumb').html(bc);
  $('#main-content').html(html);

  // 绑定面包屑导航
  $('#breadcrumb a[data-nav]').click(function(e) {
    e.preventDefault();
    navigateTo($(this).data('nav'));
  });
}

// ====== 控制台 ======
function renderDashboard() {
  var sd = JSON.parse(localStorage.getItem('hm_admin_sections') || '{}');
  var published = 0, drafts = 0;
  SECTIONS.forEach(function(s) {
    if (sd[s.id] && sd[s.id].status === 'published') published++;
    else drafts++;
  });

  var anns = JSON.parse(localStorage.getItem('hm_announcements') || '[]');
  var activeAnns = anns.filter(function(a) { return a.published; }).length;

  var html = '<div class="container-fluid">';

  // 统计卡片
  html += '<div class="row">';
  html += statCard('col-lg-3 col-6', 'bg-info', 'fas fa-layer-group', published, '已发布板块');
  html += statCard('col-lg-3 col-6', 'bg-warning', 'fas fa-edit', drafts, '待编辑板块');
  html += statCard('col-lg-3 col-6', 'bg-success', 'fas fa-bullhorn', activeAnns, '有效公告');
  html += statCard('col-lg-3 col-6', 'bg-danger', 'fas fa-clock', new Date().getFullYear(), '当前年份');
  html += '</div>';

  // 板块管理列表
  html += '<div class="row"><div class="col-12">';
  html += '<div class="card card-primary card-outline"><div class="card-header"><h3 class="card-title">板块内容管理</h3></div>';
  html += '<div class="card-body p-0"><div class="table-responsive"><table class="table table-hover mb-0">';
  html += '<thead><tr><th style="width:60px">序号</th><th>板块名称</th><th>状态</th><th>最后更新</th><th>操作</th></tr></thead><tbody>';

  SECTIONS.forEach(function(s, i) {
    var d = sd[s.id] || { status: 'draft', updatedAt: '-', notes: '' };
    var statusClass = d.status === 'published' ? 'status-published' : (d.status === 'review' ? 'status-review' : 'status-draft');
    var statusText = d.status === 'published' ? '已发布' : (d.status === 'review' ? '审核中' : '草稿');
    html += '<tr>';
    html += '<td>' + pad2(i+1) + '</td>';
    html += '<td><i class="' + s.icon + '" style="color:' + s.color + ';margin-right:8px"></i><strong>' + s.name + '</strong></td>';
    html += '<td><span class="status-badge ' + statusClass + '">' + statusText + '</span></td>';
    html += '<td>' + (d.updatedAt || '-') + '</td>';
    html += '<td><button class="btn btn-sm btn-outline-primary" data-nav="' + s.id + '"><i class="fas fa-pen mr-1"></i>编辑</button> ';
    html += '<a href="../pages/' + s.page + '" target="_blank" class="btn btn-sm btn-outline-secondary"><i class="fas fa-eye mr-1"></i>预览</a></td>';
    html += '</tr>';
  });

  html += '</tbody></table></div></div></div></div></div>';

  // 快捷操作
  html += '<div class="row"><div class="col-12">';
  html += '<div class="card card-accent card-outline"><div class="card-header"><h3 class="card-title">快捷操作</h3></div><div class="card-body">';
  html += '<div class="quick-actions">';
  html += '<a href="#" class="quick-action-btn" data-nav="announcements"><i class="fas fa-plus-circle text-success"></i>发布公告</a>';
  html += '<a href="#" class="quick-action-btn" data-nav="people"><i class="fas fa-user-plus text-warning"></i>更新人物信息</a>';
  html += '<a href="#" class="quick-action-btn" data-nav="honors"><i class="fas fa-medal text-info"></i>添加荣誉</a>';
  html += '<a href="#" class="quick-action-btn" data-nav="settings"><i class="fas fa-cog text-secondary"></i>网站设置</a>';
  html += '<a href="../index.html" target="_blank" class="quick-action-btn"><i class="fas fa-desktop text-primary"></i>打开前台网站</a>';
  html += '<a href="https://www.dfy.dali.edu.cn" target="_blank" class="quick-action-btn"><i class="fas fa-globe text-danger"></i>医院官网</a>';
  html += '</div></div></div></div></div>';

  html += '</div>';
  return html;
}

function statCard(col, bg, icon, count, label) {
  return '<div class="' + col + '"><div class="small-box ' + bg + '">' +
    '<div class="inner"><h3>' + count + '</h3><p>' + label + '</p></div>' +
    '<div class="icon"><i class="' + icon + '"></i></div></div></div>';
}

function pad2(n) { return n < 10 ? '0' + n : '' + n; }

// ====== 板块编辑器 ======
function renderSectionEditor(section) {
  var sd = JSON.parse(localStorage.getItem('hm_admin_sections') || '{}');
  var data = sd[section.id] || { title: section.name, status: 'draft', updatedAt: '', notes: '' };

  var html = '<div class="container-fluid"><div class="row"><div class="col-md-8">';

  // 主编辑区
  html += '<div class="card card-primary card-outline"><div class="card-header"><h3 class="card-title"><i class="' + section.icon + '" style="color:' + section.color + '"></i> ' + section.name + ' — 内容编辑</h3></div>';
  html += '<div class="card-body">';

  html += '<div class="form-group"><label><strong>板块标题</strong></label>';
  html += '<input type="text" class="form-control" id="sec-title" value="' + escHtml(data.title) + '">';
  html += '<small class="text-muted">显示在板块顶部的标题</small></div>';

  html += '<div class="form-group"><label><strong>内容摘要 / 备注</strong></label>';
  html += '<textarea class="form-control" id="sec-notes" rows="4" placeholder="输入板块内容摘要或编辑备注...">' + escHtml(data.notes) + '</textarea></div>';

  html += '<div class="form-group"><label><strong>状态</strong></label>';
  html += '<select class="form-control" id="sec-status">';
  html += '<option value="published"' + (data.status === 'published' ? ' selected' : '') + '>已发布</option>';
  html += '<option value="review"' + (data.status === 'review' ? ' selected' : '') + '>审核中</option>';
  html += '<option value="draft"' + (data.status === 'draft' ? ' selected' : '') + '>草稿</option>';
  html += '</select></div>';

  html += '<button class="btn btn-primary" id="btn-save-section"><i class="fas fa-save mr-1"></i>保存</button> ';
  html += '<a href="../pages/' + section.page + '" target="_blank" class="btn btn-outline-info"><i class="fas fa-eye mr-1"></i>预览前台页面</a>';

  html += '</div></div></div>';

  // 侧边信息
  html += '<div class="col-md-4">';
  html += '<div class="card card-accent card-outline"><div class="card-header"><h3 class="card-title">页面信息</h3></div>';
  html += '<div class="card-body">';
  html += '<p><strong>前台页面：</strong><br><code>pages/' + section.page + '</code></p>';
  html += '<p><strong>最后更新：</strong><br><span id="info-updated">' + (data.updatedAt || '未保存') + '</span></p>';
  html += '<p><strong>当前状态：</strong><br><span id="info-status" class="status-badge ' + (data.status === 'published' ? 'status-published' : 'status-draft') + '">' + (data.status === 'published' ? '已发布' : '草稿') + '</span></p>';
  html += '</div></div>';

  html += '<div class="card"><div class="card-header"><h3 class="card-title">操作提示</h3></div>';
  html += '<div class="card-body"><ul class="mb-0 pl-3"><li>修改标题和摘要后点击<strong>保存</strong></li><li>状态改为<strong>已发布</strong>后前台可见</li><li>直接编辑 <code>pages/' + section.page + '</code> 修改详细内容</li></ul></div></div>';
  html += '</div>';

  html += '</div></div>';
  return html;
}

// ====== 公告管理 ======
function renderAnnouncements() {
  var anns = JSON.parse(localStorage.getItem('hm_announcements') || '[]');
  var catMap = { notice: '通知公告', event: '活动事件', hr: '人事信息', academic: '科研学术' };
  var catColor = { notice: 'info', event: 'warning', hr: 'success', academic: 'primary' };

  var html = '<div class="container-fluid"><div class="row"><div class="col-12">';
  html += '<div class="card card-primary card-outline"><div class="card-header">';
  html += '<h3 class="card-title">公告管理</h3>';
  html += '<div class="card-tools"><button class="btn btn-sm btn-accent" id="btn-add-ann"><i class="fas fa-plus mr-1"></i>新增公告</button></div>';
  html += '</div><div class="card-body p-0">';
  html += '<div class="table-responsive"><table class="table table-hover mb-0"><thead><tr>';
  html += '<th>ID</th><th>标题</th><th>分类</th><th>日期</th><th>发布部门</th><th>状态</th><th>操作</th>';
  html += '</tr></thead><tbody>';

  anns.forEach(function(a) {
    html += '<tr>';
    html += '<td>' + a.id + '</td>';
    html += '<td>' + escHtml(a.title) + '</td>';
    html += '<td><span class="badge badge-' + (catColor[a.category] || 'secondary') + '">' + (catMap[a.category] || a.category) + '</span></td>';
    html += '<td>' + a.date + '</td>';
    html += '<td>' + escHtml(a.dept) + '</td>';
    html += '<td><span class="status-badge ' + (a.published ? 'status-published' : 'status-draft') + '">' + (a.published ? '已发布' : '草稿') + '</span></td>';
    html += '<td>';
    html += '<button class="btn btn-sm btn-outline-info toggle-ann" data-id="' + a.id + '"><i class="fas fa-' + (a.published ? 'eye-slash' : 'eye') + '"></i></button> ';
    html += '<button class="btn btn-sm btn-outline-danger del-ann" data-id="' + a.id + '"><i class="fas fa-trash"></i></button>';
    html += '</td></tr>';
  });

  html += '</tbody></table></div></div></div></div>';

  // 新增公告表单
  html += '<div class="row"><div class="col-12">';
  html += '<div class="card card-accent card-outline" id="add-ann-form" style="display:none"><div class="card-header"><h3 class="card-title">新增公告</h3></div>';
  html += '<div class="card-body"><div class="row">';
  html += '<div class="col-md-6"><div class="form-group"><label>标题</label><input class="form-control" id="ann-title"></div></div>';
  html += '<div class="col-md-3"><div class="form-group"><label>日期</label><input type="date" class="form-control" id="ann-date"></div></div>';
  html += '<div class="col-md-3"><div class="form-group"><label>分类</label><select class="form-control" id="ann-cat"><option value="notice">通知公告</option><option value="event">活动事件</option><option value="hr">人事信息</option><option value="academic">科研学术</option></select></div></div>';
  html += '<div class="col-md-3"><div class="form-group"><label>发布部门</label><input class="form-control" id="ann-dept"></div></div>';
  html += '</div>';
  html += '<button class="btn btn-accent" id="btn-save-ann"><i class="fas fa-check mr-1"></i>提交</button> ';
  html += '<button class="btn btn-outline-secondary" id="btn-cancel-ann">取消</button>';
  html += '</div></div></div></div>';

  html += '</div></div>';
  return html;
}

// ====== 网站设置 ======
function renderSettings() {
  var settings = JSON.parse(localStorage.getItem('hm_settings') || '{}');

  var html = '<div class="container-fluid"><div class="row"><div class="col-md-8">';
  html += '<div class="card card-primary card-outline"><div class="card-header"><h3 class="card-title">网站设置</h3></div>';
  html += '<div class="card-body">';

  html += '<div class="form-group"><label>网站标题</label>';
  html += '<input class="form-control" id="set-title" value="' + escHtml(settings.siteTitle || '') + '"></div>';

  html += '<div class="form-group"><label>副标题</label>';
  html += '<input class="form-control" id="set-subtitle" value="' + escHtml(settings.siteSubtitle || '') + '"></div>';

  html += '<div class="form-group"><label>医院官网链接</label>';
  html += '<input class="form-control" id="set-url" value="' + escHtml(settings.officialUrl || '') + '"></div>';

  html += '<div class="form-group"><label>联系邮箱</label>';
  html += '<input type="email" class="form-control" id="set-email" value="' + escHtml(settings.contactEmail || '') + '"></div>';

  html += '<div class="form-group"><label>联系电话</label>';
  html += '<input class="form-control" id="set-phone" value="' + escHtml(settings.contactPhone || '') + '"></div>';

  html += '<div class="form-group"><label>建院年份</label>';
  html += '<input type="number" class="form-control" id="set-founded-year" value="' + (settings.foundedYear || '1991') + '" min="1900" max="2100">';
  html += '<small class="form-text text-muted">前台将据此自动计算院龄（当前年份 - 建院年份）</small></div>';

  html += '<button class="btn btn-primary" id="btn-save-settings"><i class="fas fa-save mr-1"></i>保存设置</button>';

  html += '</div></div></div>';
  html += '<div class="col-md-4"><div class="card"><div class="card-header"><h3 class="card-title">说明</h3></div>';
  html += '<div class="card-body"><p class="text-muted mb-0">此处设置影响前台网站的基础信息。修改后需重新发布前台页面才能生效。</p></div></div></div>';
  html += '</div></div>';
  return html;
}

// ====== 事件绑定 ======
$(document).ready(function() {
  initData();

  // 侧边栏导航
  $(document).on('click', '.nav-sidebar .nav-link[data-page]', function(e) {
    e.preventDefault();
    navigateTo($(this).data('page'));
  });

  // 快捷操作按钮
  $(document).on('click', '[data-nav]', function(e) {
    if ($(this).closest('.nav-sidebar').length > 0) return; // 侧边栏已在上面处理
    e.preventDefault();
    navigateTo($(this).data('nav'));
  });

  // 保存板块
  $(document).on('click', '#btn-save-section', function() {
    var sd = JSON.parse(localStorage.getItem('hm_admin_sections') || '{}');
    sd[currentPage] = {
      title: $('#sec-title').val(),
      status: $('#sec-status').val(),
      notes: $('#sec-notes').val(),
      updatedAt: new Date().toISOString().split('T')[0]
    };
    localStorage.setItem('hm_admin_sections', JSON.stringify(sd));
    $('#info-updated').text(sd[currentPage].updatedAt);
    $('#info-status').text(sd[currentPage].status === 'published' ? '已发布' : (sd[currentPage].status === 'review' ? '审核中' : '草稿'))
      .attr('class', 'status-badge ' + (sd[currentPage].status === 'published' ? 'status-published' : 'status-draft'));
    $(document).Toasts('create', { class: 'bg-success', title: '保存成功', body: SECTIONS.find(function(s){return s.id===currentPage;}).name + ' 已保存', autohide: true, delay: 2000 });
  });

  // 全部保存
  $('#btn-save-all').click(function(e) {
    e.preventDefault();
    var sd = JSON.parse(localStorage.getItem('hm_admin_sections') || '{}');
    SECTIONS.forEach(function(s) {
      if (!sd[s.id]) sd[s.id] = { title: s.name, status: 'published', updatedAt: new Date().toISOString().split('T')[0], notes: '' };
    });
    localStorage.setItem('hm_admin_sections', JSON.stringify(sd));
    $(document).Toasts('create', { class: 'bg-success', title: '全部保存', body: '12个板块已全部设置为已发布状态', autohide: true, delay: 2000 });
  });

  // 公告管理
  $('#btn-add-ann').click(function() { $('#add-ann-form').slideDown(); });
  $('#btn-cancel-ann').click(function() { $('#add-ann-form').slideUp(); });
  $(document).on('click', '#btn-save-ann', function() {
    var anns = JSON.parse(localStorage.getItem('hm_announcements') || '[]');
    var maxId = 0;
    anns.forEach(function(a) { if (a.id > maxId) maxId = a.id; });
    anns.push({
      id: maxId + 1,
      title: $('#ann-title').val(),
      date: $('#ann-date').val(),
      category: $('#ann-cat').val(),
      dept: $('#ann-dept').val(),
      published: true
    });
    localStorage.setItem('hm_announcements', JSON.stringify(anns));
    navigateTo('announcements');
    $(document).Toasts('create', { class: 'bg-success', title: '添加成功', body: '公告已发布', autohide: true, delay: 2000 });
  });
  $(document).on('click', '.toggle-ann', function() {
    var id = $(this).data('id');
    var anns = JSON.parse(localStorage.getItem('hm_announcements') || '[]');
    anns = anns.map(function(a) { if (a.id === id) a.published = !a.published; return a; });
    localStorage.setItem('hm_announcements', JSON.stringify(anns));
    navigateTo('announcements');
  });
  $(document).on('click', '.del-ann', function() {
    if (!confirm('确认删除此公告？')) return;
    var id = $(this).data('id');
    var anns = JSON.parse(localStorage.getItem('hm_announcements') || '[]');
    anns = anns.filter(function(a) { return a.id !== id; });
    localStorage.setItem('hm_announcements', JSON.stringify(anns));
    navigateTo('announcements');
  });

  // 保存设置
  $(document).on('click', '#btn-save-settings', function() {
    var settings = {
      siteTitle: $('#set-title').val(),
      siteSubtitle: $('#set-subtitle').val(),
      officialUrl: $('#set-url').val(),
      contactEmail: $('#set-email').val(),
      contactPhone: $('#set-phone').val(),
      foundedYear: parseInt($('#set-founded-year').val()) || 1991
    };
    localStorage.setItem('hm_settings', JSON.stringify(settings));
    $(document).Toasts('create', { class: 'bg-success', title: '设置已保存', body: '网站设置已更新', autohide: true, delay: 2000 });
  });

  // Toast容器
  if (!$('.toasts-top-right').length) {
    $('body').append('<div class="toasts-top-right fixed" style="position:fixed;top:70px;right:20px;z-index:9999"></div>');
  }

  // 初始加载
  navigateTo('dashboard');
});

function escHtml(s) {
  if (!s) return '';
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
