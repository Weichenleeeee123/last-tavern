import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Scene, Character, Message, LLMSettings, RecordCardData, FateState } from '../types';

// 每个角色的对话记录
interface CharacterConversation {
  messages: Message[];
  dialogueRound: number;
  fateState: FateState;
}

interface AppState {
  // 场景
  currentScene: Scene;
  setScene: (scene: Scene) => void;

  // 当前人物
  currentCharacter: Character | null;
  selectCharacter: (char: Character) => void;
  clearCharacter: () => void;

  // 对话
  messages: Message[];
  addMessage: (msg: Message) => void;
  clearMessages: () => void;
  isGenerating: boolean;
  setGenerating: (val: boolean) => void;
  dialogueRound: number;
  incrementRound: () => void;
  resetRound: () => void;

  // 引导选项
  suggestions: string[];
  setSuggestions: (s: string[]) => void;

  // 命运之秤
  fateState: FateState;
  updateFate: (newValue: number) => void;
  resetFate: () => void;

  // 记录卡
  recordCard: RecordCardData | null;
  setRecordCard: (card: RecordCardData | null) => void;

  // LLM 设置(persist)
  settings: LLMSettings;
  updateSettings: (settings: Partial<LLMSettings>) => void;

  // 设置面板
  showSettings: boolean;
  setShowSettings: (val: boolean) => void;

  // 各角色对话记录(persist)
  conversations: Record<string, CharacterConversation>;
  saveConversation: (characterId: string) => void;
  loadConversation: (characterId: string) => void;
  clearConversation: (characterId: string) => void;
}

const defaultSettings: LLMSettings = {
  endpoint: '/api/chat',
  apiKey: '',
  model: 'deepseek-chat',
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentScene: 'door',
      setScene: (scene) => set({ currentScene: scene }),

      currentCharacter: null,
      selectCharacter: (char) => {
        const state = get();
        // 切换到不同角色时，保存当前对话并加载新角色的对话
        if (state.currentCharacter?.id !== char.id) {
          // 保存当前对话
          if (state.currentCharacter) {
            state.saveConversation(state.currentCharacter.id);
          }
          // 加载新角色对话（如果有）
          const saved = state.conversations[char.id];
          set({
            currentCharacter: char,
            messages: saved?.messages ?? [],
            dialogueRound: saved?.dialogueRound ?? 0,
            fateState: saved?.fateState ?? { value: 0, history: [0] },
          });
        } else {
          set({ currentCharacter: char });
        }
      },
      clearCharacter: () => set({ currentCharacter: null }),

      messages: [],
      addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
      clearMessages: () => set({ messages: [], suggestions: [] }),
      isGenerating: false,
      setGenerating: (val) => set({ isGenerating: val }),
      dialogueRound: 0,
      incrementRound: () => set((state) => ({ dialogueRound: state.dialogueRound + 1 })),
      resetRound: () => set({ dialogueRound: 0 }),

      suggestions: [],
      setSuggestions: (s) => set({ suggestions: s }),

      fateState: { value: 0, history: [0] },
      updateFate: (newValue) =>
        set((state) => ({
          fateState: {
            value: newValue,
            history: [...state.fateState.history, newValue],
          },
        })),
      resetFate: () => set({ fateState: { value: 0, history: [0] } }),

      recordCard: null,
      setRecordCard: (card) => set({ recordCard: card }),

      settings: defaultSettings,
      updateSettings: (newSettings) =>
        set((state) => ({ settings: { ...state.settings, ...newSettings } })),

      showSettings: false,
      setShowSettings: (val) => set({ showSettings: val }),

      conversations: {},
      saveConversation: (characterId) => {
        const state = get();
        set({
          conversations: {
            ...state.conversations,
            [characterId]: {
              messages: state.messages,
              dialogueRound: state.dialogueRound,
              fateState: state.fateState,
            },
          },
        });
      },
      loadConversation: (characterId) => {
        const state = get();
        const saved = state.conversations[characterId];
        if (saved) {
          set({
            messages: saved.messages,
            dialogueRound: saved.dialogueRound,
            fateState: saved.fateState,
          });
        } else {
          set({
            messages: [],
            dialogueRound: 0,
            fateState: { value: 0, history: [0] },
          });
        }
      },
      clearConversation: (characterId) => {
        const state = get();
        const newConversations = { ...state.conversations };
        delete newConversations[characterId];
        set({
          conversations: newConversations,
          messages: [],
          dialogueRound: 0,
          fateState: { value: 0, history: [0] },
        });
      },
    }),
    {
      name: 'tavern-settings',
      version: 1,
      migrate: (persistedState: unknown, version: number) => {
        const state = persistedState as Partial<AppState>;
        // v0 -> v1: 迁移旧默认设置到免Key代理模式
        if (version < 1 && state.settings) {
          if (state.settings.endpoint === 'https://api.openai.com/v1/chat/completions' && !state.settings.apiKey) {
            state.settings = { ...defaultSettings };
          }
        }
        return state as AppState;
      },
      partialize: (state) => ({
        settings: state.settings,
        conversations: state.conversations,
      }) as AppState,
    }
  )
);
