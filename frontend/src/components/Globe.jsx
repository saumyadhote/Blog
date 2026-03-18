import { useEffect, useRef } from "react";
import createGlobe from "cobe";

export function Globe({ className = "" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    let phi = 0;

    // Magic UI cobe globe configuration
    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 600 * 2,
      height: 600 * 2,
      phi: 0,
      theta: 0,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.1, 0.05, 0.2], // Dark purple base
      markerColor: [0.62, 0.48, 1.0], // Purple matching --accent-color: #9e7aff
      glowColor: [0.15, 0.1, 0.3], // subtle purple glow
      markers: [
        { location: [37.7595, -122.4367], size: 0.03 },
        { location: [40.7128, -74.006], size: 0.1 },
      ],
      onRender: (state) => {
        state.phi = phi;
        phi += 0.005;
      },
    });

    return () => {
      globe.destroy();
    };
  }, []);

  return (
    <div className={`globe-wrapper ${className}`} style={{ width: '100%', maxWidth: '1000px', margin: '0 auto', aspectRatio: '1 / 1', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          contain: "layout paint size",
          opacity: 1,
          transition: "opacity 1s ease",
        }}
      />
    </div>
  );
}
