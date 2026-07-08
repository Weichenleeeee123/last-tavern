import { useMemo } from 'react';

interface Particle {
  id: number;
  left: string;
  animationDelay: string;
  animationDuration: string;
  size: string;
  type: 'ember' | 'dust';
}

export function CandleParticles({ count = 20 }: { count?: number }) {
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 5}s`,
      animationDuration: `${3 + Math.random() * 4}s`,
      size: `${1.5 + Math.random() * 2.5}px`,
      type: i < count * 0.4 ? 'ember' : 'dust',
    }));
  }, [count]);

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      {particles.map((p) => (
        <div
          key={p.id}
          className={`absolute bottom-0 rounded-full ${p.type === 'ember' ? 'bg-tavern-candle' : 'bg-tavern-text/20'}`}
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            animation: `${p.type === 'ember' ? 'floatUp' : 'dustFloat'} ${p.animationDuration} ease-in ${p.animationDelay} infinite`,
            opacity: 0,
            boxShadow: p.type === 'ember' ? '0 0 4px rgba(244, 200, 66, 0.6)' : 'none',
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
        @keyframes dustFloat {
          0% { transform: translate(0, 0); opacity: 0; }
          15% { opacity: 0.3; }
          85% { opacity: 0.15; }
          100% { transform: translate(15px, -60px); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
