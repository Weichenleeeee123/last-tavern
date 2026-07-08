// 桌子类型
export type TableType = 'power' | 'ink' | 'mirror' | 'truth' | 'melody' | 'stars';

// 劝说难度
export type Difficulty = 'extreme' | 'high' | 'medium' | 'low';

// 场景类型
export type Scene = 'door' | 'hall' | 'dialogue' | 'record';

// 历史人物
export interface Character {
  id: string;
  name: string;
  nameEn: string;
  era: string;
  lastNight: string;
  year: number;
  table: TableType;
  portrait: string;
  quote: string;
  tags: string[];
  difficulty: Difficulty;
  historicalAnchor: string;
  realEnding: string;
  systemPrompt: string;
}

// 桌子定义
export interface TavernTable {
  id: TableType;
  name: string;
  nameEn: string;
  characters: Character[];
}

// 对话消息
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

// LLM 设置
export interface LLMSettings {
  endpoint: string;
  apiKey: string;
  model: string;
}

// 对饮记录卡
export interface RecordCardData {
  characterId: string;
  characterName: string;
  characterNameEn: string;
  era: string;
  quote: string;
  portrait: string;
  userAppeal: string;
  characterInsist: string;
  goldenQuotes: string[];
  realEnding: string;
  dialogueRound: number;
  date: string;
}

// 命运之秤状态(0 = 完全命运, 100 = 完全改变)
export interface FateState {
  value: number;
  history: number[];
}
