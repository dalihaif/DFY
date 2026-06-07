# 大理大学第一附属医院 · 云端院史馆

> 大理大学第一附属医院（云南省第四人民医院）官方数字院史展览网站

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)

---

## 项目简介

本项目为大理大学第一附属医院云端院史馆，采用纯静态 HTML / CSS / JavaScript 构建，无需后端服务，可直接部署于任意静态托管平台（GitHub Pages、Nginx、CDN 等）。

网站以沉浸式视觉风格呈现医院从 1991 年建院至今的发展历程，涵盖十二个主题板块，供全院职工、在校师生及社会各界了解医院文化与建设成就。

---

## 功能板块

| 序号 | 板块名称 | 路径 |
|------|----------|------|
| 01 | 历史沿革 | `pages/01-history.html` |
| 02 | 人物风采 | `pages/02-people.html` |
| 03 | 学科建设 | `pages/03-disciplines.html` |
| 04 | 院区建设 | `pages/04-campus.html` |
| 05 | 教学人才 | `pages/05-education.html` |
| 06 | 文化建设 | `pages/06-culture.html` |
| 07 | 科技交流 | `pages/07-tech.html` |
| 08 | 责任担当 | `pages/08-duty.html` |
| 09 | 荣誉殿堂 | `pages/09-honors.html` |
| 10 | 展望未来 | `pages/10-vision.html` |
| 11 | 组织架构 | `pages/11-structure.html` |
| 12 | 领导团队 | `pages/12-leadership.html` |

---

## 技术栈

- **前端**：纯原生 HTML5 + CSS3 + Vanilla JavaScript（无框架依赖）
- **字体**：Google Fonts（Noto Sans TC / Noto Serif TC）
- **图标与素材**：本地 SVG + 医院官方视觉资源
- **主题切换**：支持深色 / 浅色双主题，使用 `data-theme` 属性动态切换
- **响应式**：适配桌面、平板、移动端多尺寸设备

---

## 目录结构

```
DFY/
├── index.html          # 首页（含导航、公告、板块入口、统计栏）
├── pages/              # 十二个主题页面
│   ├── 01-history.html
│   ├── 02-people.html
│   └── ...
├── modules/            # 功能模块（文化详情、部门介绍等）
│   ├── culture.html
│   ├── departments.html
│   └── ...
├── css/
│   ├── style.css       # 全局样式与 CSS 变量
│   ├── sections.css    # 板块专属样式
│   └── visuals.css     # 动效与视觉增强
├── js/
│   └── main.js         # 全局脚本（主题切换、导航交互等）
├── assets/
│   ├── images/         # 医院图片资源
│   └── svg/            # 矢量图形资源
└── admin/              # 后台管理界面（AdminLTE）
```

---

## 快速预览

直接用浏览器打开 `index.html` 即可本地预览，无需任何构建步骤。

```bash
# 克隆仓库
git clone https://github.com/dalihaif/DFY.git
cd DFY

# 直接用浏览器打开（或启动一个简单的本地服务器）
# macOS / Linux
open index.html

# Windows
start index.html
```

---

## 医院简介

**大理大学第一附属医院**（云南省第四人民医院）建于 1991 年，坐落于云南省大理市，是云南省卫生健康委员会直属管理的三级甲等综合性医院，也是国家临床教学示范中心。医院一院两区运营，编制床位 1500 张，开放床位 2013 张，全院职工 1946 人，临床科室 41 个，集医疗、教学、科研、预防于一体，是滇西区域医疗高地的核心支撑力量。

- 🌐 官方网站：[www.dfy.dali.edu.cn](https://www.dfy.dali.edu.cn)
- 📍 地址：云南省大理市

---

## 开发者

| 信息 | 详情 |
|------|------|
| 作者 | 李海峰 |
| 单位 | 大理大学第一附属医院 党政办综合档案室 |
| 邮箱 | dalihaif@qq.com |
| GitHub | [@dalihaif](https://github.com/dalihaif) |

---

## License

[MIT](LICENSE) © 2026 李海峰 / 大理大学第一附属医院
