import { useState, useRef, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { useChat } from '../../hooks/useChat';
import { playSendSound } from '../../services/audio';

export function InputBar() {
  const [input, setInput] = useState('');
  const isGenerating = useStore((s) => s.isGenerating);
  const suggestions = useStore((s) => s.suggestions);
  const { sendMessage, endDialogue } = useChat();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSend = () => {
    if (!input.trim() || isGenerating) return;
    playSendSound();
    sendMessage(input.trim());
    setInput('');
  };

  const handleSuggestion = (text: string) => {
    if (isGenerating) return;
    playSendSound();
    sendMessage(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-tavern-gold/15 bg-tavern-bg2/70 flex-shrink-0">
      {/* 引导选项 */}
      {suggestions.length > 0 && !isGenerating && (
        <div className="px-4 pt-3 flex flex-wrap gap-2">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => handleSuggestion(s)}
              className="group flex items-center gap-1.5 bg-tavern-bg2/70 hover:bg-tavern-gold/15 border border-tavern-gold/20 hover:border-tavern-gold/45 rounded-lg px-3 py-1.5 transition-all"
            >
              <span className="text-tavern-gold/40 group-hover:text-tavern-gold/70 font-serif-cn text-[10px] transition-colors">
                {i + 1}
              </span>
              <span className="text-tavern-text/80 group-hover:text-tavern-gold font-serif-cn text-xs transition-colors">
                {s}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* 输入区 */}
      <div className="p-4 flex gap-2 items-end">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="说些什么..."
          rows={1}
          className="flex-1 bg-tavern-bg2/80 border border-tavern-gold/25 rounded-lg px-4 py-3 text-tavern-text font-serif-cn text-sm focus:border-tavern-gold/60 focus:bg-tavern-bg2 outline-none resize-none max-h-32 transition-colors placeholder:text-tavern-muted/50"
          disabled={isGenerating}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isGenerating}
          className="bg-tavern-gold/15 hover:bg-tavern-gold/25 disabled:opacity-20 text-tavern-gold font-serif-cn text-sm py-3 px-5 rounded-lg transition-all border border-tavern-gold/20 hover:border-tavern-gold/40"
        >
          举杯
        </button>
        <button
          onClick={endDialogue}
          disabled={isGenerating}
          className="bg-tavern-bg2/60 hover:bg-tavern-bg2 disabled:opacity-20 text-tavern-muted hover:text-tavern-gold/70 font-serif-cn text-sm py-3 px-4 rounded-lg transition-all border border-tavern-gold/10 hover:border-tavern-gold/20"
        >
          结束对饮
        </button>
      </div>
    </div>
  );
}
