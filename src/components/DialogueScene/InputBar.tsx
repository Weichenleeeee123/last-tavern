import { useState, useRef, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { useChat } from '../../hooks/useChat';

export function InputBar() {
  const [input, setInput] = useState('');
  const isGenerating = useStore((s) => s.isGenerating);
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
    sendMessage(input.trim());
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-tavern-gold/10 p-4">
      <div className="flex gap-2 items-end">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="说些什么..."
          rows={1}
          className="flex-1 bg-tavern-bg2 border border-tavern-gold/20 rounded-lg px-4 py-3 text-tavern-text font-serif-cn text-sm focus:border-tavern-gold/50 outline-none resize-none max-h-32"
          disabled={isGenerating}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isGenerating}
          className="bg-tavern-gold/20 hover:bg-tavern-gold/30 disabled:opacity-30 text-tavern-gold font-serif-cn text-sm py-3 px-6 rounded-lg transition-colors"
        >
          举杯
        </button>
        <button
          onClick={endDialogue}
          disabled={isGenerating}
          className="bg-tavern-bg2 hover:bg-tavern-bg text-tavern-muted disabled:opacity-30 font-serif-cn text-sm py-3 px-4 rounded-lg transition-colors border border-tavern-gold/10"
        >
          结束对饮
        </button>
      </div>
    </div>
  );
}
