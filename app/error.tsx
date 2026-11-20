"use client";

import { useEffect } from "react";

/** Friendly error screen. After a new deploy, an old open tab can fail to load
 *  updated code - a reload fixes it, so we do that once automatically. */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
    const stale = /ChunkLoadError|Loading chunk|Failed to fetch dynamically imported module|Failed to find Server Action/i.test(error.message);
    try {
      if (stale && !sessionStorage.getItem("reloaded")) {
        sessionStorage.setItem("reloaded", "1");
        window.location.reload();
      }
    } catch {}
  }, [error]);

  return (
    <div className="grid min-h-[60vh] place-items-center px-4 py-16 text-center">
      <div className="card card-flat max-w-md p-8">
        <h1 className="font-display text-3xl text-accent">Something went wrong</h1>
        <p className="mt-2 text-muted">කණගාටුයි, දෝෂයක් ඇති විය. Please try again.</p>
        <div className="mt-6 flex justify-center gap-3">
          <button onClick={() => reset()} className="btn btn-primary">Try again</button>
          <button onClick={() => window.location.reload()} className="btn btn-ghost">Reload page</button>
        </div>
      </div>
    </div>
  );
}
