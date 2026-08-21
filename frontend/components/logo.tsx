/** The mark is a 2×2 checkerboard: the universal sign for transparency, and for what this does. */
export function LogoMark({ className = "size-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={className}>
      <rect width="32" height="32" rx="8" className="fill-primary/12" />
      <g className="fill-primary">
        <path d="M8 8h8v8H8z" />
        <path d="M16 16h8v8h-8z" />
      </g>
    </svg>
  );
}

export function Logo() {
  return (
    <span className="flex items-center gap-2 text-lg font-semibold tracking-tight">
      <LogoMark />
      <span>
        no<span className="text-primary">-bg</span>
      </span>
    </span>
  );
}
