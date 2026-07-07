import { useStore } from '../../store/useStore';
import { allTables } from '../../data/characters';
import { Table } from './Table';
import { CandleParticles } from '../shared/CandleParticles';
import { Vignette } from '../shared/Vignette';

export function TavernHall() {
  const setShowSettings = useStore((s) => s.setShowSettings);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-tavern-bg animate-fade-in">
      <CandleParticles count={30} />
      <Vignette />

      {/* 顶部标题 */}
      <div className="relative z-20 text-center pt-12 pb-8">
        <h1 className="text-tavern-gold font-serif-cn text-4xl text-glow mb-2">
          临终酒馆
        </h1>
        <p className="text-tavern-muted font-serif-en text-sm italic">
          The Last Tavern
        </p>
        <p className="text-tavern-text/50 font-serif-cn text-xs mt-4">
          每位来客,都在他们人生的最后一夜 · 入座对饮
        </p>
      </div>

      {/* 桌子布局 - 响应式网格 */}
      <div className="relative z-20 px-4 md:px-8 pb-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {allTables.map((table) => (
            <Table key={table.id} table={table} />
          ))}
        </div>
      </div>

      {/* 设置按钮 */}
      <button
        onClick={() => setShowSettings(true)}
        className="fixed top-4 right-4 z-30 text-tavern-muted hover:text-tavern-gold transition-colors"
        title="设置"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>
    </div>
  );
}
