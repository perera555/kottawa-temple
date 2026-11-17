"use client";

import { useEffect } from "react";

/**
 * Site-wide 3D tilt: every `.card` / `.tile-3d` follows the mouse with a soft
 * light glare. Disabled for touch devices and reduced-motion users.
 */
export function TiltEffect() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover)").matches) return;

    let active: HTMLElement | null = null;
    const reset = (el: HTMLElement) => {
      el.style.removeProperty("--rx");
      el.style.removeProperty("--ry");
      el.style.removeProperty("--gx");
      el.style.removeProperty("--gy");
      el.classList.remove("is-tilting");
    };

    const onMove = (e: PointerEvent) => {
      const el = (e.target as HTMLElement | null)?.closest?.<HTMLElement>(".card:not(.card-flat), .tile-3d");
      if (active && active !== el) reset(active);
      active = el ?? null;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      el.style.setProperty("--ry", `${(px - 0.5) * 12}deg`);
      el.style.setProperty("--rx", `${(0.5 - py) * 10}deg`);
      el.style.setProperty("--gx", `${px * 100}%`);
      el.style.setProperty("--gy", `${py * 100}%`);
      el.classList.add("is-tilting");
    };
    const onLeave = () => active && reset(active);

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);
  return null;
}
