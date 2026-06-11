# 云端院史馆 · 大理大学第一附属医院

> 基于 Hugo 静态站点生成器的云端院史馆，支持 CMS 后台管理 + 本地构建 + 云部署。

## 项目架构

```
hospital-museum/hugo/
├── config.toml              # Hugo 站点配置
├── data/
│   └── museum.json           # 核心数据（所有13个板块的内容）
├── content/                   # Hugo 内容文件（14页）
│   ├── _index.md             # 首页
│   ├── history.md            # 历史沿革
│   ├── people.md             # 人物风采
│   ├── disciplines.md        # 学科建设
│   ├── campus.md             # 院区建设
│   ├── education.md          # 教学人才
│   ├── culture.md            # 文化建设
│   ├── tech.md               # 科技交流
│   ├── duty.md               # 责任担当
│   ├── honors.md             # 荣誉殿堂
│   ├── vision.md             # 展望未来
│   ├── structure.md          # 组织架构
│   ├── leadership.md         # 领导团队
│   └── staff.md              # 职工名录
├── layouts/                   # Hugo 模板
│   ├── _default/
│   │   ├── baseof.html       # 基础模板
│   │   └── section.html      # 板块页模板
│   ├── partials/              # 组件模板
│   │   ├── head.html
│   │   ├── navbar.html
│   │   ├── footer.html
│   │   └── scripts.html
│   ├── shortcodes/
│   │   └── museum_section.html  # 板块渲染短代码
│   └── index.html            # 首页模板
├── static/                    # 静态资源
│   ├── css/                  # 样式文件
│   │   ├── style.css
│   │   ├── sections.css
│   │   └── visuals.css
│   ├── js/
│   │   └── main.js           # 前端交互
│   └── assets/images/        # 图片资源
├── admin/                    # CMS 后台
│   ├── index.html
│   ├── js/admin.js
│   └── css/admin-custom.css
├── public/                   # 构建输出（部署此目录）
├── build.py                  # 构建脚本（优先级：Hugo > Python）
├── serve.py                  # 本地开发服务器
└── README.md
```

## 快速开始

### 方式一：Python 构建（无需安装 Hugo）

```bash
# 构建站点
python build.py

# 启动本地服务器
python serve.py
```

### 方式二：Hugo 构建（推荐生产环境）

```bash
# 安装 Hugo Extended（需网络）
# https://gohugo.io/installation/

# 构建站点
hugo --minify --cleanDestinationDir

# 开发模式（热重载）
hugo server -D --port 8080
```

## 13 大板块说明

| 编号 | 板块名称 | 页面 | 内容类型 |
|------|---------|------|---------|
| 01 | 历史沿革 | history | 时间线 · 历史块 · 画廊 |
| 02 | 人物风采 | people | 人物卡片 · 数据卡片 · 画廊 |
| 03 | 学科建设 | disciplines | 内容块 · 学科带头 · 画廊 |
| 04 | 院区建设 | campus | 内容块 · 数据卡片 · 画廊 |
| 05 | 教学人才 | education | 内容块 · 教师档案 · 数据卡 |
| 06 | 文化建设 | culture | 文化展示 · 数据卡片 · 画廊 |
| 07 | 科技交流 | tech | 科研成果 · 数据卡片 · 画廊 |
| 08 | 责任担当 | duty | 抗疫帮扶 · 数据卡片 · 画廊 |
| 09 | 荣誉殿堂 | honors | 荣誉展示 · 数据卡片 · 画廊 |
| 10 | 展望未来 | vision | 战略目标 · 时间线 · 画廊 |
| 11 | 组织架构 | structure | 架构展示 · 画廊 |
| 12 | 领导团队 | leadership | 领导班子 · 个人简介 |
| 13 | 职工名录 | staff | 职工档案 · 数据卡片 · 画廊 |

## CMS 后台管理

后端管理面板位于 `/admin/` 路径：

- **访问地址**：`http://localhost:8080/admin/`
- **功能**：可视化编辑所有 14 个页面的内容
- **数据流**：编辑 → localStorage → 导出 data.js → 更新 museum.json → 重新构建

## 数据流架构

```
admin/index.html (CMS 编辑)
    ↓ 保存
localStorage (临时存储)
    ↓ 导出
data.js (JS 格式)
    ↓ 转换
data/museum.json (Hugo 数据源)
    ↓ 构建
Hugo / build.py
    ↓ 输出
public/ (部署就绪)
```

## 部署选项

1. **CloudStudio** — 使用内置 CloudStudio Deploy 一键部署
2. **GitHub Pages** — push `public/` 到 gh-pages 分支
3. **Nginx / Apache** — 直接将 `public/` 目录内容作为站点根目录
4. **CDN** — 上传 `public/` 到任何静态资源托管

## 内容更新流程

1. 打开 CMS 后台 `/admin/`
2. 选择板块 → 编辑内容 → 保存
3. 导出为 data.js
4. 运行 `python build.py` 重新构建
5. 部署 `public/` 目录

## 技术栈

- 前端：原生 HTML/CSS/JS（Google Fonts: Noto Sans/Serif TC）
- CMS：AdminLTE 3 + 客户端 localStorage
- 构建：Hugo Extended / Python 3.6+
- 数据格式：JSON（data/museum.json）
- 主题：暗色 / 亮色可切换
