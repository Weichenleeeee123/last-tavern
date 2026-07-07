import { useEffect, useRef } from 'react';
import { useStore } from '../../store/useStore';

export function ChatArea() {
  const messages = useStore((s) => s.messages);
  const isGenerating = useStore((s) => s.isGenerating);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isGenerating]);

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scroll-smooth"
    >
      {messages.length === 0 && (
        <div className="text-center py-12">
          <p className="text-tavern-muted font-serif-cn text-sm">
            他正坐在对面,等待你开口...
          </p>
        </div>
      )}

      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[75%] px-4 py-3 rounded-lg ${
              msg.role === 'user'
                ? 'bg-tavern-bg2/60 text-tavern-text border border-tavern-gold/10'
                : 'bg-tavern-bg2 text-tavern-gold border border-tavern-gold/20'
            }`}
          >
            <p className="font-serif-cn text-sm leading-relaxed whitespace-pre-wrap">
              {msg.content}
            </p>
          </div>
        </div>
      ))}

      {isGenerating && (
        <div className="flex justify-start">
          <div className="bg-tavern-bg2 text-tavern-muted border border-tavern-gold/20 px-4 py-3 rounded-lg">
            <p className="font-serif-cn text-sm italic">
              他正在斟酒...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
