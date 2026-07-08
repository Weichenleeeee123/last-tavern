import { useEffect, useRef } from 'react';
import { useStore } from '../../store/useStore';

export function ChatArea() {
  const messages = useStore((s) => s.messages);
  const isGenerating = useStore((s) => s.isGenerating);
  const character = useStore((s) => s.currentCharacter);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isGenerating]);

  return (
    <div
      ref={scrollRef}
      className="flex-1 min-h-0 overflow-y-auto px-6 py-6 space-y-5 scroll-smooth styled-scroll"
    >
      {messages.length === 0 && !isGenerating && (
        <div className="text-center py-16">
          <p className="text-tavern-muted font-serif-cn text-sm">
            他正注视着你...
          </p>
        </div>
      )}

      {messages.length === 0 && isGenerating && (
        <div className="text-center py-16">
          <p className="text-tavern-muted font-serif-cn text-sm animate-pulse">
            他端起酒杯,缓缓开口...
          </p>
        </div>
      )}

      {messages.map((msg, i) => (
        <div
          key={msg.id}
          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} ${i === messages.length - 1 ? 'overlay-fade' : ''}`}
        >
          {/* 角色头像 (assistant) */}
          {msg.role === 'assistant' && character && (
            <div className="w-8 h-8 rounded-full overflow-hidden border border-tavern-gold/20 flex-shrink-0 mr-2 mt-1">
              <img
                src={character.portrait}
                alt={character.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}

          <div
            className={`max-w-[75%] px-4 py-3 ${
              msg.role === 'user'
                ? 'bg-tavern-bg2/80 text-tavern-text border border-tavern-gold/20 rounded-lg rounded-tr-sm'
                : 'bg-tavern-bg2/95 text-tavern-gold border border-tavern-gold/25 rounded-lg rounded-tl-sm'
            }`}
          >
            <p className="font-serif-cn text-sm leading-relaxed whitespace-pre-wrap">
              {msg.content}
            </p>
          </div>

          {/* 用户头像 */}
          {msg.role === 'user' && (
            <div className="w-8 h-8 rounded-full bg-tavern-bg2 border border-tavern-gold/15 flex-shrink-0 ml-2 mt-1 flex items-center justify-center">
              <svg className="w-4 h-4 text-tavern-muted/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7" />
              </svg>
            </div>
          )}
        </div>
      ))}

      {isGenerating && messages.length > 0 && (
        <div className="flex justify-start overlay-fade">
          {character && (
            <div className="w-8 h-8 rounded-full overflow-hidden border border-tavern-gold/20 flex-shrink-0 mr-2 mt-1">
              <img
                src={character.portrait}
                alt={character.name}
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </div>
          )}
          <div className="bg-tavern-bg2/95 text-tavern-muted border border-tavern-gold/25 rounded-lg rounded-tl-sm px-4 py-3">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-tavern-gold/40 animate-pulse" />
              <span className="w-1.5 h-1.5 rounded-full bg-tavern-gold/40 animate-pulse" style={{ animationDelay: '0.2s' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-tavern-gold/40 animate-pulse" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
