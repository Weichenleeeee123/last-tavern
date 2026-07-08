import type { TavernTable } from '../../types';
import { CharacterCard } from './CharacterCard';

interface Props {
  table: TavernTable;
}

export function Table({ table }: Props) {
  const chars = table.characters;
  const count = chars.length;
  // 人物围绕桌子的半径（百分比）
  const charRadius = count <= 2 ? 32 : count === 3 ? 34 : count === 4 ? 36 : 38;

  return (
    <div className="relative flex flex-col items-center">
      {/* Table name banner */}
      <div className="relative text-center mb-5">
        <div className="flex items-center justify-center gap-3 mb-1">
          <span className="h-px w-8 bg-gradient-to-r from-transparent to-tavern-gold/30" />
          <p className="text-tavern-gold font-serif-cn text-base tracking-[0.3em]">
            {table.name}
          </p>
          <span className="h-px w-8 bg-gradient-to-l from-transparent to-tavern-gold/30" />
        </div>
        <p className="text-tavern-muted/70 font-serif-en text-[10px] italic tracking-widest">
          {table.nameEn}
        </p>
      </div>

      {/* Table area */}
      <div className="relative w-full max-w-[300px]" style={{ aspectRatio: '1 / 0.85' }}>
        {/* Ambient warm glow */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(244, 200, 66, 0.06) 0%, rgba(180, 120, 40, 0.02) 40%, transparent 70%)',
          }}
        />

        {/* === Table (椭圆形俯视) === */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[55%]">
          {/* 桌面阴影 */}
          <div
            className="absolute inset-0 rounded-[50%] translate-y-2"
            style={{
              background: 'radial-gradient(ellipse, rgba(0,0,0,0.5) 0%, transparent 70%)',
              filter: 'blur(6px)',
            }}
          />

          {/* 桌面主体 - 俯视椭圆木桌 */}
          <div
            className="relative w-full h-full rounded-[50%] overflow-hidden"
            style={{
              background: `
                radial-gradient(ellipse at 45% 35%, #7a5630 0%, #6b4a2a 15%, #5a3d1e 35%, #4a3220 60%, #3a2615 85%, #2a1a0e 100%)
              `,
              boxShadow: `
                0 8px 32px rgba(0,0,0,0.7),
                inset 0 4px 12px rgba(255,200,100,0.1),
                inset 0 -8px 20px rgba(0,0,0,0.5),
                inset 0 0 0 3px rgba(100,70,30,0.25),
                inset 0 0 0 6px rgba(60,40,15,0.15)
              `,
            }}
          >
            {/* 木纹同心圆 */}
            <div
              className="absolute inset-3 rounded-[50%] opacity-25"
              style={{
                border: '1px solid rgba(60,40,20,0.4)',
                boxShadow: 'inset 0 0 0 4px rgba(80,55,25,0.12), inset 0 0 0 8px rgba(60,40,20,0.08), inset 0 0 0 12px rgba(80,55,25,0.06)',
              }}
            />

            {/* 桌面高光 */}
            <div
              className="absolute inset-0 rounded-[50%] pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at 40% 25%, rgba(255,220,150,0.1) 0%, transparent 40%)',
              }}
            />

            {/* 桌面磨损划痕 */}
            <div
              className="absolute inset-0 rounded-[50%] pointer-events-none opacity-15"
              style={{
                backgroundImage: `
                  linear-gradient(15deg, transparent 48%, rgba(30,20,10,0.4) 49%, transparent 50%),
                  linear-gradient(-25deg, transparent 30%, rgba(30,20,10,0.3) 31%, transparent 32%),
                  linear-gradient(45deg, transparent 65%, rgba(30,20,10,0.2) 66%, transparent 67%)
                `,
              }}
            />

            {/* 中心蜡烛 */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="relative flex flex-col items-center">
                {/* 火焰光晕 */}
                <div
                  className="absolute -top-4 w-10 h-10 rounded-full pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle, rgba(244, 200, 66, 0.5) 0%, rgba(244, 200, 66, 0.15) 40%, transparent 70%)',
                    filter: 'blur(6px)',
                  }}
                />
                {/* 火焰 */}
                <div
                  className="relative w-2 h-3 rounded-full candle-flicker-anim"
                  style={{
                    background: 'linear-gradient(180deg, #fff5d4 0%, #f4c842 30%, #e89c2a 70%, transparent 100%)',
                    boxShadow: '0 0 10px rgba(244, 200, 66, 0.8), 0 0 20px rgba(244, 200, 66, 0.4)',
                  }}
                />
                {/* 烛芯 */}
                <div className="w-px h-0.5 bg-amber-900/60" />
                {/* 蜡烛体 */}
                <div
                  className="w-2 h-4 rounded-sm"
                  style={{
                    background: 'linear-gradient(180deg, #f0e4c8 0%, #d4b87a 50%, #a8884a 100%)',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.4), inset 0 0 2px rgba(244,200,66,0.3)',
                  }}
                />
                {/* 黄铜烛台 */}
                <div
                  className="w-4 h-1.5 rounded-sm -mt-px"
                  style={{
                    background: 'linear-gradient(180deg, #c9a84c 0%, #8a6e2a 50%, #5a4a1a 100%)',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,220,100,0.2)',
                  }}
                />
              </div>
            </div>

            {/* 每人面前一个酒杯 */}
            {chars.map((_, i) => {
              const angle = (i / count) * 2 * Math.PI - Math.PI / 2 + Math.PI / count;
              const gobletR = 38;
              const gx = 50 + gobletR * Math.cos(angle);
              const gy = 50 + gobletR * Math.sin(angle) * 0.75; // 椭圆比例
              return (
                <div
                  key={i}
                  className="absolute"
                  style={{ left: `${gx}%`, top: `${gy}%`, transform: 'translate(-50%, -50%)' }}
                >
                  {/* 酒杯 */}
                  <div className="relative flex flex-col items-center">
                    {/* 杯口 */}
                    <div
                      className="w-2.5 h-0.5 rounded-full"
                      style={{ background: 'rgba(201,168,76,0.35)', boxShadow: '0 0 2px rgba(244,200,66,0.2)' }}
                    />
                    {/* 杯身 */}
                    <div
                      className="w-2 h-1.5 rounded-b-full"
                      style={{
                        background: 'linear-gradient(180deg, rgba(201,168,76,0.3) 0%, rgba(120,90,30,0.25) 100%)',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
                      }}
                    />
                    {/* 杯柄 */}
                    <div className="w-px h-1" style={{ background: 'rgba(201,168,76,0.25)' }} />
                    {/* 杯底 */}
                    <div className="w-2 h-0.5 rounded-full" style={{ background: 'rgba(201,168,76,0.2)' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* === 人物围坐 === */}
        {chars.map((char, i) => {
          const angle = (i / count) * 2 * Math.PI - Math.PI / 2;
          const x = 50 + charRadius * Math.cos(angle);
          const y = 50 + charRadius * Math.sin(angle) * 0.85; // 椭圆比例
          return (
            <div
              key={char.id}
              className="char-seat absolute"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <CharacterCard character={char} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
