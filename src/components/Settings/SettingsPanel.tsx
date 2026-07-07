import { useState } from 'react';
import { useStore } from '../../store/useStore';

export function SettingsPanel() {
  const showSettings = useStore((s) => s.showSettings);
  const setShowSettings = useStore((s) => s.setShowSettings);
  const settings = useStore((s) => s.settings);
  const updateSettings = useStore((s) => s.updateSettings);

  const [localEndpoint, setLocalEndpoint] = useState(settings.endpoint);
  const [localApiKey, setLocalApiKey] = useState(settings.apiKey);
  const [localModel, setLocalModel] = useState(settings.model);

  if (!showSettings) return null;

  const handleSave = () => {
    updateSettings({
      endpoint: localEndpoint,
      apiKey: localApiKey,
      model: localModel,
    });
    setShowSettings(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 animate-fade-in">
      <div className="bg-tavern-bg2 border border-tavern-gold/30 rounded-lg p-8 max-w-md w-full mx-4">
        <h2 className="text-tavern-gold font-serif-cn text-xl mb-6 text-center">
          酒馆配置
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-tavern-muted font-serif-cn text-sm mb-1">
              API Endpoint
            </label>
            <input
              type="text"
              value={localEndpoint}
              onChange={(e) => setLocalEndpoint(e.target.value)}
              className="w-full bg-tavern-bg border border-tavern-gold/20 rounded px-3 py-2 text-tavern-text font-serif-en text-sm focus:border-tavern-gold/50 outline-none"
              placeholder="https://api.openai.com/v1/chat/completions"
            />
          </div>

          <div>
            <label className="block text-tavern-muted font-serif-cn text-sm mb-1">
              API Key
            </label>
            <input
              type="password"
              value={localApiKey}
              onChange={(e) => setLocalApiKey(e.target.value)}
              className="w-full bg-tavern-bg border border-tavern-gold/20 rounded px-3 py-2 text-tavern-text font-serif-en text-sm focus:border-tavern-gold/50 outline-none"
              placeholder="sk-..."
            />
          </div>

          <div>
            <label className="block text-tavern-muted font-serif-cn text-sm mb-1">
              模型
            </label>
            <input
              type="text"
              value={localModel}
              onChange={(e) => setLocalModel(e.target.value)}
              className="w-full bg-tavern-bg border border-tavern-gold/20 rounded px-3 py-2 text-tavern-text font-serif-en text-sm focus:border-tavern-gold/50 outline-none"
              placeholder="gpt-4o-mini"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-8">
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

        <p className="text-tavern-muted/60 font-serif-cn text-xs mt-4 text-center">
          你的配置仅保存在本地浏览器
        </p>
      </div>
    </div>
  );
}
