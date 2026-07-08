/**
 * 临终酒馆 - 音频系统
 * 背景音乐：外部 MP3 文件 (public/audio/tavern-ambient.mp3)
 * 音效：Web Audio API 程序化生成
 */

let ctx: AudioContext | null = null;
let sfxGain: GainNode | null = null;
let bgAudio: HTMLAudioElement | null = null;
let isPlaying = false;

function getCtx(): AudioContext {
  if (!ctx) {
    ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    sfxGain = ctx.createGain();
    sfxGain.gain.value = 0.7;
    sfxGain.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') {
    ctx.resume();
  }
  return ctx;
}

/** 启动背景音乐 */
export function startAmbient() {
  if (isPlaying) return;
  isPlaying = true;

  // 尝试加载外部 MP3
  if (!bgAudio) {
    bgAudio = new Audio('/audio/tavern-ambient.mp3');
    bgAudio.loop = true;
    bgAudio.volume = 0.4;
  }

  bgAudio.play().catch(() => {
    // 文件不存在或加载失败 - 静默失败
    console.warn('背景音乐文件未找到，请将 MP3 放至 public/audio/tavern-ambient.mp3');
  });
}

/** 停止背景音乐 */
export function stopAmbient() {
  if (!isPlaying) return;
  isPlaying = false;
  if (bgAudio) {
    bgAudio.pause();
  }
}

/** 门推开音效 - 木质摩擦 + 铰链吱嘎声 */
export function playDoorSound() {
  const audioCtx = getCtx();
  if (!sfxGain) return;

  const duration = 2.5;
  const buffer = audioCtx.createBuffer(1, audioCtx.sampleRate * duration, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < data.length; i++) {
    const t = i / data.length;
    const env = Math.sin(Math.PI * t);
    const lowRumble = Math.sin(2 * Math.PI * 60 * t) * 0.4;
    const woodCreak = Math.sin(2 * Math.PI * (140 + t * 80) * t) * 0.25;
    const noise = (Math.random() * 2 - 1) * 0.3;
    data[i] = (lowRumble + woodCreak + noise * 0.5) * env * 0.5;
  }

  const source = audioCtx.createBufferSource();
  source.buffer = buffer;

  const filter = audioCtx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 500;

  const gain = audioCtx.createGain();
  gain.gain.value = 0.7;

  source.connect(filter);
  filter.connect(gain);
  gain.connect(sfxGain);
  source.start();

  // 铰链吱嘎声
  setTimeout(() => {
    if (!ctx) return;
    const creak = ctx.createOscillator();
    creak.type = 'sawtooth';
    creak.frequency.value = 800;
    creak.frequency.exponentialRampToValueAtTime(400, audioCtx.currentTime + 1.5);

    const creakGain = ctx.createGain();
    creakGain.gain.value = 0;
    creakGain.gain.setTargetAtTime(0.04, audioCtx.currentTime, 0.1);
    creakGain.gain.setTargetAtTime(0, audioCtx.currentTime + 1, 0.3);

    const creakFilter = ctx.createBiquadFilter();
    creakFilter.type = 'bandpass';
    creakFilter.frequency.value = 1000;
    creakFilter.Q.value = 5;

    creak.connect(creakFilter);
    creakFilter.connect(creakGain);
    creakGain.connect(sfxGain!);
    creak.start();
    creak.stop(audioCtx.currentTime + 2);
  }, 300);
}

/** 选择角色 - 酒杯轻碰声 */
export function playSelectSound() {
  const audioCtx = getCtx();
  if (!sfxGain) return;

  [1318.5, 1760, 2637].forEach((freq, i) => {
    const osc = audioCtx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;

    const gain = audioCtx.createGain();
    gain.gain.value = 0;
    const startTime = audioCtx.currentTime + i * 0.04;
    gain.gain.setTargetAtTime(0.12, startTime, 0.005);
    gain.gain.setTargetAtTime(0, startTime + 0.08, 0.15);

    osc.connect(gain);
    gain.connect(sfxGain!);
    osc.start(startTime);
    osc.stop(startTime + 1);
  });
}

/** 发送消息 - 翻页声 */
export function playSendSound() {
  const audioCtx = getCtx();
  if (!sfxGain) return;

  const duration = 0.25;
  const buffer = audioCtx.createBuffer(1, audioCtx.sampleRate * duration, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    const t = i / data.length;
    data[i] = (Math.random() * 2 - 1) * Math.exp(-t * 6) * 0.4;
  }

  const source = audioCtx.createBufferSource();
  source.buffer = buffer;

  const filter = audioCtx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = 2500;

  const gain = audioCtx.createGain();
  gain.gain.value = 0.2;

  source.connect(filter);
  filter.connect(gain);
  gain.connect(sfxGain);
  source.start();
}

/** 收到回复 - 柔和古钟声 */
export function playReceiveSound() {
  const audioCtx = getCtx();
  if (!sfxGain) return;

  const harmonics = [
    { freq: 523.25, level: 0.08, decay: 1.2 },
    { freq: 1046.5, level: 0.04, decay: 0.8 },
    { freq: 1568.0, level: 0.02, decay: 0.5 },
  ];

  harmonics.forEach(h => {
    const osc = audioCtx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = h.freq;

    const gain = audioCtx.createGain();
    gain.gain.value = 0;
    gain.gain.setTargetAtTime(h.level, audioCtx.currentTime, 0.01);
    gain.gain.setTargetAtTime(0, audioCtx.currentTime + 0.1, h.decay);

    osc.connect(gain);
    gain.connect(sfxGain!);
    osc.start();
    osc.stop(audioCtx.currentTime + h.decay * 2 + 0.5);
  });
}

/** 获取播放状态 */
export function isAmbientPlaying() {
  return isPlaying;
}
