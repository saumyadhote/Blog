import { useId, useState, useEffect } from "react";

export function DotPattern({
  width = 30,
  height = 30,
  cx = 2,
  cy = 2,
  cr = 2,
  className = "",
  ...props
}) {
  const id = useId();
  const [mousePosition, setMousePosition] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", updateMousePosition);
    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none', backgroundColor: '#0A090F' }} className={className}>
      <svg aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <defs>
          <pattern id={id} width={width} height={height} patternUnits="userSpaceOnUse" x="0" y="0">
            <circle cx={cx} cy={cy} r={cr} />
          </pattern>
        </defs>
      </svg>
      {/* Base very dim dots background */}
      <svg aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', fill: 'rgba(155, 94, 255, 0.15)' }}>
        <rect width="100%" height="100%" fill={`url(#${id})`} />
      </svg>
      {/* Glowing highlight dots tracking mouse */}
      <svg
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          fill: '#D2A8FF', /* Light purple */
          opacity: 1,
          maskImage: `radial-gradient(circle 200px at ${mousePosition.x}px ${mousePosition.y}px, black 0%, transparent 100%)`,
          WebkitMaskImage: `radial-gradient(circle 200px at ${mousePosition.x}px ${mousePosition.y}px, black 0%, transparent 100%)`,
        }}
        {...props}
      >
        <rect width="100%" height="100%" fill={`url(#${id})`} />
      </svg>
    </div>
  );
}
