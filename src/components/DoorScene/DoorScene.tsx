import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { CandleParticles } from '../shared/CandleParticles';
import { Vignette } from '../shared/Vignette';

export function DoorScene() {
  const setScene = useStore((s) => s.setScene);
  const [opening, setOpening] = useState(false);

  const handleDoorClick = () => {
    setOpening(true);
    setTimeout(() => setScene('hall'), 1500);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-tavern-bg">
      <CandleParticles />
      <Vignette />

      {/* 门 */}
      <div className="relative z-20 flex flex-col items-center">
        <div
          className="relative cursor-pointer transition-transform duration-1000"
          style={{
            transformStyle: 'preserve-3d',
            transform: opening ? 'perspective(1000px) rotateY(-85deg)' : 'perspective(1000px) rotateY(0deg)',
            transformOrigin: 'left center',
          }}
          onClick={handleDoorClick}
        >
          {/* 门框 */}
          <div className="w-64 h-96 relative">
            {/* 门板 */}
            <div className="absolute inset-0 bg-gradient-to-b from-tavern-bg2 to-tavern-bg border-2 border-tavern-gold/30 rounded-lg shadow-2xl">
              {/* 木纹纹理 */}
              <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(0,0,0,0.3) 20px, rgba(0,0,0,0.3) 21px)'
              }} />
              {/* 门把手 */}
              <div className="absolute right-4 top-1/2 w-3 h-3 rounded-full bg-tavern-gold/60 candle-glow" />
              {/* 门上雕花 */}
              <div className="absolute top-8 left-1/2 -translate-x-1/2 text-tavern-gold/20 text-6xl font-serif-en">
                ☩
              </div>
            </div>
          </div>
        </div>

        {/* 提示文字 */}
        {!opening && (
          <div className="mt-12 text-center animate-fade-in">
            <h1 className="text-tavern-gold font-serif-cn text-3xl text-glow mb-4">
              临终酒馆
            </h1>
            <p className="text-tavern-muted font-serif-cn text-sm mb-8">
              此酒馆只营业一晚
            </p>
            <p className="text-tavern-text/60 font-serif-cn text-xs animate-pulse">
              推门进入
            </p>
          </div>
        )}

        {opening && (
          <div className="mt-12 text-center animate-fade-in">
            <p className="text-tavern-gold font-serif-cn text-lg">
              ...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
