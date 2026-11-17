"use client";

import dynamic from "next/dynamic";
import { DharmaWheel } from "../dharma-wheel";

// WebGL only runs in the browser; show the CSS wheel while it loads.
const StupaScene = dynamic(() => import("./stupa-scene"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full w-full place-items-center">
      <DharmaWheel className="wheel-3d h-40 w-40 text-flag-yellow" />
    </div>
  ),
});

export function Hero3D({ variant = "temple", className = "" }: { variant?: "temple" | "dhamma" | "montessori"; className?: string }) {
  return (
    <div className={`relative ${className}`} aria-hidden="true">
      <div className="absolute inset-[15%] rounded-full bg-flag-yellow/25 blur-3xl" />
      <StupaScene variant={variant} />
    </div>
  );
}
