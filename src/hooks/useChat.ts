import { useCallback } from 'react';
import { useStore } from '../store/useStore';
import { sendChatMessage, generateSummary } from '../services/llm';
import { playReceiveSound } from '../services/audio';
import type { RecordCardData } from '../types';

const MAX_ROUNDS = 12;

// 角色开场白提示词
const OPENING_PROMPT = `（一位陌生来客推开了酒馆的门，缓步走向你并坐下。你注视着此人，决定先开口。）

请先用3-4句话简要讲述你一生的故事和成就——你是谁，你经历了什么，你为何名垂青史。让来客了解你的生平背景。然后用1-2句话回到当下——今夜是你人生的最后一夜，你会对这位来客说什么。

总计控制在5-6句话。保持你的语言风格和身份特征。

最后附上3个来客可能的回应选项（格式如系统提示中的|||分隔）。`;

/** 从 LLM 回复中解析正文和建议选项 */
function parseResponse(raw: string): { content: string; suggestions: string[] } {
  const parts = raw.split('|||');
  const content = parts[0].trim();
  const suggestions = parts.slice(1)
    .map(s => s.trim())
    .filter(s => s.length > 0 && s.length <= 50)
    .slice(0, 3);
  return { content, suggestions };
}

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
    setSuggestions,
    setRecordCard,
    setScene,
  } = useStore();

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
      useStore.getState().clearConversation(currentCharacter.id);
      setRecordCard(recordCard);
      setScene('record');
    } catch {
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
      useStore.getState().clearConversation(currentCharacter.id);
      setRecordCard(recordCard);
      setScene('record');
    } finally {
      setGenerating(false);
    }
  }, [currentCharacter, messages, settings, setRecordCard, setScene, setGenerating]);

  // 角色主动开口
  const initiateDialogue = useCallback(async () => {
    if (!currentCharacter || isGenerating) return;
    if (!settings.apiKey) {
      useStore.getState().setShowSettings(true);
      return;
    }

    setGenerating(true);
    setSuggestions([]);
    try {
      const raw = await sendChatMessage(
        settings,
        currentCharacter.systemPrompt,
        [],
        OPENING_PROMPT
      );

      const { content, suggestions } = parseResponse(raw);

      const assistantMsg = {
        id: crypto.randomUUID(),
        role: 'assistant' as const,
        content,
        timestamp: Date.now(),
      };
      addMessage(assistantMsg);
      setSuggestions(suggestions);
      playReceiveSound();
    } catch {
      const errorMsg = {
        id: crypto.randomUUID(),
        role: 'assistant' as const,
        content: '...（他看了你一眼，端起酒杯，却没有说话。烛火在你们之间摇晃。）',
        timestamp: Date.now(),
      };
      addMessage(errorMsg);
    } finally {
      setGenerating(false);
    }
  }, [currentCharacter, isGenerating, settings, addMessage, setSuggestions, setGenerating]);

  const sendMessage = useCallback(async (content: string) => {
    if (!currentCharacter || isGenerating) return;
    if (!settings.apiKey) {
      useStore.getState().setShowSettings(true);
      return;
    }

    const userMsg = {
      id: crypto.randomUUID(),
      role: 'user' as const,
      content,
      timestamp: Date.now(),
    };
    addMessage(userMsg);
    setSuggestions([]);
    setGenerating(true);

    const newFate = Math.min(100, fateState.value + 15);
    updateFate(newFate);

    try {
      const raw = await sendChatMessage(
        settings,
        currentCharacter.systemPrompt,
        messages,
        content
      );

      const { content: respContent, suggestions } = parseResponse(raw);

      const assistantMsg = {
        id: crypto.randomUUID(),
        role: 'assistant' as const,
        content: respContent,
        timestamp: Date.now(),
      };
      addMessage(assistantMsg);
      setSuggestions(suggestions);
      playReceiveSound();
      incrementRound();

      const pulledBack = Math.max(0, newFate - 20);
      updateFate(pulledBack);

      const currentRound = useStore.getState().dialogueRound;
      if (currentRound >= MAX_ROUNDS) {
        await endDialogue();
      }
    } catch {
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
  }, [currentCharacter, isGenerating, messages, settings, fateState, addMessage, setSuggestions, setGenerating, incrementRound, updateFate, endDialogue]);

  return { sendMessage, endDialogue, initiateDialogue };
}
