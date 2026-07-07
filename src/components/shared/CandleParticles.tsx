import { useMemo } from 'react';

interface Particle {
  id: number;
  left: string;
  animationDelay: string;
  animationDuration: string;
  size: string;
}

export function CandleParticles({ count = 20 }: { count?: number }) {
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 5}s`,
      animationDuration: `${3 + Math.random() * 4}s`,
      size: `${2 + Math.random() * 3}px`,
    }));
  }, [count]);

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute bottom-0 rounded-full bg-tavern-candle"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            animation: `floatUp ${p.animationDuration} ease-in ${p.animationDelay} infinite`,
            opacity: 0,
            boxShadow: '0 0 4px rgba(244, 200, 66, 0.6)',
          }}
        />
      ))}
      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 0.8; }
          90% { opacity: 0.3; }
          100% { transform: translateY(-100vh); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
