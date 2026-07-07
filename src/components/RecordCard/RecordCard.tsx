import { useRef } from 'react';
import html2canvas from 'html2canvas';
import { useStore } from '../../store/useStore';

export function RecordCard() {
  const recordCard = useStore((s) => s.recordCard);
  const setScene = useStore((s) => s.setScene);
  const clearMessages = useStore((s) => s.clearMessages);
  const resetRound = useStore((s) => s.resetRound);
  const resetFate = useStore((s) => s.resetFate);
  const setRecordCard = useStore((s) => s.setRecordCard);
  const cardRef = useRef<HTMLDivElement>(null);

  if (!recordCard) {
    return null;
  }

  const handleSave = async () => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#1a120b',
        scale: 2,
      });
      const link = document.createElement('a');
      link.download = `临终酒馆-${recordCard.characterName}-${recordCard.date}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch {
      alert('保存失败,请截图分享');
    }
  };

  const handleBack = () => {
    clearMessages();
    resetRound();
    resetFate();
    setRecordCard(null);
    setScene('hall');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 animate-fade-in overflow-y-auto">
      {/* 记录卡 */}
      <div
        ref={cardRef}
        className="bg-gradient-to-b from-tavern-bg2 to-tavern-bg border-2 border-tavern-gold/30 rounded-lg p-8 w-full max-w-sm shadow-2xl"
      >
        {/* 顶部铭牌 */}
        <div className="text-center border-b border-tavern-gold/20 pb-4">
          <p className="text-tavern-gold font-serif-cn text-lg tracking-wider">
            临终酒馆
          </p>
          <p className="text-tavern-muted font-serif-en text-xs italic">
            The Last Tavern
          </p>
          <p className="text-tavern-muted font-serif-cn text-xs mt-1">
            对饮记录 · {recordCard.date}
          </p>
        </div>

        {/* 人物区 */}
        <div className="flex items-center gap-4 py-4 border-b border-tavern-gold/20">
          <div className="w-16 h-16 rounded-lg overflow-hidden border border-tavern-gold/20 bg-tavern-bg flex items-center justify-center flex-shrink-0">
            <span className="text-tavern-gold/40 font-serif-cn text-xl">
              {recordCard.characterName[0]}
            </span>
          </div>
          <div>
            <p className="text-tavern-gold font-serif-cn text-base">
              {recordCard.characterName}
            </p>
            <p className="text-tavern-muted font-serif-en text-xs italic">
              {recordCard.characterNameEn}
            </p>
            <p className="text-tavern-text/60 font-serif-cn text-xs">
              {recordCard.era}
            </p>
          </div>
        </div>

        {/* 临终独白 */}
        <div className="py-3 border-b border-tavern-gold/20">
          <p className="text-tavern-text/70 font-serif-cn text-sm italic text-center">
            "{recordCard.quote}"
          </p>
        </div>

        {/* 三段式核心 */}
        <div className="py-4 space-y-4">
          <div>
            <p className="text-tavern-gold font-serif-cn text-xs mb-1">
              你试图改变的
            </p>
            <p className="text-tavern-text/80 font-serif-cn text-sm leading-relaxed">
              {recordCard.userAppeal}
            </p>
          </div>

          <div className="border-t border-tavern-gold/10 pt-3">
            <p className="text-tavern-gold font-serif-cn text-xs mb-1">
              他坚持的
            </p>
            <p className="text-tavern-text/80 font-serif-cn text-sm leading-relaxed">
              {recordCard.characterInsist}
            </p>
          </div>

          <div className="border-t border-tavern-gold/10 pt-3">
            <p className="text-tavern-gold font-serif-cn text-xs mb-1">
              史书上的结局
            </p>
            <p className="text-tavern-muted font-serif-cn text-sm leading-relaxed">
              {recordCard.realEnding}
            </p>
          </div>
        </div>

        {/* 底部印记 */}
        <div className="border-t border-tavern-gold/20 pt-4 text-center">
          <p className="text-tavern-muted font-serif-cn text-xs">
            对饮 {recordCard.dialogueRound} 轮
          </p>
          <p className="text-tavern-text/50 font-serif-cn text-xs italic mt-2">
            历史不可重来,但理解可以发生
          </p>
          <p className="text-tavern-gold/20 font-serif-en text-2xl mt-2">
            ☩
          </p>
        </div>
      </div>

      {/* 操作按钮(不包含在截图内) */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
        <button
          onClick={handleSave}
          className="bg-tavern-gold/20 hover:bg-tavern-gold/30 text-tavern-gold font-serif-cn text-sm py-2 px-6 rounded-lg transition-colors"
        >
          保存为图片
        </button>
        <button
          onClick={handleBack}
          className="bg-tavern-bg2 hover:bg-tavern-bg text-tavern-muted font-serif-cn text-sm py-2 px-6 rounded-lg transition-colors border border-tavern-gold/10"
        >
          再饮一杯
        </button>
      </div>
    </div>
  );
}
