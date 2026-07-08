import type { Character } from '../../types';
import { useStore } from '../../store/useStore';
import { playSelectSound } from '../../services/audio';

interface Props {
  character: Character;
}

export function CharacterCard({ character }: Props) {
  const selectCharacter = useStore((s) => s.selectCharacter);
  const setScene = useStore((s) => s.setScene);
  const settings = useStore((s) => s.settings);
  const setShowSettings = useStore((s) => s.setShowSettings);

  const handleClick = () => {
    if (!settings.apiKey.trim()) {
      setShowSettings(true);
      return;
    }
    playSelectSound();
    selectCharacter(character);
    setScene('dialogue');
  };

  return (
    <div
      className="group relative cursor-pointer flex flex-col items-center"
      onClick={handleClick}
    >
      {/* Portrait */}
      <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-tavern-gold/25 group-hover:border-tavern-gold/70 transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(244,200,66,0.4)]">
        <div className="w-full h-full overflow-hidden bg-gradient-to-b from-tavern-bg2 to-tavern-bg">
          <img
            src={character.portrait}
            alt={character.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              const target = e.currentTarget;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = `<span class="text-tavern-gold/40 font-serif-cn text-lg flex items-center justify-center w-full h-full">${character.name[0]}</span>`;
              }
            }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-tavern-bg/60 via-transparent to-transparent" />
      </div>

      {/* Name */}
      <p className="text-tavern-text/60 group-hover:text-tavern-gold font-serif-cn text-[10px] md:text-xs text-center mt-1 transition-colors whitespace-nowrap max-w-[64px] truncate">
        {character.name}
      </p>
    </div>
  );
}
