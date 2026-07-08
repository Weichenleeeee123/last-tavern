import { useState, useCallback, useEffect } from 'react';
import { startAmbient, stopAmbient, isAmbientPlaying } from '../services/audio';

export function useAudio() {
  const [enabled, setEnabled] = useState(() => isAmbientPlaying());

  const toggle = useCallback(() => {
    if (isAmbientPlaying()) {
      stopAmbient();
      setEnabled(false);
    } else {
      startAmbient();
      setEnabled(true);
    }
  }, []);

  // 同步状态：如果音乐已在其他地方启动，更新按钮状态
  useEffect(() => {
    const check = setInterval(() => {
      setEnabled(isAmbientPlaying());
    }, 1000);
    return () => clearInterval(check);
  }, []);

  return { enabled, toggle };
}
