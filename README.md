# 🏥 云端院史馆 · 大理大学第一附属医院

> 大理大学第一附属医院（云南省第四人民医院）数字院史展馆 —— 纯静态、CMS 驱动、GitHub Pages 自动部署

[![Deploy to GitHub Pages](https://github.com/dalihaif/DFY/actions/workflows/pages.yml/badge.svg)](https://github.com/dalihaif/DFY/actions/workflows/pages.yml)

---

## 📖 项目简介

云端院史馆是一个**纯前端静态网站**，完整呈现大理大学第一附属医院的院史文化。系统采用 CMS（内容管理系统）架构，支持后台可视化编辑，数据既可通过 `localStorage` 实时预览，也可导出为 `data.js` 固化部署。

### 核心特性

| 特性 | 说明 |
|------|------|
| 🧩 **13 大板块** | 历史沿革、人物风采、学科建设、院区风貌、医学教育、文化建设、医疗技术、社会责任、医院荣誉、发展愿景、组织架构、历任院领导、职工名录 |
| 🖥️ **可视化后台** | 基于 AdminLTE 的管理面板，支持富文本编辑、图片上传、数据导入/导出 |
| 📊 **职工名录** | 支持 CSV/文本批量导入，编码自动检测（UTF-8/GBK/GB2312），分页浏览，批量增删改 |
| 👤 **人物群像** | 专家群像馆、医学人才、榜样员工、院领导动态卡片，照片 lightbox 放大 |
| 🔄 **数据双通道** | localStorage（编辑预览）→ data.js（发布快照），优先级可配置 |
| 🚀 **自动部署** | Push 即部署，GitHub Actions 自动构建发布到 GitHub Pages |
| 📱 **响应式** | 适配桌面、平板、手机端 |

---

## 🚀 快速开始

### 1. 本地预览（仅浏览）

直接双击 `index.html` 在浏览器中打开即可。

### 2. 本地编辑（推荐）

```bash
# 在项目根目录启动 Python HTTP 服务器
cd hospital-museum
python -m http.server 8000
```

然后通过以下地址访问：

| 页面 | 地址 |
|------|------|
| 🖥️ 管理后台 | `http://localhost:8000/admin/` |
| 🏠 前台首页 | `http://localhost:8000/` |
| 👥 职工名录 | `http://localhost:8000/pages/13-staff.html` |

> ⚠️ **重要**：管理后台和前台必须在同一 origin（同域名同端口）下访问，否则 `localStorage` 不共享，编辑不会即时生效。

### 3. 部署到 GitHub Pages

1. Push 到 GitHub 仓库的 `main` 或 `master` 分支
2. 仓库 Settings → Pages → Source 选择 **GitHub Actions**
3. 等待约 1 分钟自动部署完成
4. 访问 `https://<用户名>.github.io/<仓库名>/`

---

## ✏️ 内容更新流程

```
① 启动本地 HTTP 服务器  →  python -m http.server 8000
② 打开管理后台          →  http://localhost:8000/admin/
③ 编辑各板块内容        →  点击「保存」
④ 导出数据              →  顶部导航「导出数据」→ 下载 data.js
⑤ 替换文件              →  将下载的 data-core.js 和 data-staff.js 覆盖 js/ 目录
⑥ 提交推送              →  git add js/data-core.js js/data-staff.js && git commit -m "update: 内容更新" && git push
⑦ 自动部署              →  GitHub Actions 约 1 分钟完成
```

---

## 📦 数据架构

```
┌─────────────────────────────────────────────────┐
│                    前台页面                       │
│  main.js: 读取 HM_DATA → 动态渲染 13 个板块       │
│  优先级: localStorage.hm_content > js/data-core.js    │
└──────────────────┬──────────────────────────────┘
                   │
    ┌──────────────┴──────────────┐
    │                             │
    ▼                             ▼
┌───────────────┐         ┌──────────────┐
│  localStorage │  ←编辑→  │   管理后台    │
│  hm_content   │  保存    │  admin/      │
└──────┬────────┘         └──────┬───────┘
       │                         │
       │  导出两个文件              │
       ▼                         │
┌──────────────────────┐         │
│  js/data-core.js     │ ←──────┘
│  (所有游客加载, ~50KB) │
└──────────────────────┘
┌──────────────────────┐
│  js/data-staff.js    │  (仅职工页加载, ~580KB)
│  2487条职工按需追加    │
└──────────────────────┘
```

| 存储方式 | 可见范围 | 持久性 | 使用场景 |
|---------|---------|--------|---------|
| `localStorage` | 当前浏览器 origin | ❌ 清缓存即丢失 | 本地编辑预览（需同源） |
| `js/data-core.js` | **所有访客** (~50KB) | ✅ 永久 | 13个板块核心数据 |
| `js/data-staff.js` | **仅职工页访客** (~580KB) | ✅ 永久 | 职工名录按需加载 |

---

## 🗂️ 项目结构

```
hospital-museum/
├── index.html                  # 🏠 网站首页（Hero + 板块导航 + 页脚）
├── pages/                      # 📄 13 个内容板块
│   ├── 01-history.html         #   历史沿革
│   ├── 02-people.html          #   人物风采（专家群像馆 + 医学人才 + 榜样）
│   ├── 03-disciplines.html     #   学科建设
│   ├── 04-campus.html          #   院区风貌
│   ├── 05-education.html       #   医学教育
│   ├── 06-culture.html         #   文化建设
│   ├── 07-tech.html            #   医疗技术
│   ├── 08-duty.html            #   社会责任
│   ├── 09-honors.html          #   医院荣誉
│   ├── 10-vision.html          #   发展愿景
│   ├── 11-structure.html       #   组织架构
│   ├── 12-leadership.html      #   历任院领导
│   └── 13-staff.html           #   职工名录
├── js/
│   ├── main.js                 # 🔧 前台渲染引擎（动态生成页面内容）
│   ├── data-core.js            # 📊 核心数据（13板块+设置, ~50KB，所有页面加载）
│   └── data-staff.js           # 👷 职工名录数据（2487条, ~580KB，仅13-staff加载）
├── admin/
│   ├── index.html              # 🖥️ 管理后台界面（基于 AdminLTE 3）
│   └── js/
│       ├── admin.js            #   后台 CMS 核心逻辑（约 3000 行）
│       └── adminlte.min.js     #   AdminLTE 框架
├── css/
│   └── bundle.css              # 全局样式合并（style+sections+visuals, 69KB, 1次请求）
├── modules/                    # 🧩 可复用 HTML 模块
│   ├── culture.html            #   文化建设子模块
│   ├── culture-detail.html     #   文化详情
│   ├── departments.html        #   科室介绍
│   ├── education.html          #   教育子模块
│   ├── future.html             #   未来展望
│   ├── history.html            #   历史子模块
│   ├── innovation.html         #   创新子模块
│   └── people.html             #   人物子模块
├── assets/
│   ├── images/                 # 🖼️ 图片资源（院徽、照片等）
│   └── svg/                    # SVG 图标
├── .github/workflows/
│   └── pages.yml               # ⚙️ GitHub Pages 自动部署配置
└── README.md
```

---

## 🛠️ 技术栈

| 类别 | 技术 |
|------|------|
| 前端框架 | 原生 HTML/CSS/JS（无框架依赖） |
| UI 库（后台） | AdminLTE 3 + Bootstrap 4 |
| 富文本 | 原生 `<textarea>` + HTML |
| 数据存储 | localStorage + 静态 JSON（`data.js`） |
| 图标 | Font Awesome 5 |
| 字体 | Noto Sans/Serif TC（思源字体） |
| 部署 | GitHub Pages + Actions |
| 本地服务 | Python `http.server` |

---

## 📋 管理后台功能

| 功能模块 | 说明 |
|---------|------|
| 🏠 **首页编辑** | Hero 轮播图、板块导航卡片、Footer 信息 |
| 📜 **13 个内容板块** | 每个板块独立编辑标题、正文、配图 |
| 👥 **人物风采** | 专家群像、医学人才、榜样员工、学科数据卡片、党建力量 |
| 👨‍⚕️ **历任院领导** | 照片、姓名、职务、任期、简介 |
| 👷 **职工名录** | CSV/文本批量导入、编码自动检测、分页、批量操作 |
| 📤 **数据导出** | 一键导出 `data-core.js` + `data-staff.js`，下载即可部署 |
| 📥 **数据导入** | 从 `data-core.js` 文件恢复数据 |

---

## 🌐 浏览器兼容性

- Chrome / Edge 90+
- Firefox 90+
- Safari 15+

---

## 📞 关于医院

**大理大学第一附属医院（云南省第四人民医院）**

- 等级：三级甲等综合医院
- 定位：立足大理、辐射滇西
- 官网：[https://www.dfy.dali.edu.cn](https://www.dfy.dali.edu.cn)

---

## 📄 许可证

本项目为大理大学第一附属医院内部项目，保留所有权利。
