"use client";

import { useEffect, useState } from "react";

/**
 * 页脚订阅框。
 * - 配置了 Buttondown 用户名（环境变量 BUTTONDOWN_USERNAME）：真正的邮件订阅，提交到 Buttondown
 * - 没配置：显示 RSS 地址，一键复制，方便粘贴到阅读器
 */
export default function Subscribe({ buttondown }: { buttondown?: string }) {
  const [note, setNote] = useState("");
  const [feed, setFeed] = useState("/feed.xml");
  useEffect(() => setFeed(`${location.origin}/feed.xml`), []);

  if (buttondown) {
    const action = `https://buttondown.com/api/emails/embed-subscribe/${buttondown}`;
    return (
      <form className="subscribe" action={action} method="post" target="_blank" onSubmit={() => setNote("> 已提交，请到邮箱点确认链接。")}>
        <label htmlFor="email">订阅更新 · 有新文章时发邮件，不打扰</label>
        <div className="row">
          <input id="email" name="email" type="email" required placeholder="you@example.com" />
          <button type="submit">订阅</button>
        </div>
        <span className="note" aria-live="polite">{note}</span>
      </form>
    );
  }

  return (
    <form
      className="subscribe"
      onSubmit={async (e) => {
        e.preventDefault();
        try {
          await navigator.clipboard.writeText(feed);
          setNote("> 已复制，粘贴到 RSS 阅读器即可订阅。");
        } catch {
          setNote("> 复制失败，请手动复制上面的地址。");
        }
      }}
    >
      <label htmlFor="feed">订阅更新 · 用 RSS 阅读器订阅</label>
      <div className="row">
        <input id="feed" value={feed} readOnly onFocus={(e) => e.currentTarget.select()} aria-label="RSS 订阅地址" />
        <button type="submit">复制</button>
      </div>
      <span className="note" aria-live="polite">{note}</span>
    </form>
  );
}
