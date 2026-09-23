# ai-blog · PAUL.LOG

个人 AI 学习博客 —— 日式余白 × 赛博朋克。Next.js 16（App Router）+ Markdown。

## 本地运行

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # 生产构建
```

## 写文章

在 `content/posts/` 新建一个 `.md` 文件，文件名就是 URL（`/posts/文件名`）：

```md
---
title: 文章标题
date: 2026-09-24
category: learn        # learn 学习 / insight 认识 / feel 体会
excerpt: 一句话摘要（首页和文章页开头会显示）
tags: [Transformer, 笔记]
featured: true         # 可选：放到首页「精选」
notes:                 # 可选：文章右侧的边注
  - 边注一
feel: 可选：文末「体会」框里的一段话
---

## 第一个小标题（自动编号，并出现在左侧目次）

正文……

```python title="文件名.py"
print("代码块会自动高亮")
```
```

目前 `content/posts/` 里除「从零手写注意力机制」外，其余都是**示例占位文章**，可以直接删除或替换。

## 常改的地方

| 想改什么 | 文件 |
| --- | --- |
| 博客名、简介、自我介绍 | `lib/site.ts` → `site` |
| 三个分类的文字 | `lib/site.ts` → `categories` |
| 首页「学习日志」终端内容 | `lib/site.ts` → `nowLearning` |
| 颜色 / 字体 / 霓虹主色 | `app/globals.css` 顶部 `:root`（改 `--accent`） |
| 首页各区块 | `app/page.tsx` |
| 关于页 | `app/about/page.tsx` |

## 部署

已接入 Vercel：推送到 GitHub `main` 分支会自动部署生产环境，其他分支 / PR 会生成预览链接。

站点地址（RSS、sitemap、分享链接会用到）默认取 Vercel 的生产域名；绑定自定义域名后，在 Vercel 项目的环境变量里设置 `SITE_URL=https://你的域名` 即可。

访问统计用 Vercel Web Analytics（`app/layout.tsx` 里的 `<Analytics />`），在 Vercel 项目的 Analytics 页查看。

GitHub Actions（`.github/workflows/ci.yml`）会在每次推送和 PR 时跑类型检查 + 构建，文章 frontmatter 写错会在这里提前暴露；Dependabot 每周提依赖升级 PR。

字体通过 `next/font` 在构建时下载并自托管，访问时不依赖 Google Fonts。

订阅框目前只是前端演示，要真正收邮件可接入 Buttondown / Resend 等服务（改 `components/Subscribe.tsx`）。
