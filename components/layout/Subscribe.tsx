"use client";

import { useState } from "react";

/** 订阅框：目前只是前端演示，接入 Buttondown / Resend 等服务时改 onSubmit 即可 */
export default function Subscribe() {
  const [note, setNote] = useState("");
  return (
    <form
      className="subscribe"
      onSubmit={(e) => {
        e.preventDefault();
        setNote("> 收到。（订阅服务尚未接入）");
      }}
    >
      <label htmlFor="email">订阅更新 · 每月一封，不打扰</label>
      <div className="row">
        <input id="email" name="email" type="email" required placeholder="you@example.com" />
        <button type="submit">订阅</button>
      </div>
      <span className="note" aria-live="polite">{note}</span>
    </form>
  );
}
