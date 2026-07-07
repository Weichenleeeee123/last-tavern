import { useStore } from '../../store/useStore';

export function FateScale() {
  const fateValue = useStore((s) => s.fateState.value);

  return (
    <div className="px-4 py-2 border-t border-tavern-gold/5">
      <div className="flex items-center gap-3">
        <span className="text-tavern-muted font-serif-cn text-xs whitespace-nowrap">
          命运
        </span>
        <div className="flex-1 h-1.5 bg-tavern-bg2 rounded-full overflow-hidden relative">
          <div
            className="h-full bg-gradient-to-r from-tavern-gold/40 to-tavern-gold transition-all duration-700 ease-out"
            style={{ width: `${fateValue}%` }}
          />
        </div>
        <span className="text-tavern-muted font-serif-cn text-xs whitespace-nowrap">
          改变
        </span>
      </div>
      <p className="text-center text-tavern-muted/50 font-serif-cn text-xs mt-1">
        历史的引力
      </p>
    </div>
  );
}
