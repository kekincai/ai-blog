---
title: 写作效果一览：这个博客支持的所有 Markdown 语法
date: 2026-09-24
category: learn
excerpt: 每种效果的写法和渲染结果都在这里。写文章时对照着看。
tags: [写作指南]
draft: true   # 这篇是写作参考：只在本地和预览部署可见，不会出现在正式站点
notes:
  - 这是边注。frontmatter 里的 notes 会显示在正文右侧，屏幕够宽时才出现。
  - 边注可以有多条。
feel: 这是文末的「体会」框，来自 frontmatter 里的 feel 字段。
---

## 标题与段落

每个 `##` 二级标题都会自动编号（01、02……），并出现在左侧的目次里。`###` 和 `####` 用来分更细的层级，不进目次。

### 三级标题

#### 四级标题

普通段落直接写。**加粗**、*斜体*、~~删除线~~、`行内代码`、[站内链接](/archive)、[站外链接](https://github.com/kekincai/ai-blog)（站外链接会在新标签页打开）。

也可以直接贴网址，会自动变成链接：https://nextjs.org

## 列表

- 无序列表
- 第二项
  - 缩进两个空格变成子项

1. 有序列表
2. 第二项

任务清单：

- [x] 读完论文
- [ ] 复现实验

## 引用与提示框

普通引用块会显示成大号的「金句」样式，适合放一句话：

> 能跑的代码不一定是对的代码。

需要提示、警告时用提示框，在引用块第一行写 `[!类型]`：

> [!NOTE]
> 补充说明。适合放背景知识。

> [!TIP]
> 小技巧或推荐做法。

> [!IMPORTANT]
> 读者一定要知道的关键信息。

> [!WARNING]
> 容易踩的坑。

> [!CAUTION]
> 可能造成严重后果的操作。

> [!FEEL] 此刻的感受
> 类型后面可以跟一个自定义标题。`[!FEEL]` 是这个博客特有的「体会」框。

## 代码

代码块写上语言就会高亮，`title` 显示文件名，`showLineNumbers` 显示行号，`{2,4-5}` 高亮指定行，`/scores/` 高亮某个词：

```python title="attention.py" showLineNumbers {4} /scores/
import torch, math

def attention(q, k, v):
    scores = q @ k.transpose(-2, -1) / math.sqrt(q.size(-1))
    return scores.softmax(dim=-1) @ v
```

不写语言也可以，就是纯文本：

```
$ npm run dev
```

行内代码也能高亮：`attention(q, k, v){:python}`。

## 数学公式

行内公式用单个 `$`：注意力的缩放因子是 $\frac{1}{\sqrt{d_k}}$。

独立公式用两个 `$$`，各占一行：

$$
\mathrm{Attention}(Q, K, V) = \mathrm{softmax}\left(\frac{QK^\top}{\sqrt{d_k}}\right)V
$$

## 表格

| 方法 | 复杂度 | 备注 |
| --- | :---: | ---: |
| 标准注意力 | $O(n^2)$ | 精确 |
| 线性注意力 | $O(n)$ | 近似 |

`:---:` 居中对齐，`---:` 右对齐。表格太宽时手机上可以横向滑动。

## 图片

图片放在 `public/posts/文章文件名/` 里，用 `/posts/文章文件名/图片名` 引用。在引号里写上说明文字，就会显示成带图注的图片：

![圆相图标](/posts/markdown-showcase/enso.svg "图注写在引号里")

## 直接写 HTML

Markdown 里可以直接写 HTML，用来做 Markdown 本身没有的效果。

折叠块，适合放答案、长输出：

<details>
<summary>点开看推导过程</summary>

折叠块里面也能继续写 **Markdown**，前后各空一行即可。

</details>

按键：按 <kbd>⌘</kbd> + <kbd>K</kbd>。上标和下标：d<sub>k</sub>、x<sup>2</sup>。

嵌入视频（B 站、YouTube 的「嵌入代码」直接粘贴进来即可），会自动铺满正文宽度，按 16:9 显示。

## 脚注与分隔线

在正文里写 `[^1]` 标记脚注[^1]，脚注内容会统一放到文章末尾[^note]。

[^1]: 这是第一条脚注。
[^note]: 脚注的名字可以是数字，也可以是任意单词。

三个短横线是分隔线：

---

分隔线下面继续写。
