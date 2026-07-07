import type { Character } from '../../types';
import { useStore } from '../../store/useStore';

interface Props {
  character: Character;
}

export function CharacterCard({ character }: Props) {
  const selectCharacter = useStore((s) => s.selectCharacter);
  const setScene = useStore((s) => s.setScene);

  const handleClick = () => {
    selectCharacter(character);
    setScene('dialogue');
  };

  return (
    <div
      className="group relative cursor-pointer transition-all duration-500 hover:scale-105"
      onClick={handleClick}
    >
      {/* 肖像 */}
      <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden border-2 border-tavern-gold/20 group-hover:border-tavern-gold/60 transition-colors candle-glow">
        <div className="w-full h-full overflow-hidden bg-gradient-to-b from-tavern-bg2 to-tavern-bg">
          <img
            src={character.portrait}
            alt={character.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.currentTarget;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = `<span class="text-tavern-gold/40 font-serif-cn text-2xl flex items-center justify-center w-full h-full">${character.name[0]}</span>`;
              }
            }}
          />
        </div>
        {/* 暗角覆盖 */}
        <div className="absolute inset-0 bg-gradient-to-t from-tavern-bg/80 via-transparent to-transparent" />
      </div>

      {/* 悬停信息 */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
        <p className="text-tavern-gold font-serif-cn text-sm text-center whitespace-nowrap">
          {character.name}
        </p>
        <p className="text-tavern-muted font-serif-en text-xs text-center italic">
          {character.nameEn}
        </p>
        <p className="text-tavern-text/60 font-serif-cn text-xs text-center mt-1 italic">
          "{character.quote}"
        </p>
      </div>

      {/* 始终显示的名字 */}
      <p className="text-tavern-text/80 font-serif-cn text-xs text-center mt-2">
        {character.name}
      </p>
    </div>
  );
}
