import type { TavernTable } from '../../types';
import { CharacterCard } from './CharacterCard';

interface Props {
  table: TavernTable;
}

export function Table({ table }: Props) {
  return (
    <div className="relative">
      {/* 桌牌 */}
      <div className="text-center mb-4">
        <p className="text-tavern-gold font-serif-cn text-sm tracking-wider">
          {table.name}
        </p>
        <p className="text-tavern-muted font-serif-en text-xs italic">
          {table.nameEn}
        </p>
      </div>

      {/* 桌面 */}
      <div className="relative">
        {/* 油灯光晕 */}
        <div
          className="absolute -inset-8 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(244, 200, 66, 0.08) 0%, transparent 70%)',
          }}
        />

        {/* 桌子 */}
        <div className="relative bg-gradient-to-b from-tavern-bg2 to-tavern-bg border border-tavern-gold/20 rounded-lg p-4 shadow-xl">
          <div className="flex flex-wrap gap-4 justify-center">
            {table.characters.map((char) => (
              <CharacterCard key={char.id} character={char} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
