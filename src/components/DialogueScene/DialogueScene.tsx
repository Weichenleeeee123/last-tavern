import { useStore } from '../../store/useStore';
import { CharacterInfo } from './CharacterInfo';
import { ChatArea } from './ChatArea';
import { InputBar } from './InputBar';
import { FateScale } from './FateScale';
import { CandleParticles } from '../shared/CandleParticles';
import { Vignette } from '../shared/Vignette';

export function DialogueScene() {
  const character = useStore((s) => s.currentCharacter);
  const setScene = useStore((s) => s.setScene);
  const clearMessages = useStore((s) => s.clearMessages);
  const resetRound = useStore((s) => s.resetRound);
  const resetFate = useStore((s) => s.resetFate);

  if (!character) {
    setScene('hall');
    return null;
  }

  const handleBack = () => {
    clearMessages();
    resetRound();
    resetFate();
    setScene('hall');
  };

  return (
    <div className="relative min-h-screen bg-tavern-bg overflow-hidden animate-fade-in">
      <CandleParticles count={15} />
      <Vignette />

      {/* 返回按钮 */}
      <button
        onClick={handleBack}
        className="fixed top-4 left-4 z-30 text-tavern-muted hover:text-tavern-gold transition-colors flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span className="font-serif-cn text-sm">离席</span>
      </button>

      {/* 主布局:左35%人物信息,右65%对话 */}
      <div className="relative z-20 flex h-screen pt-16">
        {/* 左侧 */}
        <div className="w-full md:w-[35%] p-6 overflow-y-auto border-r border-tavern-gold/10">
          <CharacterInfo />
        </div>

        {/* 右侧 */}
        <div className="hidden md:flex md:w-[65%] flex-col">
          <ChatArea />
          <FateScale />
          <InputBar />
        </div>
      </div>

      {/* 移动端对话区 */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-[60vh] flex flex-col bg-tavern-bg/95">
        <ChatArea />
        <FateScale />
        <InputBar />
      </div>
    </div>
  );
}
