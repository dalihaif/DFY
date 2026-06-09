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

### 日常内容更新（推荐）

```
① 打开后台管理     → hospital-museum/admin/index.html
② 编辑各板块内容   → 点「保存」
③ 导出数据         → 顶部导航「导出数据」按钮 → 下载 data.js
④ 替换文件         → 将下载的 data.js 覆盖 js/data.js
⑤ 提交并 push      → git add js/data.js && git commit -m "update: 更新内容" && git push
⑥ 等待自动部署    → GitHub Actions 约 1 分钟完成
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

| 存储方式 | 可见范围 | 是否持久 |
|---------|---------|---------|
| `localStorage` | 仅当前浏览器/设备 | ❌ 清缓存即丢失 |
| `js/data.js`（本方案） | **所有访客** | ✅ 永久保存在代码中 |

**工作原理：**
- 前台 `main.js` 优先读取 `js/data.js` 中注入的 `window.HM_DATA`
- 若 `data.js` 为空，自动回退到 `localStorage`（适合本地预览时使用）

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

直接用浏览器打开 `index.html` 即可，无需服务器。

---

## 📞 技术支持

- 大理大学第一附属医院档案室
- 官网：https://www.dfy.dali.edu.cn
