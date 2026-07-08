import { useEffect, useRef } from 'react';
import { useStore } from '../../store/useStore';
import { useChat } from '../../hooks/useChat';
import { CharacterInfo } from './CharacterInfo';
import { ChatArea } from './ChatArea';
import { InputBar } from './InputBar';
import { FateScale } from './FateScale';
import { CandleParticles } from '../shared/CandleParticles';

export function DialogueScene() {
  const character = useStore((s) => s.currentCharacter);
  const messages = useStore((s) => s.messages);
  const setScene = useStore((s) => s.setScene);
  const { initiateDialogue } = useChat();
  const hasInitiated = useRef(false);

  // 角色主动开口：进入对话时如果没有消息，自动触发角色开场白
  useEffect(() => {
    if (character && messages.length === 0 && !hasInitiated.current) {
      hasInitiated.current = true;
      initiateDialogue();
    }
  }, [character, messages.length, initiateDialogue]);

  if (!character) {
    setScene('hall');
    return null;
  }

  const handleBack = () => {
    // 离席：保存当前对话记录，不清除
    useStore.getState().saveConversation(character.id);
    setScene('hall');
  };

  return (
    <div className="fixed inset-0 z-50 overlay-backdrop overlay-in flex flex-col">
      <CandleParticles count={10} />

      {/* Close button */}
      <button
        onClick={handleBack}
        className="absolute top-4 left-4 z-10 text-tavern-muted hover:text-tavern-gold transition-colors flex items-center gap-2 group"
      >
        <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span className="font-serif-cn text-sm">离席</span>
      </button>

      {/* Desktop layout */}
      <div className="hidden md:flex flex-1 overflow-hidden min-h-0">
        {/* Left: Character info */}
        <div className="w-[32%] flex flex-col p-6 pt-16 overflow-y-auto styled-scroll border-r border-tavern-gold/10">
          <CharacterInfo />
        </div>

        {/* Right: Dialogue area */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <ChatArea />
          <div className="flex-shrink-0">
            <FateScale />
            <InputBar />
          </div>
        </div>
      </div>

      {/* Mobile layout */}
      <div className="md:hidden flex-1 flex flex-col overflow-hidden min-h-0">
        {/* Character header */}
        <div className="flex items-center gap-3 p-3 pt-12 border-b border-tavern-gold/10 flex-shrink-0">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-tavern-gold/30 flex-shrink-0">
            <img
              src={character.portrait}
              alt={character.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = `<span class="text-tavern-gold/40 font-serif-cn text-sm flex items-center justify-center w-full h-full">${character.name[0]}</span>`;
                }
              }}
            />
          </div>
          <div className="min-w-0">
            <p className="text-tavern-gold font-serif-cn text-sm truncate">{character.name}</p>
            <p className="text-tavern-muted font-serif-en text-xs italic truncate">{character.nameEn}</p>
          </div>
        </div>

        <ChatArea />
        <div className="flex-shrink-0">
          <FateScale />
          <InputBar />
        </div>
      </div>
    </div>
  );
}
