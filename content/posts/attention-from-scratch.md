---
title: 从零手写注意力机制：我终于看懂了 Q、K、V
date: 2026-09-18
category: learn
featured: true
excerpt: 读了三遍论文依然似懂非懂，直到我用四十行代码把它从头写了一遍。这篇记录了推导、实现，以及那个让我豁然开朗的比喻。
tags: [Transformer, PyTorch, 论文精读]
notes:
  - Q、K、V 都是同一个输入经过不同线性变换得到的。
  - 除以 √dₖ 是为了让点积的方差保持在 1 附近。
# feel: 写下这次学习带给你的真实感受（去掉行首的 # 后会显示在文末「体会」框里）
---

## 为什么要自己写

第一次读《Attention Is All You Need》的时候，我能复述每一个公式，却说不清它们为什么是这样。那种「好像懂了」的感觉最危险——它让你停止追问。

所以我给自己定了一个规则：不看任何现成实现，只用 PyTorch 的基础张量操作，把注意力从头写出来。

## Q、K、V 到底是什么

让我豁然开朗的比喻是图书馆：**Query** 是你心里的问题，**Key** 是每本书脊上的标签，**Value** 是书里的内容。你用问题去比对所有标签，越相关的书，读得越多。

注意力做的事情，本质上就是一次「按相关程度加权的查阅」。

## 四十行实现

```python title="attention.py"
import torch, math

def attention(q, k, v, mask=None):
    d_k = q.size(-1)
    scores = q @ k.transpose(-2, -1) / math.sqrt(d_k)
    if mask is not None:
        scores = scores.masked_fill(mask == 0, float("-inf"))
    weights = scores.softmax(dim=-1)
    return weights @ v, weights
```

真正写下来才发现，核心只有四行。复杂的从来不是公式，而是形状（shape）——每一步张量的维度都要在脑子里对得上。

## 我踩过的坑

1. 忘了除以 `√dₖ`，softmax 直接饱和，梯度几乎消失。
2. mask 用 0 而不是 `-inf` 填充，被遮住的位置依然分到了权重。
3. `transpose` 转错了维度，结果「能跑」但完全不对——最难发现的 bug。

> 能跑的代码不一定是对的代码；能复述的知识，也不一定是懂了的知识。
