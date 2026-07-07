import { useCallback } from 'react';
import { useStore } from '../store/useStore';
import { sendChatMessage, generateSummary } from '../services/llm';
import type { RecordCardData } from '../types';

const MAX_ROUNDS = 12;

export function useChat() {
  const {
    currentCharacter,
    messages,
    isGenerating,
    setGenerating,
    incrementRound,
    settings,
    fateState,
    updateFate,
    addMessage,
    setRecordCard,
    setScene,
  } = useStore();

  // 注意:endDialogue 必须先于 sendMessage 定义,
  // 否则 sendMessage 中引用 endDialogue 会因 const 暂时性死区(TDZ)而抛出运行时错误。
  const endDialogue = useCallback(async () => {
    if (!currentCharacter) return;

    setGenerating(true);
    try {
      const summary = await generateSummary(settings, currentCharacter, messages);
      const recordCard: RecordCardData = {
        characterId: currentCharacter.id,
        characterName: currentCharacter.name,
        characterNameEn: currentCharacter.nameEn,
        era: currentCharacter.era,
        quote: currentCharacter.quote,
        portrait: currentCharacter.portrait,
        userAppeal: summary.userAppeal,
        characterInsist: summary.characterInsist,
        realEnding: currentCharacter.realEnding,
        dialogueRound: useStore.getState().dialogueRound,
        date: new Date().toLocaleDateString('zh-CN'),
      };
      setRecordCard(recordCard);
      setScene('record');
    } catch {
      // 降级:直接用静态数据,从最后一条消息中截取摘要
      const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
      const lastAssistantMsg = [...messages].reverse().find(m => m.role === 'assistant');
      const recordCard: RecordCardData = {
        characterId: currentCharacter.id,
        characterName: currentCharacter.name,
        characterNameEn: currentCharacter.nameEn,
        era: currentCharacter.era,
        quote: currentCharacter.quote,
        portrait: currentCharacter.portrait,
        userAppeal: lastUserMsg?.content.slice(0, 50) || '未能提取',
        characterInsist: lastAssistantMsg?.content.slice(0, 50) || '未能提取',
        realEnding: currentCharacter.realEnding,
        dialogueRound: useStore.getState().dialogueRound,
        date: new Date().toLocaleDateString('zh-CN'),
      };
      setRecordCard(recordCard);
      setScene('record');
    } finally {
      setGenerating(false);
    }
  }, [currentCharacter, messages, settings, setRecordCard, setScene, setGenerating]);

  const sendMessage = useCallback(async (content: string) => {
    if (!currentCharacter || isGenerating) return;
    if (!settings.apiKey) {
      useStore.getState().setShowSettings(true);
      return;
    }

    // 添加用户消息
    const userMsg = {
      id: crypto.randomUUID(),
      role: 'user' as const,
      content,
      timestamp: Date.now(),
    };
    addMessage(userMsg);
    setGenerating(true);

    // 更新命运之秤:用户劝说推动向"改变"倾斜
    const newFate = Math.min(100, fateState.value + 15);
    updateFate(newFate);

    try {
      const response = await sendChatMessage(
        settings,
        currentCharacter.systemPrompt,
        messages,
        content
      );

      // 添加人物回应
      const assistantMsg = {
        id: crypto.randomUUID(),
        role: 'assistant' as const,
        content: response,
        timestamp: Date.now(),
      };
      addMessage(assistantMsg);
      incrementRound();

      // 人物回应后,命运之秤弹回"命运"侧
      const pulledBack = Math.max(0, newFate - 20);
      updateFate(pulledBack);

      // 通过 getState() 读取最新轮次,避免闭包中的陈旧值
      const currentRound = useStore.getState().dialogueRound;
      if (currentRound >= MAX_ROUNDS) {
        await endDialogue();
      }
    } catch {
      // 友好错误处理:不暴露底层异常,以酒馆氛围语提示用户重试
      const errorMsg = {
        id: crypto.randomUUID(),
        role: 'assistant' as const,
        content: '...酒馆的烛火似乎摇晃了一下。请再说一次。',
        timestamp: Date.now(),
      };
      addMessage(errorMsg);
    } finally {
      setGenerating(false);
    }
  }, [currentCharacter, isGenerating, messages, settings, fateState, addMessage, setGenerating, incrementRound, updateFate, endDialogue]);

  return { sendMessage, endDialogue };
}
