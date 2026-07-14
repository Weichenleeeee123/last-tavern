import type { LLMSettings, Message, Character } from '../types';
import { SUMMARY_PROMPT } from '../data/prompts';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface LLMResponse {
  choices: Array<{
    message: { role: string; content: string };
  }>;
}

// 发送对话请求
export async function sendChatMessage(
  settings: LLMSettings,
  systemPrompt: string,
  messages: Message[],
  userMessage: string
): Promise<string> {
  // 在用户消息后追加格式提醒，确保 LLM 每次都输出 ||| 建议选项
  const formatReminder = '\n\n（请在回复正文后附上3个来客回应选项，用 ||| 分隔）';
  
  const chatMessages: ChatMessage[] = [
    { role: 'system', content: systemPrompt },
    ...messages.map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
    { role: 'user', content: userMessage + formatReminder },
  ];

  // 免Key模式：apiKey 为空时，走服务端代理（不带 Authorization 头）
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (settings.apiKey) {
    headers['Authorization'] = `Bearer ${settings.apiKey}`;
  }

  const response = await fetchWithTimeout(
    settings.endpoint,
    {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: settings.model,
        messages: chatMessages,
        temperature: 0.8,
        max_tokens: 500,
      }),
    },
    30000
  );

  if (!response.ok) {
    throw new Error(`LLM API error: ${response.status}`);
  }

  const data: LLMResponse = await response.json();
  return data.choices[0].message.content;
}

// 生成对饮记录卡总结
export async function generateSummary(
  settings: LLMSettings,
  character: Character,
  messages: Message[]
): Promise<{ userAppeal: string; characterInsist: string; goldenQuotes: string[] }> {
  const chatMessages: ChatMessage[] = [
    { role: 'system', content: character.systemPrompt },
    ...messages.map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
    { role: 'user', content: SUMMARY_PROMPT },
  ];

  // 免Key模式：apiKey 为空时，走服务端代理
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (settings.apiKey) {
    headers['Authorization'] = `Bearer ${settings.apiKey}`;
  }

  const response = await fetchWithTimeout(
    settings.endpoint,
    {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: settings.model,
        messages: chatMessages,
        temperature: 0.3,
        max_tokens: 300,
      }),
    },
    30000
  );

  if (!response.ok) {
    throw new Error(`LLM API error: ${response.status}`);
  }

  const data: LLMResponse = await response.json();
  const content = data.choices[0].message.content;

  // 尝试解析 JSON
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        userAppeal: parsed.userAppeal || '未能提取',
        characterInsist: parsed.characterInsist || '未能提取',
        goldenQuotes: Array.isArray(parsed.goldenQuotes) ? parsed.goldenQuotes.slice(0, 3) : [],
      };
    }
  } catch {
    // 降级处理
  }

  // 降级:取最后一条用户消息和最后一条人物回应
  const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
  const lastAssistantMsg = [...messages].reverse().find(m => m.role === 'assistant');
  return {
    userAppeal: lastUserMsg?.content.slice(0, 50) || '未能提取',
    characterInsist: lastAssistantMsg?.content.slice(0, 50) || '未能提取',
    goldenQuotes: [],
  };
}

// 带超时的 fetch
async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs: number
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}
