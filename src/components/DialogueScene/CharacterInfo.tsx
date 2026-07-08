import { useStore } from '../../store/useStore';

const difficultyLabels: Record<string, { label: string; color: string }> = {
  extreme: { label: '极难', color: 'text-red-400/80' },
  high: { label: '困难', color: 'text-orange-400/70' },
  medium: { label: '中等', color: 'text-yellow-400/60' },
  low: { label: '温和', color: 'text-green-400/50' },
};

export function CharacterInfo() {
  const character = useStore((s) => s.currentCharacter);
  const dialogueRound = useStore((s) => s.dialogueRound);
  const fateValue = useStore((s) => s.fateState.value);

  if (!character) return null;

  const diff = difficultyLabels[character.difficulty] || difficultyLabels.medium;

  return (
    <div className="flex flex-col gap-5">
      {/* 肖像 + 姓名 */}
      <div className="relative flex flex-col items-center pb-4 border-b border-tavern-gold/10">
        {/* 肖像框 */}
        <div className="relative">
          {/* 光晕 */}
          <div
            className="absolute -inset-3 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(244,200,66,0.08) 0%, transparent 70%)',
            }}
          />
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-tavern-gold/30 shadow-lg">
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
            {/* 暗角 */}
            <div className="absolute inset-0 rounded-full pointer-events-none" style={{ boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)' }} />
          </div>
        </div>

        {/* 姓名 */}
        <h2 className="text-tavern-gold font-serif-cn text-xl mt-3 text-glow">
          {character.name}
        </h2>
        <p className="text-tavern-muted font-serif-en text-xs italic tracking-wide">
          {character.nameEn}
        </p>
      </div>

      {/* 临终之夜 */}
      <div className="bg-tavern-bg2/40 rounded-lg p-3 border border-tavern-gold/5">
        <div className="flex items-center gap-2 mb-1.5">
          <svg className="w-3.5 h-3.5 text-tavern-gold/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-tavern-muted font-serif-cn text-xs">临终之夜</p>
        </div>
        <p className="text-tavern-text/70 font-serif-cn text-xs leading-relaxed">
          {character.lastNight}
        </p>
        <p className="text-tavern-gold/40 font-serif-en text-xs mt-1">
          {character.year}
        </p>
      </div>

      {/* 标签 */}
      <div className="flex flex-wrap gap-1.5">
        {character.tags.map((tag) => (
          <span
            key={tag}
            className="text-[10px] font-serif-cn text-tavern-muted/70 bg-tavern-bg2/60 border border-tavern-gold/10 rounded-full px-2.5 py-0.5"
          >
            {tag}
          </span>
        ))}
        <span className={`text-[10px] font-serif-cn border rounded-full px-2.5 py-0.5 ${diff.color} border-current/20`}>
          {diff.label}
        </span>
      </div>

      {/* 临终独白 */}
      <div className="relative">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-tavern-gold/30 font-serif-en text-lg leading-none">"</span>
          <p className="text-tavern-muted font-serif-cn text-xs">临终独白</p>
        </div>
        <p className="text-tavern-text/60 font-serif-cn text-sm italic leading-relaxed pl-3 border-l-2 border-tavern-gold/15">
          {character.quote}
        </p>
      </div>

      {/* 史料锚点 */}
      <div className="flex items-center gap-2">
        <svg className="w-3.5 h-3.5 text-tavern-muted/40 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-tavern-muted/40 font-serif-cn text-[10px]">
          史料锚点：{character.historicalAnchor}
        </p>
      </div>

      {/* 对话状态 */}
      <div className="mt-auto pt-4 border-t border-tavern-gold/10 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-tavern-muted/60 font-serif-cn text-[10px]">对饮轮次</span>
          <span className="text-tavern-gold/70 font-serif-cn text-xs">{dialogueRound} / 12</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-tavern-muted/60 font-serif-cn text-[10px]">命运天平</span>
          <div className="flex items-center gap-1.5">
            <span className="text-tavern-muted/50 font-serif-cn text-[10px]">命运</span>
            <div className="w-16 h-1.5 bg-tavern-bg2 rounded-full overflow-hidden border border-tavern-gold/10">
              <div
                className="h-full bg-gradient-to-r from-tavern-gold/40 to-tavern-gold transition-all duration-700"
                style={{ width: `${Math.max(fateValue, 1)}%`, minWidth: '3px', opacity: fateValue === 0 ? 0.3 : 1 }}
              />
            </div>
            <span className="text-tavern-muted/50 font-serif-cn text-[10px]">改变</span>
          </div>
        </div>
      </div>
    </div>
  );
}
