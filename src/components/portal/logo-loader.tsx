"use client";

/**
 * LogoLoader — A premium loading animation featuring the site logo
 * with orbiting dots, pulsing glow, and rotating ring effects.
 *
 * Usage:
 *   <LogoLoader />                    — full-screen overlay
 *   <LogoLoader size="sm" />          — inline small
 *   <LogoLoader size="md" inline />   — inline medium
 *   <LogoLoader message="Loading…" /> — with text
 */

interface LogoLoaderProps {
  /** sm = 48px, md = 80px, lg = 120px (default) */
  size?: "sm" | "md" | "lg";
  /** Render inline instead of a full-screen overlay */
  inline?: boolean;
  /** Optional status message below the spinner */
  message?: string;
}

const sizes = {
  sm: { logo: 36, ring: 56, dots: 6, dotSize: 4 },
  md: { logo: 56, ring: 84, dots: 8, dotSize: 5 },
  lg: { logo: 80, ring: 120, dots: 10, dotSize: 6 },
} as const;

export function LogoLoader({ size = "lg", inline = false, message }: LogoLoaderProps) {
  const s = sizes[size];
  const r = s.ring / 2; // radius for orbiting dots

  // Generate dot positions evenly distributed in a circle
  const dots = Array.from({ length: s.dots }, (_, i) => {
    const angle = (360 / s.dots) * i;
    return { angle, delay: (i * 0.12).toFixed(2) };
  });

  const content = (
    <div className="logo-loader__container" style={{ width: s.ring + 24, height: s.ring + 24 }}>
      {/* Outer glow pulse */}
      <div
        className="logo-loader__glow"
        style={{ width: s.ring + 16, height: s.ring + 16 }}
      />

      {/* Spinning dashed ring */}
      <svg
        className="logo-loader__ring"
        width={s.ring + 20}
        height={s.ring + 20}
        viewBox={`0 0 ${s.ring + 20} ${s.ring + 20}`}
      >
        <circle
          cx={(s.ring + 20) / 2}
          cy={(s.ring + 20) / 2}
          r={r + 2}
          fill="none"
          stroke="var(--primary)"
          strokeWidth="2"
          strokeDasharray="6 4"
          strokeLinecap="round"
          opacity="0.4"
        />
      </svg>

      {/* Counter-rotating outer ring */}
      <svg
        className="logo-loader__ring-reverse"
        width={s.ring + 20}
        height={s.ring + 20}
        viewBox={`0 0 ${s.ring + 20} ${s.ring + 20}`}
      >
        <circle
          cx={(s.ring + 20) / 2}
          cy={(s.ring + 20) / 2}
          r={r - 4}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="1.5"
          strokeDasharray="3 8"
          strokeLinecap="round"
          opacity="0.3"
        />
      </svg>

      {/* Orbiting dots */}
      <div className="logo-loader__orbit" style={{ width: s.ring + 20, height: s.ring + 20 }}>
        {dots.map((d, i) => (
          <div
            key={i}
            className="logo-loader__dot"
            style={{
              width: s.dotSize,
              height: s.dotSize,
              animationDelay: `${d.delay}s`,
              transform: `rotate(${d.angle}deg) translateY(-${r + 2}px)`,
              transformOrigin: "center center",
              position: "absolute",
              top: "50%",
              left: "50%",
              marginLeft: -(s.dotSize / 2),
              marginTop: -(s.dotSize / 2),
            }}
          />
        ))}
      </div>

      {/* Center logo */}
      <div
        className="logo-loader__logo-wrap"
        style={{ width: s.logo + 12, height: s.logo + 12 }}
      >
        <img
          src="/logo.png"
          alt=""
          className="logo-loader__logo"
          style={{ width: s.logo, height: s.logo }}
        />
      </div>
    </div>
  );

  if (inline) {
    return (
      <div className="logo-loader logo-loader--inline">
        {content}
        {message && <p className="logo-loader__message">{message}</p>}
      </div>
    );
  }

  return (
    <div className="logo-loader logo-loader--fullscreen">
      {content}
      {message && <p className="logo-loader__message">{message}</p>}
    </div>
  );
}
