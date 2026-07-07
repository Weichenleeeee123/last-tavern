import { useStore } from '../../store/useStore';

export function CharacterInfo() {
  const character = useStore((s) => s.currentCharacter);
  if (!character) return null;

  return (
    <div className="flex flex-col items-center text-center">
      {/* 肖像 */}
      <div className="w-32 h-32 md:w-40 md:h-40 rounded-lg overflow-hidden border-2 border-tavern-gold/30 candle-glow mb-4">
        <div className="w-full h-full bg-gradient-to-b from-tavern-bg2 to-tavern-bg flex items-center justify-center">
          <span className="text-tavern-gold/40 font-serif-cn text-4xl">
            {character.name[0]}
          </span>
        </div>
      </div>

      {/* 姓名 */}
      <h2 className="text-tavern-gold font-serif-cn text-xl mb-1">
        {character.name}
      </h2>
      <p className="text-tavern-muted font-serif-en text-sm italic mb-3">
        {character.nameEn}
      </p>

      {/* 临终独白 */}
      <p className="text-tavern-text/70 font-serif-cn text-sm italic mb-4 px-2">
        "{character.quote}"
      </p>

      {/* 信息 */}
      <div className="space-y-2 text-left w-full">
        <div className="border-t border-tavern-gold/10 pt-2">
          <p className="text-tavern-muted font-serif-cn text-xs">
            时代
          </p>
          <p className="text-tavern-text/80 font-serif-cn text-sm">
            {character.era} · {character.year > 0 ? character.year : `前${-character.year}`}年
          </p>
        </div>
        <div>
          <p className="text-tavern-muted font-serif-cn text-xs">
            最后一夜
          </p>
          <p className="text-tavern-text/80 font-serif-cn text-sm">
            {character.lastNight}
          </p>
        </div>
        <div>
          <p className="text-tavern-muted font-serif-cn text-xs">
            史料锚点
          </p>
          <p className="text-tavern-text/80 font-serif-en text-sm italic">
            {character.historicalAnchor}
          </p>
        </div>
      </div>
    </div>
  );
}
