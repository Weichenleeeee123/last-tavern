import { useStore } from '../../store/useStore';

export function FateScale() {
  const fateValue = useStore((s) => s.fateState.value);
  const dialogueRound = useStore((s) => s.dialogueRound);

  return (
    <div className="px-6 py-3 border-t border-tavern-gold/10 bg-tavern-bg/40 flex-shrink-0">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <svg className="w-3.5 h-3.5 text-tavern-muted/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9m6-9l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-3 9" />
          </svg>
          <span className="text-tavern-muted font-serif-cn text-[10px]">命运之秤</span>
        </div>
        <span className="text-tavern-muted/50 font-serif-cn text-[10px]">
          第 {dialogueRound} / 12 轮
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-tavern-muted/60 font-serif-cn text-[10px] whitespace-nowrap w-8 text-right">
          命运
        </span>
        <div className="flex-1 h-2.5 bg-tavern-bg2 rounded-full overflow-hidden relative border border-tavern-gold/10">
          {/* 中线 */}
          <div className="absolute top-0 bottom-0 left-1/2 w-px bg-tavern-gold/15 z-10" />
          {/* 进度条 - 最小宽度 2px 保证可见 */}
          <div
            className="h-full transition-all duration-700 ease-out rounded-full"
            style={{
              width: `${Math.max(fateValue, 1)}%`,
              minWidth: '4px',
              background: fateValue < 30
                ? 'linear-gradient(90deg, rgba(201,168,76,0.3) 0%, rgba(201,168,76,0.5) 100%)'
                : fateValue < 60
                ? 'linear-gradient(90deg, rgba(201,168,76,0.5) 0%, rgba(244,200,66,0.6) 100%)'
                : 'linear-gradient(90deg, rgba(244,200,66,0.6) 0%, rgba(255,180,66,0.8) 100%)',
              opacity: fateValue === 0 ? 0.3 : 1,
            }}
          />
        </div>
        <span className="text-tavern-muted/60 font-serif-cn text-[10px] whitespace-nowrap w-8">
          改变
        </span>
      </div>
      <div className="flex items-center justify-center gap-2 mt-1.5">
        <span className="text-tavern-muted/40 font-serif-cn text-[10px]">
          倾向: {fateValue < 30 ? '坚守命运' : fateValue < 60 ? '有所动摇' : '濒临改变'} ({fateValue}%)
        </span>
      </div>
    </div>
  );
}
