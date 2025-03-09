import React from "react";
export function ParticlesBackground() {
  return <div className="absolute inset-0 overflow-hidden">
      <div className="particles-container">
        {[...Array(20)].map((_, i) => <div key={i} className="particle" style={{
        "--particle-size": `${Math.random() * 4 + 1}px`,
        "--particle-x": `${Math.random() * 100}%`,
        "--particle-y": `${Math.random() * 100}%`,
        "--particle-duration": `${Math.random() * 20 + 10}s`,
        "--particle-delay": `${Math.random() * -20}s`
      } as React.CSSProperties} />)}
      </div>
    </div>;
}