import { useStore } from '../../store/useStore';
import { allTables } from '../../data/characters';
import { Table } from './Table';
import { CandleParticles } from '../shared/CandleParticles';
import { Vignette } from '../shared/Vignette';
import { useAudio } from '../../hooks/useAudio';

export function TavernHall() {
  const setShowSettings = useStore((s) => s.setShowSettings);
  const settings = useStore((s) => s.settings);
  const { enabled: audioEnabled, toggle: toggleAudio } = useAudio();

  return (
    <div className="relative min-h-screen overflow-x-hidden overflow-y-auto bg-tavern-scene animate-fade-in">
      {/* Atmosphere overlays */}
      <div className="absolute inset-0 scene-overlay pointer-events-none" />
      <div className="fixed inset-0 floor-shadow pointer-events-none" />
      <CandleParticles count={20} />
      <Vignette />

      {/* Header */}
      <div className="relative z-20 text-center pt-10 pb-8">
        <div className="flex items-center justify-center gap-4 mb-2">
          <span className="h-px w-12 bg-gradient-to-r from-transparent to-tavern-gold/30" />
          <h1 className="text-tavern-gold font-serif-cn text-3xl md:text-4xl text-glow">
            临终酒馆
          </h1>
          <span className="h-px w-12 bg-gradient-to-l from-transparent to-tavern-gold/30" />
        </div>
        <p className="text-tavern-muted font-serif-en text-sm italic tracking-widest">
          The Last Tavern
        </p>
        <p className="text-tavern-text/40 font-serif-cn text-xs mt-3">
          每位来客,都在他们人生的最后一夜
        </p>
      </div>

      {/* Tables - staggered layout for 6 tables */}
      <div className="relative z-20 px-4 md:px-8 pb-24">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {allTables.map((table, i) => (
            <div
              key={table.id}
              className={`fade-up ${i % 3 === 1 ? 'sm:mt-8 lg:mt-12' : ''} ${i % 3 === 2 ? 'sm:mt-4 lg:mt-6' : ''}`}
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <Table table={table} />
            </div>
          ))}
        </div>
      </div>

      {/* Settings & Audio buttons */}
      <div className="fixed top-4 right-4 z-40 flex items-center gap-2">
        {/* Audio toggle */}
        <button
          onClick={toggleAudio}
          className="text-tavern-muted hover:text-tavern-gold transition-colors p-2"
          title={audioEnabled ? '关闭音乐' : '开启音乐'}
        >
          {audioEnabled ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          )}
        </button>
        {/* Settings */}
        <button
          onClick={() => setShowSettings(true)}
          className="text-tavern-muted hover:text-tavern-gold transition-colors p-2"
          title="设置"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>

      {/* API status indicator */}
      {!settings.apiKey.trim() && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40">
          <button
            onClick={() => setShowSettings(true)}
            className="bg-tavern-bg2/90 border border-tavern-gold/30 rounded-full px-5 py-2 backdrop-blur-sm hover:border-tavern-gold/60 transition-colors"
          >
            <span className="text-tavern-muted font-serif-cn text-xs">
              未配置 API · 点击配置
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
