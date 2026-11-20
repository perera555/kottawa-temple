"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import { DharmaWheel } from "../dharma-wheel";

const Fallback = () => (
  <div className="grid h-full w-full place-items-center">
    <DharmaWheel className="wheel-3d h-40 w-40 text-flag-yellow" />
  </div>
);

// WebGL only runs in the browser; show the CSS wheel while it loads.
const StupaScene = dynamic(() => import("./stupa-scene"), { ssr: false, loading: Fallback });

/** If the 3D scene throws (old GPU / driver), show the CSS wheel instead of breaking the page. */
class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(err: unknown) {
    console.warn("[3D] disabled:", err);
  }
  render() {
    return this.state.failed ? <Fallback /> : this.props.children;
  }
}

/** True only when the browser can really create a WebGL context and the user allows motion. */
function canUse3D() {
  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
    if (sessionStorage.getItem("no3d") === "1") return false;
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl2") || canvas.getContext("webgl")) as WebGLRenderingContext | null;
    if (!gl) return false;
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

export function Hero3D({ variant = "temple", className = "" }: { variant?: "temple" | "dhamma" | "montessori"; className?: string }) {
  const [ok, setOk] = useState<boolean | null>(null);
  const [visible, setVisible] = useState(true);
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => setOk(canUse3D()), []);
  useEffect(() => {
    if (!box.current) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "100px" });
    io.observe(box.current);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={box} className={`relative ${className}`} aria-hidden="true">
      <div className="absolute inset-[15%] rounded-full bg-flag-yellow/25 blur-3xl" />
      {ok ? (
        <SceneBoundary>
          <StupaScene variant={variant} active={visible} onContextLost={() => setOk(false)} />
        </SceneBoundary>
      ) : (
        <Fallback />
      )}
    </div>
  );
}
