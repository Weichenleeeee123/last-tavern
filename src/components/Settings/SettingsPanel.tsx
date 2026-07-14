import { useState } from 'react';
import { useStore } from '../../store/useStore';

const PRESETS = [
  {
    name: '免Key模式',
    endpoint: '/api/chat',
    model: 'deepseek-chat',
    placeholder: '无需填写',
    keyHint: '使用酒馆内置服务，无需配置',
  },
  {
    name: 'DeepSeek',
    endpoint: 'https://api.deepseek.com/v1/chat/completions',
    model: 'deepseek-chat',
    placeholder: 'sk-...',
    keyHint: '在 platform.deepseek.com 获取',
  },
  {
    name: 'OpenAI',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-4o-mini',
    placeholder: 'sk-...',
    keyHint: '在 platform.openai.com 获取',
  },
  {
    name: '硅基流动',
    endpoint: 'https://api.siliconflow.cn/v1/chat/completions',
    model: 'deepseek-ai/DeepSeek-V3',
    placeholder: 'sk-...',
    keyHint: '在 siliconflow.cn 获取',
  },
];

export function SettingsPanel() {
  const showSettings = useStore((s) => s.showSettings);
  const setShowSettings = useStore((s) => s.setShowSettings);
  const settings = useStore((s) => s.settings);
  const updateSettings = useStore((s) => s.updateSettings);

  const [localEndpoint, setLocalEndpoint] = useState(settings.endpoint);
  const [localApiKey, setLocalApiKey] = useState(settings.apiKey);
  const [localModel, setLocalModel] = useState(settings.model);
  const [activePreset, setActivePreset] = useState<string | null>(null);

  if (!showSettings) return null;

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setLocalEndpoint(preset.endpoint);
    setLocalModel(preset.model);
    // 免Key模式清空 API Key
    if (preset.name === '免Key模式') {
      setLocalApiKey('');
    }
    setActivePreset(preset.name);
  };

  const handleSave = () => {
    updateSettings({
      endpoint: localEndpoint,
      apiKey: localApiKey,
      model: localModel,
    });
    setShowSettings(false);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in p-4">
      <div className="bg-tavern-bg2 border border-tavern-gold/30 rounded-lg p-6 max-w-md w-full shadow-2xl">
        <h2 className="text-tavern-gold font-serif-cn text-xl mb-5 text-center">
          酒馆配置
        </h2>

        {/* Preset buttons */}
        <div className="grid grid-cols-2 gap-2 mb-5">
          {PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset)}
              className={`flex-1 text-xs font-serif-cn py-1.5 rounded transition-colors border ${
                activePreset === preset.name
                  ? 'bg-tavern-gold/20 border-tavern-gold/50 text-tavern-gold'
                  : 'bg-tavern-bg border-tavern-gold/10 text-tavern-muted hover:border-tavern-gold/30'
              }`}
            >
              {preset.name}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-tavern-muted font-serif-cn text-xs mb-1">
              API Endpoint
            </label>
            <input
              type="text"
              value={localEndpoint}
              onChange={(e) => {
                setLocalEndpoint(e.target.value);
                setActivePreset(null);
              }}
              className="w-full bg-tavern-bg border border-tavern-gold/20 rounded px-3 py-2 text-tavern-text font-serif-en text-xs focus:border-tavern-gold/50 outline-none"
              placeholder="https://api.deepseek.com/v1/chat/completions"
            />
          </div>

          <div>
            <label className="block text-tavern-muted font-serif-cn text-xs mb-1">
              API Key
            </label>
            <input
              type="password"
              value={localApiKey}
              onChange={(e) => setLocalApiKey(e.target.value)}
              className="w-full bg-tavern-bg border border-tavern-gold/20 rounded px-3 py-2 text-tavern-text font-serif-en text-xs focus:border-tavern-gold/50 outline-none"
              placeholder="sk-..."
            />
            {activePreset && (
              <p className="text-tavern-muted/50 font-serif-cn text-[10px] mt-1">
                {PRESETS.find(p => p.name === activePreset)?.keyHint}
              </p>
            )}
          </div>

          <div>
            <label className="block text-tavern-muted font-serif-cn text-xs mb-1">
              模型
            </label>
            <input
              type="text"
              value={localModel}
              onChange={(e) => {
                setLocalModel(e.target.value);
                setActivePreset(null);
              }}
              className="w-full bg-tavern-bg border border-tavern-gold/20 rounded px-3 py-2 text-tavern-text font-serif-en text-xs focus:border-tavern-gold/50 outline-none"
              placeholder="deepseek-chat"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSave}
            className="flex-1 bg-tavern-gold/20 hover:bg-tavern-gold/30 text-tavern-gold font-serif-cn text-sm py-2 rounded transition-colors"
          >
            保存
          </button>
          <button
            onClick={() => setShowSettings(false)}
            className="flex-1 bg-tavern-bg hover:bg-tavern-bg2 text-tavern-muted font-serif-cn text-sm py-2 rounded transition-colors border border-tavern-gold/10"
          >
            取消
          </button>
        </div>

        <p className="text-tavern-muted/50 font-serif-cn text-[10px] mt-4 text-center">
          配置仅保存在本地浏览器 · 不会上传
        </p>
      </div>
    </div>
  );
}
