# 工程管家 官网

工程管家是面向建筑工程企业的桌面端管理软件。**本仓库是工程管家的官方宣传网站**。

## 特性

- ⚡ **React 19 + Vite 8 + TypeScript 5** - 极速构建
- 🎨 **三主题适配** - 皓白 / 石墨 / 砂岩，CSS 变量驱动
- ✍️ **Canvas 水墨擦除动画** - 鼠标擦开遮罩露出底部画作
- 🤖 **AI 智能识别** - 9 种 OCR 场景支持
- 📦 **12 大功能模块** - 人事 / 工人 / 发票 / 合同 / 项目 / 仓库 / 成本 / 单位 / 模板 / 结算 / AI 数据守护 / AI 助手
- 🔍 **百度 OCR** - 增值税发票 / 身份证 / 银行卡 / 营业执照 / 银行回单等
- 💼 **企业级** - 多用户 / 多角色 / 权限管理

## 技术栈

- React 19
- Vite 8
- TypeScript 5
- TailwindCSS（按需）
- framer-motion 12
- lucide-react
- 思源宋体 + 思源黑体（Noto Serif/Sans SC，Google Fonts CDN，SIL OFL 协议免费商用）
- React Bits 组件（Magnet、BlurText、ShinyText）

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器（http://localhost:5173）
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 部署

### Gitee Pages（推荐，国内访问快）

```bash
# 1. 在 gitee.com 创建公开仓库 engineering-manager-website

# 2. 推送代码
git init
git add .
git commit -m "init: 工程管家官网"
git branch -M master
git remote add origin https://gitee.com/Amer-CN/engineering-manager-website.git
git push -u origin master

# 3. 仓库页面 → 服务 → Gitee Pages → 启动
```

### GitHub Pages

```bash
npm run build
# 部署 dist/ 目录到 gh-pages 分支
```

## 项目结构

```
工程管家官网/
├── public/                # 静态资源（favicon、画作背景图）
├── src/
│   ├── components/        # 页面组件
│   │   ├── Hero.tsx       # 首页（Canvas 水墨擦除动画）
│   │   ├── Features.tsx   # 12 个功能模块
│   │   ├── Gallery.tsx    # 截图灯箱
│   │   ├── Download.tsx   # 下载页（GitHub + 网盘）
│   │   ├── Footer.tsx     # 页脚
│   │   ├── Navbar.tsx     # 导航栏
│   │   ├── Logo.tsx       # Logo 组件（CSS 变量驱动三主题）
│   │   └── reactbits/     # React Bits 组件
│   ├── contexts/          # React Context
│   ├── hooks/             # 自定义 Hooks
│   ├── App.tsx            # 应用入口
│   └── index.css          # 三主题 CSS 变量系统
├── index.html             # HTML 模板（含 Google Fonts 链接）
├── vite.config.ts
└── package.json
```

## 文档

- [DESIGN.md](DESIGN.md) - 设计规范（三主题、字体、间距、组件）
- [PROMPTS.md](PROMPTS.md) - Hero 背景生图提示词（白/黑/砂三主题）
- [LICENSE.md](LICENSE.md) - 第三方依赖协议说明
- [DEPLOY.md](DEPLOY.md) - 部署指南

## 版权

- 代码：MIT License
- 字体：SIL OFL 协议（思源宋体 + 思源黑体）
- Hero 背景图：用户自生成
- 第三方组件：见 [LICENSE.md](LICENSE.md)

## 联系

- 邮箱：cd.hyxc.jz@foxmail.com
- GitHub：https://github.com/Amer-CN/engineering-manager
