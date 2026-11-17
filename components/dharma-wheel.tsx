export function DharmaWheel({ className = "", spokes = 24 }: { className?: string; spokes?: number }) {
  const lines = Array.from({ length: spokes }, (_, i) => {
    const a = (i * 2 * Math.PI) / spokes;
    return (
      <line
        key={i}
        x1={50 + 12 * Math.cos(a)}
        y1={50 + 12 * Math.sin(a)}
        x2={50 + 40 * Math.cos(a)}
        y2={50 + 40 * Math.sin(a)}
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
