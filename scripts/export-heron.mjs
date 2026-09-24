/**
 * 从 lib/heron/scene.ts 导出静态 SVG：
 *   app/icon.svg        网站图标（苍鹭骑车）
 *   docs/heron.svg      README 顶部的插图（完整场景）
 * 改了 scene.ts 里的图形后运行：npm run heron
 */
import { writeFileSync } from "node:fs";
import { heronSceneSVG } from "../lib/heron/scene.ts";

const root = new URL("..", import.meta.url).pathname;
writeFileSync(`${root}app/icon.svg`, heronSceneSVG({ id: "i", detail: "icon" }) + "\n");
writeFileSync(`${root}docs/heron.svg`, heronSceneSVG({ id: "h", detail: "full", viewBox: "0 60 1440 840", width: 720, height: 420 }) + "\n");
console.log("[heron] 已导出 app/icon.svg、docs/heron.svg");
