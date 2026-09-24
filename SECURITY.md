# 安全说明

## 报告安全问题

请通过仓库的 **Security → Report a vulnerability** 私密提交，不要在公开 Issue 里贴漏洞细节。

## 信任模型

这是一个单人维护的静态博客，没有登录、数据库、上传或任何写入接口。

| 边界 | 约定 |
| --- | --- |
| 文章内容 | `content/posts/` 只有站长通过 `main` 分支发布。Markdown 里允许原始 HTML（`lib/content/markdown.ts`），**不做过滤**，因此文章作者被视为可信。任何让外部内容进入这个目录的改动（CMS、投稿、自动导入）都必须先加上 HTML 过滤。 |
| 草稿 | `draft: true` 的文章会出现在本地和 Vercel 预览部署里，正式站点不包含。预览部署的保密依赖 Vercel 部署保护（预览地址需要登录 Vercel 账号），而不是应用代码。 |
| 站点地址 | 只来自部署环境变量 `SITE_URL` / `VERCEL_PROJECT_PRODUCTION_URL`，构建时校验必须是 http(s) 纯域名（`config/site.ts`），不接受任何请求输入。 |
| CI | GitHub Actions 只有只读权限，不持久化 git 凭据，不含部署步骤和密钥；Actions 固定到 commit SHA。`main` 受分支保护，必须通过 CI 才能合并。 |
| 外部服务 | 构建时向 Google Fonts 发送站点用到的字（字体子集化）和分享卡片标题；访客邮箱只在配置了 Buttondown 时由浏览器直接提交给 Buttondown；访问统计由 Vercel Analytics 处理。 |
