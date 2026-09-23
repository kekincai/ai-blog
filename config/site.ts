// 站点地址：优先用 SITE_URL，其次用 Vercel 自动注入的生产域名，本地开发回落到 localhost
const siteUrl =
  process.env.SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

export const site = {
  name: "PAUL.LOG",
  tagline: "潜在空間ノート",
  description: "一个人的 AI 学习现场：学习、认识与体会。",
  author: "Paul",
  url: siteUrl, // 绑定自定义域名后，在 Vercel 里设置环境变量 SITE_URL 即可
  bio: "正在系统地学习人工智能。这里是我的学习现场：读过的论文、写过的代码，和一路上的想法。", // TODO: 换成你自己的介绍
  github: "https://github.com/kekincai",
  repo: "https://github.com/kekincai/ai-blog",
};

export type CategoryKey = "learn" | "insight" | "feel";

export const categories: Record<
  CategoryKey,
  { key: CategoryKey; index: string; zh: string; en: string; ja: string; desc: string; topics: string; color: string }
> = {
  learn: {
    key: "learn",
    index: "01",
    zh: "学习",
    en: "LEARN",
    ja: "学ぶ",
    desc: "论文精读、课程笔记与代码复现。把「看过」变成「做过」。",
    topics: "Transformer · RL · RAG · Agents",
    color: "var(--c-learn)",
  },
  insight: {
    key: "insight",
    index: "02",
    zh: "认识",
    en: "INSIGHT",
    ja: "識る",
    desc: "把零散的知识连成自己的理解：对模型、工具与这个行业的判断。",
    topics: "观点 · 框架 · 对比 · 预测",
    color: "var(--c-insight)",
  },
  feel: {
    key: "feel",
    index: "03",
    zh: "体会",
    en: "FEEL",
    ja: "感じる",
    desc: "与 AI 共事的真实感受——兴奋、焦虑、惊喜与怀疑，都值得被写下来。",
    topics: "随笔 · 日记 · 对话 · 反思",
    color: "var(--c-feel)",
  },
};

export const categoryList = Object.values(categories);

/** 首页「学习日志」终端里的内容，直接改这里即可 */
export type LogStatus = "doing" | "done" | "plan";
export const nowLearning: { status: LogStatus; text: string }[] = [
  { status: "doing", text: "《Deep Learning》第 10 章 · 序列建模" },
  { status: "doing", text: "用 PyTorch 复现一个 mini-GPT" },
  { status: "done", text: "注意力机制论文精读 + 手写实现" },
  { status: "plan", text: "强化学习：从 Bandit 到 PPO" },
  { status: "plan", text: "搭建自己的 RAG 知识库" },
];
