// Logo.jsx
// Usage: <Logo size="md" /> — sizes: sm | md | lg
// The square "B" monogram + "BlogApp" wordmark (Direction B)

export function LogoMark({ size = 32 }) {
  return (
    <div
      className="flex items-center justify-center rounded bg-neutral-900 flex-shrink-0"
      style={{ width: size, height: size }}
    >
      <span
        className="text-white font-bold leading-none select-none"
        style={{ fontSize: size * 0.56 }}
      >
        B
      </span>
    </div>
  );
}

export function Logo({ size = "md", wordmark = true }) {
  const scales = {
    sm: { mark: 24, text: "text-sm tracking-widest" },
    md: { mark: 32, text: "text-base tracking-widest" },
    lg: { mark: 44, text: "text-xl tracking-widest" },
  };
  const s = scales[size] ?? scales.md;

  return (
    <div className="flex items-center gap-2.5">
      <LogoMark size={s.mark} />
      {wordmark && (
        <span
          className={`font-semibold uppercase text-neutral-900 ${s.text}`}
        >
          BlogApp
        </span>
      )}
    </div>
  );
}
