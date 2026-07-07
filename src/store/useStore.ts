import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Scene, Character, Message, LLMSettings, RecordCardData, FateState } from '../types';

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
}

const defaultSettings: LLMSettings = {
  endpoint: 'https://api.openai.com/v1/chat/completions',
  apiKey: '',
  model: 'gpt-4o-mini',
};

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      currentScene: 'door',
      setScene: (scene) => set({ currentScene: scene }),

      currentCharacter: null,
      selectCharacter: (char) => set({ currentCharacter: char }),
      clearCharacter: () => set({ currentCharacter: null }),

      messages: [],
      addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
      clearMessages: () => set({ messages: [] }),
      isGenerating: false,
      setGenerating: (val) => set({ isGenerating: val }),
      dialogueRound: 0,
      incrementRound: () => set((state) => ({ dialogueRound: state.dialogueRound + 1 })),
      resetRound: () => set({ dialogueRound: 0 }),

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
    }),
    {
      name: 'tavern-settings',
      partialize: (state) => ({ settings: state.settings }) as AppState,
    }
  )
);
