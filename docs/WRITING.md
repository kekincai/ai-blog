# 写作指南

怎么写一篇文章、能用哪些语法、页面上会出现哪些效果。

> 想直接看渲染效果：运行 `npm run dev`，打开 <http://localhost:3000/posts/markdown-showcase>。
> 那篇文章（[`content/posts/markdown-showcase.md`](../content/posts/markdown-showcase.md)）把下面每种语法都用了一遍，是草稿，不会出现在正式站点。

## 目录

- [写一篇新文章](#写一篇新文章)
- [Frontmatter 字段](#frontmatter-字段)
- [草稿与预览](#草稿与预览)
- [Markdown 语法](#markdown-语法)
- [直接写 HTML](#直接写-html)
- [页面上的自动效果](#页面上的自动效果)
- [发布](#发布)
- [常见报错](#常见报错)

## 写一篇新文章

1. 复制模板 [`content/posts/_template.md`](../content/posts/_template.md)，放到 `content/posts/` 下并改名。
2. **文件名就是网址**：`content/posts/rag-notes.md` → `/posts/rag-notes`。建议用小写英文和短横线；中文文件名也能用，但网址会被编码成一长串 `%E4%...`。
3. 以 `_` 开头的文件不会被发布（比如模板本身），可以用来放草稿素材。
4. 改好 frontmatter，写正文，`npm run dev` 实时预览。

## Frontmatter 字段

文件开头两行 `---` 之间的部分：

```yaml
---
title: 从零手写注意力机制        # 必填
date: 2026-09-18               # 必填，YYYY-MM-DD
category: learn                # learn 学习 / insight 认识 / feel 体会，默认 learn
excerpt: 一句话摘要              # 列表、文章开头、分享卡片、RSS 都会用
tags: [Transformer, PyTorch]
featured: true                 # 放到首页「精选」；多篇都有时取最新的一篇
draft: true                    # 草稿，见下一节
notes:                         # 正文右侧的边注，屏幕够宽（>1200px）时显示
  - 第一条边注
  - 第二条边注
feel: 文末「体会」框里的一段话
---
```

| 字段 | 必填 | 说明 |
| --- | :---: | --- |
| `title` | ✓ | 标题。全角冒号 `：` 前面的部分会用作面包屑和深色横幅里的短标题 |
| `date` | ✓ | 发布日期。决定排序和文章编号 `No.001` |
| `category` | | 分类，决定出现在哪个分类页、用哪种颜色 |
| `excerpt` | | 摘要 |
| `tags` | | 标签，显示为 `#标签`，点击进入标签页 `/tags/标签名` |
| `featured` | | 首页精选。没有任何文章设置时，精选取最新一篇 |
| `draft` | | 草稿 |
| `notes` | | 边注列表 |
| `feel` | | 文末体会框 |

## 草稿与预览

`draft: true` 的文章：

| 环境 | 是否显示 |
| --- | --- |
| 本地 `npm run dev` | 显示，带 `DRAFT` 标记 |
| Vercel 预览部署（非 `main` 分支 / PR） | 显示，带 `DRAFT` 标记 |
| 正式站点（`main` 分支） | 不显示，也不进 RSS、sitemap |

想让别人先看看草稿：新建一个分支推上去，Vercel 会给这个分支生成一个预览链接（只有登录了你 Vercel 账号的人能打开）。写完删掉 `draft` 这一行，合并到 `main` 就正式发布了。

## Markdown 语法

### 标题

```md
## 二级标题
### 三级标题
#### 四级标题
```

- `##` 会自动编号（01、02……）并出现在左侧目次里，**一篇文章的大段落请用 `##`**。
- 不要在正文里写 `#` 一级标题，页面顶部的大标题来自 frontmatter 的 `title`。

### 文字

```md
**加粗**  *斜体*  ~~删除线~~  `行内代码`
[站内链接](/archive)  [站外链接](https://example.com)
直接写网址也会变成链接：https://example.com
```

站外链接（`http` 开头）会自动在新标签页打开。

### 列表与任务清单

```md
- 无序列表
  - 缩进两个空格变成子项
1. 有序列表
- [x] 已完成
- [ ] 未完成
```

### 引用（金句）

```md
> 能跑的代码不一定是对的代码。
```

普通引用块会显示成**大号衬线字体的金句**，前面带一个红色「，适合放一句话，不适合放长段落。长段落请用下面的提示框。

### 提示框

在引用块第一行写 `[!类型]`：

```md
> [!NOTE]
> 补充说明。

> [!TIP] 可以自定义标题
> 类型后面的文字会替换默认标题。
```

| 类型 | 默认标题 | 颜色 | 用途 |
| --- | --- | --- | --- |
| `[!NOTE]` | 注 · NOTE | 青 | 背景知识、补充说明 |
| `[!TIP]` | 技巧 · TIP | 绿 | 小技巧、推荐做法 |
| `[!IMPORTANT]` | 重要 · IMPORTANT | 紫 | 一定要知道的信息 |
| `[!WARNING]` | 注意 · WARNING | 橙 | 容易踩的坑 |
| `[!CAUTION]` | 警告 · CAUTION | 红 | 可能造成严重后果 |
| `[!FEEL]` | 体会 · FEEL | 墨 | 这个博客特有的体会框，可以放在正文任意位置 |

写法和 GitHub 一致，所以在 GitHub 上看源文件时也能正常显示（`[!FEEL]` 除外）。

### 代码块

````md
```python title="attention.py" showLineNumbers {4} /scores/
def attention(q, k, v):
    ...
```
````

写在语言名后面的选项，可以任意组合：

| 写法 | 效果 |
| --- | --- |
| `python` / `ts` / `bash` … | 语法高亮（主题 vitesse-black） |
| `title="文件名"` | 代码块顶部显示文件名 |
| `showLineNumbers` | 显示行号 |
| `{2}` / `{1,3-5}` | 高亮指定行（红色左边线） |
| `/scores/` | 高亮代码里所有 `scores` 这个词（青色底） |

行内代码也能高亮：在反引号里的代码后面加 `{:语言}`，例如 `` `attention(q, k, v){:python}` ``。

### 数学公式（KaTeX）

```md
行内公式：缩放因子是 $\frac{1}{\sqrt{d_k}}$。

$$
\mathrm{Attention}(Q, K, V) = \mathrm{softmax}\left(\frac{QK^\top}{\sqrt{d_k}}\right)V
$$
```

- 行内用一个 `$`，独立公式用两个 `$$` 并各占一行。
- 正文里要写美元符号本身，请写成 `\$`，否则两个 `$` 之间的内容会被当成公式。
- 支持的写法见 [KaTeX 文档](https://katex.org/docs/supported.html)。

### 表格

```md
| 方法 | 复杂度 | 备注 |
| --- | :---: | ---: |
| 标准注意力 | $O(n^2)$ | 精确 |
```

`:---:` 居中，`---:` 右对齐。表格里可以用公式、代码、链接。表格太宽时手机上可以横向滑动。

### 图片

图片放在 `public/posts/<文章文件名>/` 里，用绝对路径引用：

```md
![图片说明](/posts/attention-from-scratch/qkv.png)

![图片说明](/posts/attention-from-scratch/qkv.png "图注写在引号里")
```

- 引号里的文字会显示成图片下方的图注（图片需要单独占一段）。
- 图片会按原尺寸显示，最宽不超过正文宽度；尽量先压缩一下（推荐宽度 1600px 以内）。
- 图片会自动懒加载，并自动写上宽高，加载时页面不会跳动。

### 脚注

```md
这句话需要解释[^1]，这句也是[^why]。

[^1]: 脚注内容，会统一显示在文章末尾。
[^why]: 名字可以是数字，也可以是单词。
```

### 分隔线

```md
---
```

## 直接写 HTML

Markdown 没有的效果，可以直接写 HTML：

```html
<details>
<summary>点开看推导过程</summary>

折叠块里面也能继续写 **Markdown**，前后各空一行。

</details>

按 <kbd>⌘</kbd> + <kbd>K</kbd>，d<sub>k</sub>，x<sup>2</sup>

<iframe src="https://player.bilibili.com/player.html?bvid=BV..." allowfullscreen></iframe>

<video src="/posts/文章文件名/demo.mp4" controls></video>
```

| 标签 | 效果 |
| --- | --- |
| `<details>` + `<summary>` | 折叠块，点标题展开 |
| `<kbd>` | 键盘按键样式 |
| `<sub>` / `<sup>` | 下标 / 上标 |
| `<iframe>` | 嵌入视频（B 站、YouTube 的「嵌入代码」），自动铺满正文宽度、16:9 |
| `<video>` | 本地视频，文件放在 `public/posts/文章文件名/` |

HTML 不会被过滤（文章只有你自己写），所以不要粘贴来路不明的代码。

## 页面上的自动效果

这些不需要写任何东西，发布后自动出现：

| 效果 | 说明 |
| --- | --- |
| 章节编号 + 目次 | 每个 `##` 自动编号，左侧目次随滚动高亮当前章节（屏幕宽于 900px 时显示） |
| 阅读进度 | 文章页顶栏右侧显示 `READING xx%`（屏幕宽于 900px 时显示） |
| 阅读时长 | 按中文 400 字/分钟、英文 220 词/分钟估算 |
| 文章编号 | 按日期先后自动编号 `No.001`、`No.002`… |
| 分类颜色 | 学习（红）、认识（青）、体会（紫） |
| 上一篇 / 下一篇 | 文章末尾，按日期 |
| 分享卡片 | 分享到社交平台时自动生成带标题的卡片图 |
| 标签页 | 每个标签自动生成 `/tags/标签名`，全部标签在 `/tags` |
| 站内搜索 | `/search` 按标题、摘要、标签、正文搜索，多个词用空格分开 |
| RSS | `/feed.xml` 输出全文，阅读器里可以直接读完整篇 |
| sitemap / 结构化数据 | `/sitemap.xml` 和文章页的 JSON-LD 自动更新，帮助搜索引擎收录 |

首页的「学习日志」终端、三个分类的介绍文字在 [`config/site.ts`](../config/site.ts) 里改，不在文章里。

## 发布

```bash
git add content/posts/新文章.md public/posts/新文章/
git commit -m "新文章：标题"
git push
```

推到 `main` 后：GitHub Actions 会跑一遍类型检查、构建和死链检查（约 1 分钟），Vercel 同时开始部署，1～2 分钟后正式站点更新。

### 关于字体

为了让页面加载快，中文字体只打包网站实际用到的字（`scripts/subset-fonts.mjs`，在 `npm run dev` 和 `npm run build` 前自动运行）。

- 本地写作时，**新文章里第一次出现的字会暂时用系统字体显示**，看起来略有不同，这是正常的。重新运行 `npm run dev`（或 `npm run fonts`）就会补上。
- 线上构建每次都会重新收集，所以正式站点总是完整的。

## 常见报错

构建时会检查文章格式，出错会直接指出是哪个文件：

| 报错 | 原因 |
| --- | --- |
| `date 要写成 YYYY-MM-DD` | 日期格式不对，比如写成了 `2026/9/18` |
| `缺少 title` | frontmatter 里没有 `title` |
| `category "xxx" 无效` | 分类只能是 `learn` / `insight` / `feel` |
| 页面显示 404 | 文章是草稿（`draft: true`），正式站点不显示 |
| `[links] 发现 N 个死链` | 某个站内链接指向的文章 / 图片 / 锚点不存在，按提示修改链接 |
| 公式没有渲染 | 独立公式的 `$$` 要单独占一行，上下各空一行 |
