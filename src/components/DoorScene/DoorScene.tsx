import { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { CandleParticles } from '../shared/CandleParticles';
import { Vignette } from '../shared/Vignette';
import { playDoorSound, startAmbient } from '../../services/audio';

export function DoorScene() {
  const setScene = useStore((s) => s.setScene);
  const settings = useStore((s) => s.settings);
  const setShowSettings = useStore((s) => s.setShowSettings);
  const [opening, setOpening] = useState(false);
  const [showApiHint, setShowApiHint] = useState(false);

  const apiConfigured = settings.apiKey.trim().length > 0;

  useEffect(() => {
    if (!apiConfigured) {
      const timer = setTimeout(() => setShowApiHint(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [apiConfigured]);

  const handleDoorClick = () => {
    startAmbient();
    playDoorSound();
    setOpening(true);
    setTimeout(() => setScene('hall'), 2800);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-door-scene">
      {/* Dark overlay for depth */}
      <div className="absolute inset-0 scene-overlay-dark" />
      <CandleParticles count={15} />
      <Vignette />

      <div className="relative z-20 flex flex-col items-center">
        {/* Title */}
        {!opening && (
          <div className="text-center mb-8 fade-up">
            <h1 className="text-tavern-gold font-serif-cn text-4xl md:text-5xl title-pulse mb-2">
              临终酒馆
            </h1>
            <p className="text-tavern-muted font-serif-en text-base italic tracking-widest">
              The Last Tavern
            </p>
            <p className="text-tavern-text/40 font-serif-cn text-xs mt-3">
              此门只开一夜
            </p>
          </div>
        )}

        {/* Door - click to enter */}
        <div
          className="relative cursor-pointer group"
          style={{ perspective: '1400px', perspectiveOrigin: 'center 30%' }}
          onClick={handleDoorClick}
        >
          {/* Light behind doors */}
          <div
            className={`absolute inset-0 z-0 ${opening ? 'light-spill-anim' : 'opacity-0'}`}
            style={{
              background: 'radial-gradient(ellipse at center, rgba(244, 200, 66, 0.7) 0%, rgba(201, 168, 76, 0.3) 30%, transparent 70%)',
              filter: 'blur(20px)',
            }}
          />

          {/* Door container */}
          <div
            className="relative z-10"
            style={{ width: 'min(440px, 85vw)', height: 'min(560px, 70vh)' }}
          >
            {/* Stone arch top */}
            <div
              className="absolute -top-6 left-0 right-0 h-16 z-20"
              style={{
                background: 'radial-gradient(ellipse at bottom, #2a2520 0%, #1a1612 80%)',
                borderRadius: '50% 50% 0 0 / 100% 100% 0 0',
                boxShadow: 'inset 0 4px 12px rgba(0,0,0,0.6)',
              }}
            />

            {/* Left door panel */}
            <div
              className={`door-panel-left absolute left-0 top-0 w-1/2 h-full z-10 ${opening ? 'open' : ''}`}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <DoorPanel side="left" />
            </div>

            {/* Right door panel */}
            <div
              className={`door-panel-right absolute right-0 top-0 w-1/2 h-full z-10 ${opening ? 'open' : ''}`}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <DoorPanel side="right" />
            </div>

            {/* Center light seam */}
            {opening && (
              <div
                className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-3 z-0 light-spill-anim"
                style={{
                  background: 'linear-gradient(180deg, rgba(244,200,66,0.9) 0%, rgba(201,168,76,0.5) 50%, rgba(244,200,66,0.7) 100%)',
                  filter: 'blur(6px)',
                }}
              />
            )}

            {/* Threshold shadow */}
            <div
              className="absolute -bottom-2 left-0 right-0 h-4 z-20"
              style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, transparent 100%)' }}
            />
          </div>
        </div>

        {/* API hint */}
        {showApiHint && !apiConfigured && !opening && (
          <div className="mt-6 fade-up-delay-3">
            <div className="bg-tavern-bg2/80 border border-tavern-gold/20 rounded-lg px-5 py-3 backdrop-blur-sm">
              <p className="text-tavern-muted font-serif-cn text-xs text-center mb-2">
                尚未配置 API · 对话功能将不可用
              </p>
              <button
                onClick={() => setShowSettings(true)}
                className="text-tavern-gold font-serif-cn text-xs underline underline-offset-4 hover:text-tavern-candle transition-colors"
              >
                前往配置 →
              </button>
            </div>
          </div>
        )}

        {opening && (
          <div className="mt-8 text-center">
            <p className="text-tavern-gold/40 font-serif-cn text-sm tracking-[0.5em]">
              · · ·
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function DoorPanel({ side }: { side: 'left' | 'right' }) {
  const rivetPositions = [0.15, 0.35, 0.55, 0.75];

  return (
    <div
      className="wood-texture w-full h-full relative overflow-hidden"
      style={{
        boxShadow: side === 'left'
          ? 'inset -4px 0 8px rgba(0,0,0,0.5), 4px 0 12px rgba(0,0,0,0.4)'
          : 'inset 4px 0 8px rgba(0,0,0,0.5), -4px 0 12px rgba(0,0,0,0.4)',
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'repeating-linear-gradient(90deg, transparent 0px, transparent 48px, rgba(0,0,0,0.25) 48px, rgba(0,0,0,0.25) 50px)',
        }}
      />

      {/* Iron hinge band - top */}
      <div className="absolute top-6 left-0 right-0 h-3.5 iron-fitting" style={{ boxShadow: '0 3px 8px rgba(0,0,0,0.5)' }}>
        {rivetPositions.map((pos) => (
          <div
            key={pos}
            className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full iron-fitting"
            style={{ left: `${pos * 100}%` }}
          />
        ))}
      </div>

      {/* Iron hinge band - bottom */}
      <div className="absolute bottom-6 left-0 right-0 h-3.5 iron-fitting" style={{ boxShadow: '0 -3px 8px rgba(0,0,0,0.5)' }}>
        {rivetPositions.map((pos) => (
          <div
            key={pos}
            className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full iron-fitting"
            style={{ left: `${pos * 100}%` }}
          />
        ))}
      </div>

      {/* Decorative emblem */}
      <div className="absolute top-[22%] left-1/2 -translate-x-1/2 text-tavern-gold/12 text-5xl font-serif-en select-none">
        ⚜
      </div>

      {/* Ring handle */}
      <div className={`absolute top-1/2 -translate-y-1/2 ${side === 'left' ? 'right-3' : 'left-3'}`}>
        <div
          className="w-8 h-8 rounded-full border-[3px] iron-fitting"
          style={{
            borderColor: '#3a3a3a',
            boxShadow: '0 3px 8px rgba(0,0,0,0.5), inset 0 1px 2px rgba(255,255,255,0.1)',
          }}
        />
      </div>

      {/* Edge shadow on meeting edge */}
      <div
        className={`absolute top-0 bottom-0 w-2.5 ${side === 'left' ? 'right-0' : 'left-0'}`}
        style={{
          background: side === 'left'
            ? 'linear-gradient(90deg, transparent, rgba(0,0,0,0.5))'
            : 'linear-gradient(270deg, transparent, rgba(0,0,0,0.5))',
        }}
      />
    </div>
  );
}
