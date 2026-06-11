# 云端院史馆 · 大理大学第一附属医院

> 基于纯静态网页的医院数字院史展馆，支持后台 CMS 编辑，数据固化部署到 GitHub Pages。

---

## 🚀 快速部署（GitHub Pages）

### 第一次部署

1. **Fork 或 Push 到 GitHub**

```bash
git remote add origin https://github.com/<你的用户名>/hospital-museum.git
git push -u origin main
```

2. **开启 GitHub Pages**
   - 打开仓库 → Settings → Pages
   - Source 选择 **GitHub Actions**
   - 保存后等待约 1 分钟，自动部署完成

3. **访问网站**
   - 地址：`https://<你的用户名>.github.io/hospital-museum/`

---

## ✏️ 更新内容流程

### ⚠️ 关键：本地编辑必须用 HTTP 服务器

**Chrome 的 `file://` 协议下，不同目录的页面 localStorage 相互隔离！**  
管理后台 (`admin/`) 和前台页面 (`pages/`) 的 localStorage 不共享，导致数据不同步。

**正确做法：始终通过本地服务器访问**

```bash
# 在项目根目录启动
cd E:\my-web\hospital-museum
python serve.py
```

然后通过以下地址访问（共享同一份 localStorage）：

| 页面 | 地址 |
|------|------|
| 🖥️ 管理后台 | `http://localhost:8000/admin/` |
| 🏠 前台首页 | `http://localhost:8000/` |
| 👥 职工名录 | `http://localhost:8000/pages/13-staff.html` |
| 🔍 数据诊断 | `http://localhost:8000/diagnostic.html` |

### 日常内容更新（推荐）

```
① 启动本地服务器   → python serve.py
② 打开管理后台     → http://localhost:8000/admin/
③ 编辑各板块内容   → 点「保存」
④ 导出数据         → 顶部导航「导出数据」按钮 → 下载 data.js
⑤ 替换文件         → 将下载的 data.js 覆盖 js/data.js
⑥ 提交并 push      → git add js/data.js && git commit -m "update: 更新内容" && git push
⑦ 等待自动部署    → GitHub Actions 约 1 分钟完成
```

### 一键命令（Windows）

```cmd
cd C:\path\to\hospital-museum
git add js/data.js
git commit -m "update: 更新展馆内容 %date%"
git push
```

---

## 📦 数据持久化说明

| 存储方式 | 可见范围 | 是否持久 | 使用场景 |
|---------|---------|---------|---------|
| `localStorage` | 当前浏览器/当前 origin | ❌ 清缓存即丢失 | 本地编辑预览（需同源） |
| `js/data.js`（导出部署） | **所有访客** | ✅ 永久保存在代码中 | 正式部署 |

**工作原理：**
- 前台 `main.js` **优先级 localStorage > data.js**：
  1. 若 `localStorage.hm_content` 有数据 → 优先使用（管理后台编辑即时反映）
  2. 否则使用 `js/data.js` 中的 `window.HM_DATA`
- 管理后台的「保存」按钮写入 `localStorage.hm_content`
- 「导出数据」按钮将 localStorage 数据固化为 `data.js` 文件

**⚠️ 重要**：管理后台和前台必须在同一 origin（同域名同端口）下访问，否则 localStorage 不共享。使用 `python serve.py` 启动本地服务器即可保证同源。

---

## 🗂️ 目录结构

```
hospital-museum/
├── index.html              # 网站首页
├── pages/
│   ├── 01-history.html     # 历史沿革
│   ├── 02-people.html      # 人物风采
│   └── ... (共12个板块)
├── js/
│   ├── main.js             # 前台渲染引擎
│   └── data.js             # ← 持久化数据（由后台导出生成）
├── admin/
│   ├── index.html          # 后台管理界面
│   └── js/admin.js         # 后台 CMS 逻辑
└── .github/
    └── workflows/
        └── pages.yml       # GitHub Pages 自动部署配置
```

---

## 🛠️ 本地预览

### 方式一：本地 HTTP 服务器（推荐）
```bash
cd E:\my-web\hospital-museum
python serve.py
# 访问 http://localhost:8000
```
管理后台和前台共享 localStorage，编辑即时生效。

### 方式二：直接打开文件（仅浏览）
双击 `index.html` 在浏览器打开。  
⚠️ 此方式下管理后台的编辑不会同步到前台（localStorage 隔离），仅适合快速浏览。

---

## 📞 技术支持

- 大理大学第一附属医院档案室
- 官网：https://www.dfy.dali.edu.cn
