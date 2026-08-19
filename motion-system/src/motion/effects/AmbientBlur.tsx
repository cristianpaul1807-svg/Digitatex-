export interface AmbientBlurProps {
  blur?: number;
  saturate?: number;
  tint?: string;
  className?: string;
}

/**
 * K05 — Ambient Blur.
 *
 * A frosted plane over whatever is behind it.
 *
 * `backdrop-filter` is expensive: it forces the browser to composite and blur
 * everything underneath, every frame it changes. Worth it on a static panel and
 * almost never worth it on something that moves — so the system uses it for
 * surfaces, never for anything animated.
 */
export function AmbientBlur({ blur = 24, saturate = 1.2, tint = 'rgba(8,9,10,0.45)', className = '' }: AmbientBlurProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{
        backdropFilter: `blur(${blur}px) saturate(${saturate})`,
        WebkitBackdropFilter: `blur(${blur}px) saturate(${saturate})`,
        background: tint,
      }}
    />
  );
}
