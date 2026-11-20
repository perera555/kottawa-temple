export function DharmaWheel({ className = "", spokes = 24 }: { className?: string; spokes?: number }) {
  // Round so server and browser render identical numbers (avoids hydration warnings)
  const r = (n: number) => Math.round(n * 1000) / 1000;
  const lines = Array.from({ length: spokes }, (_, i) => {
    const a = (i * 2 * Math.PI) / spokes;
    return (
      <line
        key={i}
        x1={r(50 + 12 * Math.cos(a))}
        y1={r(50 + 12 * Math.sin(a))}
        x2={r(50 + 40 * Math.cos(a))}
        y2={r(50 + 40 * Math.sin(a))}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    );
  });
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" stroke="currentColor" fill="none">
      <circle cx="50" cy="50" r="46" strokeWidth="5" />
      <circle cx="50" cy="50" r="40" strokeWidth="1.5" />
      <circle cx="50" cy="50" r="9" strokeWidth="4" />
      {lines}
    </svg>
  );
}
