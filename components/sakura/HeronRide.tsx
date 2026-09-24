"use client";

import { useEffect, useId, useMemo, useRef } from "react";
import { animateHeronScene, heronSceneMarkup, VIEWBOX } from "@/lib/heron/scene";

/**
 * 樱花树下苍鹭骑车（移植自 sakura-heron-astra.html），首页页头用。
 * 服务端先渲染 t=0 的静止画面，浏览器里接着动起来；系统开启「减弱动态效果」时保持静止。
 */
export default function HeronRide({ className, preserveAspectRatio = "xMidYMax slice" }: { className?: string; preserveAspectRatio?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const id = "h" + useId().replace(/[^a-zA-Z0-9]/g, "");
  const markup = useMemo(() => heronSceneMarkup({ id, detail: "wide" }), [id]);

  useEffect(() => {
    const svg = ref.current;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    if (!svg) return;
    let stop: (() => number) | undefined;
    const sync = () => {
      const at = stop?.() ?? 0;
      stop = motion.matches ? undefined : animateHeronScene(svg, "wide", at);
    };
    sync();
    motion.addEventListener("change", sync);
    return () => {
      stop?.();
      motion.removeEventListener("change", sync);
    };
  }, []);

  return (
    <svg
      ref={ref}
      className={className}
      viewBox={VIEWBOX.wide}
      preserveAspectRatio={preserveAspectRatio}
      role="img"
      aria-label="苍鹭骑着自行车，穿行于两侧的樱花树下，花瓣随风飘落"
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}
