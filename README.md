<div align="center">

<img src="docs/heron.svg" width="720" alt="樱花树下，苍鹭骑着自行车" />

# PAUL.LOG · AI 学习笔记

一个人的 AI 学习现场：**学习**、**认识**与**体会**。

日式余白 × 赛博朋克风格的个人博客，用 Markdown 写作，Next.js 静态生成，部署在 Vercel。

[![CI](https://github.com/kekincai/ai-blog/actions/workflows/ci.yml/badge.svg)](https://github.com/kekincai/ai-blog/actions/workflows/ci.yml)
![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-7-3178c6?logo=typescript&logoColor=white)

</div>

## 特点

- **Markdown 写作**：一篇文章一个 `.md` 文件，推送即发布。支持代码高亮（行号、行高亮）、KaTeX 数学公式、提示框、脚注、表格、任务清单、带图注的图片。→ [写作指南](docs/WRITING.md)
- **三个维度**：文章分为学习 / 认识 / 体会三类，各有分类页和配色。
- **首页页头动画**：樱花树下苍鹭骑自行车（移植自原网页：腿按骨长实时反解，花瓣飘落），尊重系统的「减弱动态效果」。
- **阅读体验**：章节自动编号、滚动高亮的目次、阅读进度、边注、文末体会框、上一篇 / 下一篇。
- **标签与搜索**：每个标签有自己的页面；站内搜索在浏览器里完成，不需要后端。
- **草稿与预览**：`draft: true` 的文章只在本地和 Vercel 预览部署里出现。
- **加载快、国内可访问**：中文字体只打包用到的字（约 450KB，完整切片约 2MB），自托管，不依赖 Google Fonts。
- **开箱即用**：全文 RSS、sitemap、robots、结构化数据（JSON-LD）、分享卡片图（按文章标题自动生成）、Vercel Analytics。
- **构建期校验**：frontmatter 写错（日期格式、分类、缺标题）时构建失败并指出是哪个文件；构建后自动检查站内死链。

## 快速开始

需要 Node.js 24+。

```bash
npm install
npm run dev      # http://localhost:3000
```

| 命令 | 作用 |
| --- | --- |
| `npm run dev` | 本地开发，改文章实时刷新 |
| `npm run build` | 生产构建（和线上一致，草稿不会出现） |
| `npm run lint` | TypeScript 类型检查 |
| `npm run check-links` | 死链检查（先 build） |
| `npm run fonts` | 重新生成中文字体子集（dev / build 前会自动运行） |
| `npm run heron` | 从 `lib/heron/scene.ts` 重新导出网站图标和 README 插图 |

## 写文章

```bash
cp content/posts/_template.md content/posts/my-first-post.md
```

改好 frontmatter 和正文，推送到 `main` 就会自动发布。详细语法、所有效果和常见报错见 **[docs/WRITING.md](docs/WRITING.md)**。

本地运行后打开 `/posts/markdown-showcase` 可以看到所有效果的实际渲染。

> `content/posts/` 里除「从零手写注意力机制」外，其余几篇都是示例占位文章，可以直接删除或替换。

## 目录结构

```
├── app/                    路由（Next.js App Router）
│   ├── page.tsx            首页
│   ├── posts/[slug]/       文章页 + 文章分享卡片图
│   ├── category/[cat]/     分类页
│   ├── archive/ about/     归档、关于
│   ├── tags/               标签索引、单个标签页
│   ├── search/ search.json/ 站内搜索页、搜索索引
│   ├── feed.xml/           RSS
│   ├── sitemap.ts robots.ts
│   ├── icon.svg            网站图标
│   └── opengraph-image.tsx 全站分享卡片图
├── components/
│   ├── layout/             页头、页脚、订阅框
│   ├── sakura/             首页页头的苍鹭骑车动画
│   ├── home/               首页各区块（Hero、三个维度、精选、最近、学习日志、引语）
│   ├── post/               文章页各部分（头部、横幅、目次、边注、体会框、翻页）
│   ├── posts/              文章列表
│   ├── search/             搜索框
│   └── ui/                 通用小组件（页头、结构化数据等）
├── config/site.ts          站点配置：名称、简介、链接、分类、学习日志
├── content/posts/          文章（Markdown）
├── docs/WRITING.md         写作指南
├── lib/
│   ├── content/            文章读取、Markdown 渲染管线、自定义语法插件
│   ├── heron/              苍鹭骑车场景（SVG 与动画，动画、图标、分享卡片共用）
│   └── og.tsx              分享卡片与图标的绘制
├── public/posts/<slug>/    文章配图
├── scripts/                字体子集化、死链检查、导出苍鹭图标
└── styles/                 样式，按区域拆分，入口是 index.css
```

## 常改的地方

| 想改什么 | 文件 |
| --- | --- |
| 博客名、简介、GitHub 链接 | [`config/site.ts`](config/site.ts) → `site` |
| 三个分类的文字 | [`config/site.ts`](config/site.ts) → `categories` |
| 首页「学习日志」终端内容 | [`config/site.ts`](config/site.ts) → `nowLearning` |
| 颜色、字体 | [`styles/tokens.css`](styles/tokens.css)（改 `--accent` 换主色） |
| 首页某个区块 | [`components/home/`](components/home) |
| 关于页 | [`app/about/page.tsx`](app/about/page.tsx) |
| 首页页头动画、网站图标 | [`lib/heron/scene.ts`](lib/heron/scene.ts)，改完运行 `npm run heron` 重新导出 `app/icon.svg` |

## 部署

托管在 Vercel，已和本仓库关联：

- 推送到 `main` → 自动部署正式站点
- 其他分支 / PR → 生成预览链接，可以看到草稿

站点地址（RSS、sitemap、分享卡片会用到）默认使用 Vercel 的生产域名。绑定自定义域名后，在 Vercel 项目的环境变量里设置 `SITE_URL=https://你的域名`。

### 邮件订阅

页脚订阅框默认显示 RSS 地址（一键复制）。想让读者用邮箱订阅：

1. 在 [buttondown.com](https://buttondown.com) 注册（免费版 100 个订阅者），在设置里开启「RSS to email」，填入 `你的域名/feed.xml`；
2. 在 Vercel 项目的环境变量里添加 `BUTTONDOWN_USERNAME=你的用户名`，重新部署。

订阅框会自动变成邮箱输入框，发新文章时 Buttondown 会自动给订阅者发邮件。

## 自动化

- **CI**（[`.github/workflows/ci.yml`](.github/workflows/ci.yml)）：每次推送和 PR 都会跑类型检查、完整构建和死链检查；`main` 开启了分支保护，PR 需要 CI 通过才能合并。
- **Dependabot**：npm 依赖每周、GitHub Actions 每月检查更新并自动提 PR。
- **Vercel Analytics**：访问统计，在 Vercel 项目的 Analytics 页查看。

## 技术栈

[Next.js 16](https://nextjs.org)（App Router，全站静态生成）· React 19 · TypeScript · [unified](https://unifiedjs.com)（remark / rehype）· [Shiki](https://shiki.style)（代码高亮）· [KaTeX](https://katex.org) · Vercel

## 许可

- 代码：[MIT](LICENSE)
- 文章与配图（`content/`、`public/posts/`）：[CC BY-NC 4.0](content/LICENSE.md)，转载请署名并附原文链接，不得商用
