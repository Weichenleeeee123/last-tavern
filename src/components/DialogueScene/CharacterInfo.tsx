import { useStore } from '../../store/useStore';
import type { TableType } from '../../types';

const difficultyLabels: Record<string, { label: string; color: string; desc: string }> = {
  extreme: { label: '极难', color: 'text-red-400/90', desc: '近乎不可能改变其命运' },
  high: { label: '困难', color: 'text-orange-400/80', desc: '他会动摇,但最终坚守' },
  medium: { label: '中等', color: 'text-yellow-400/70', desc: '他愿倾听,但说服不易' },
  low: { label: '温和', color: 'text-green-400/60', desc: '他比较开放,愿意对话' },
};

const tableNames: Record<TableType, { name: string; icon: string }> = {
  power: { name: '权力之桌', icon: '⚔' },
  ink: { name: '笔墨之桌', icon: '✒' },
  mirror: { name: '镜中之桌', icon: '◈' },
  truth: { name: '真理之桌', icon: '∞' },
  melody: { name: '音符之桌', icon: '♪' },
  stars: { name: '星辰之桌', icon: '✦' },
};

export function CharacterInfo() {
  const character = useStore((s) => s.currentCharacter);
  const dialogueRound = useStore((s) => s.dialogueRound);
  const fateValue = useStore((s) => s.fateState.value);
  const messages = useStore((s) => s.messages);

  if (!character) return null;

  const diff = difficultyLabels[character.difficulty] || difficultyLabels.medium;
  const table = tableNames[character.table] || tableNames.power;
  const userMsgCount = messages.filter(m => m.role === 'user').length;
  const charMsgCount = messages.filter(m => m.role === 'assistant').length;

  return (
    <div className="flex flex-col gap-4">
      {/* 肖像 + 姓名 */}
      <div className="relative flex flex-col items-center pb-4 border-b border-tavern-gold/15">
        <div className="relative">
          <div
            className="absolute -inset-3 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(244,200,66,0.1) 0%, transparent 70%)' }}
          />
          <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-tavern-gold/35 shadow-lg">
            <img
              src={character.portrait}
              alt={character.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = `<span class="text-tavern-gold/40 font-serif-cn text-3xl flex items-center justify-center w-full h-full bg-tavern-bg2">${character.name[0]}</span>`;
                }
              }}
            />
            <div className="absolute inset-0 rounded-full pointer-events-none" style={{ boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)' }} />
          </div>
        </div>
        <h2 className="text-tavern-gold font-serif-cn text-xl mt-3 text-glow">
          {character.name}
        </h2>
        <p className="text-tavern-muted font-serif-en text-xs italic tracking-wide">
          {character.nameEn}
        </p>
        <div className="flex items-center gap-2 mt-2 text-tavern-muted/60 font-serif-cn text-[10px]">
          <span>{character.era}</span>
          <span className="text-tavern-gold/30">·</span>
          <span>{character.year > 0 ? `公元 ${character.year} 年` : `公元前 ${Math.abs(character.year)} 年`}</span>
        </div>
      </div>

      {/* 桌位归属 */}
      <div className="flex items-center gap-2 bg-tavern-bg2/50 rounded-lg p-2.5 border border-tavern-gold/10">
        <span className="text-tavern-gold/50 text-base leading-none">{table.icon}</span>
        <div>
          <p className="text-tavern-muted/60 font-serif-cn text-[10px]">座席</p>
          <p className="text-tavern-gold/70 font-serif-cn text-xs">{table.name}</p>
        </div>
        <div className="ml-auto">
          <span className={`text-[10px] font-serif-cn border rounded-full px-2.5 py-0.5 ${diff.color} border-current/20`}>
            {diff.label}
          </span>
        </div>
      </div>

      {/* 临终之夜 */}
      <div className="bg-tavern-bg2/50 rounded-lg p-3 border border-tavern-gold/10">
        <div className="flex items-center gap-2 mb-1.5">
          <svg className="w-3.5 h-3.5 text-tavern-gold/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-tavern-muted font-serif-cn text-xs">临终之夜</p>
        </div>
        <p className="text-tavern-text/80 font-serif-cn text-xs leading-relaxed">
          {character.lastNight}
        </p>
      </div>

      {/* 标签 */}
      <div className="flex flex-wrap gap-1.5">
        {character.tags.map((tag) => (
          <span
            key={tag}
            className="text-[10px] font-serif-cn text-tavern-muted/80 bg-tavern-bg2/60 border border-tavern-gold/15 rounded-full px-2.5 py-0.5"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* 临终独白 */}
      <div className="relative">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-tavern-gold/40 font-serif-en text-lg leading-none">"</span>
          <p className="text-tavern-muted font-serif-cn text-xs">临终独白</p>
        </div>
        <p className="text-tavern-text/75 font-serif-cn text-sm italic leading-relaxed pl-3 border-l-2 border-tavern-gold/20">
          {character.quote}
        </p>
      </div>

      {/* 难度提示 */}
      <div className="bg-tavern-bg2/30 rounded-lg p-3 border border-tavern-gold/8">
        <div className="flex items-center gap-2 mb-1">
          <svg className="w-3.5 h-3.5 text-tavern-gold/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <p className="text-tavern-muted font-serif-cn text-xs">劝说难度</p>
          <span className={`text-[10px] font-serif-cn ml-auto ${diff.color}`}>
            {diff.label}
          </span>
        </div>
        <p className="text-tavern-text/60 font-serif-cn text-[11px] leading-relaxed">
          {diff.desc}
        </p>
      </div>

      {/* 史料锚点 */}
      <div className="flex items-start gap-2">
        <svg className="w-3.5 h-3.5 text-tavern-muted/50 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <div>
          <p className="text-tavern-muted/50 font-serif-cn text-[10px]">史料锚点</p>
          <p className="text-tavern-muted/70 font-serif-cn text-[10px] mt-0.5">
            {character.historicalAnchor}
          </p>
        </div>
      </div>

      {/* 对话状态 */}
      <div className="mt-auto pt-4 border-t border-tavern-gold/15 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-tavern-muted/70 font-serif-cn text-[10px]">对饮轮次</span>
          <span className="text-tavern-gold/80 font-serif-cn text-xs">{dialogueRound} / 12</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-tavern-muted/70 font-serif-cn text-[10px]">来客发言</span>
          <span className="text-tavern-text/60 font-serif-cn text-[10px]">{userMsgCount} 句</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-tavern-muted/70 font-serif-cn text-[10px]">角色回应</span>
          <span className="text-tavern-text/60 font-serif-cn text-[10px]">{charMsgCount} 句</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-tavern-muted/70 font-serif-cn text-[10px]">命运天平</span>
          <div className="flex items-center gap-1.5">
            <span className="text-tavern-muted/60 font-serif-cn text-[10px]">命运</span>
            <div className="w-16 h-1.5 bg-tavern-bg2 rounded-full overflow-hidden border border-tavern-gold/10">
              <div
                className="h-full bg-gradient-to-r from-tavern-gold/40 to-tavern-gold transition-all duration-700"
                style={{ width: `${Math.max(fateValue, 1)}%`, minWidth: '3px', opacity: fateValue === 0 ? 0.3 : 1 }}
              />
            </div>
            <span className="text-tavern-muted/60 font-serif-cn text-[10px]">改变</span>
          </div>
        </div>
        {fateValue > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-tavern-muted/70 font-serif-cn text-[10px]">当前倾向</span>
            <span className="text-tavern-gold/70 font-serif-cn text-[10px]">
              {fateValue >= 75 ? '几近改变' : fateValue >= 50 ? '有所动摇' : fateValue >= 25 ? '微有波澜' : '坚守命运'} ({fateValue}%)
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
