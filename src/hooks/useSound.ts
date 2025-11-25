import { useCallback, useEffect, useRef, useState } from 'react';

// Hook do zarządzania dźwiękami w aplikacji
export const useSound = () => {
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const audioContextRef = useRef<AudioContext | null>(null);
  const backgroundMusicRef = useRef<HTMLAudioElement | null>(null);

  // Inicjalizuj AudioContext
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.pause();
        backgroundMusicRef.current = null;
      }
    };
  }, []);

  // Dźwięk poprawnej odpowiedzi - radosny dzwonek
  const playCorrect = useCallback(() => {
    if (!isSoundEnabled || !audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const now = ctx.currentTime;

    // Główna nuta - wesołe "ding!"
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    
    osc1.frequency.setValueAtTime(800, now);
    osc1.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
    gain1.gain.setValueAtTime(0.3, now);
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    
    osc1.start(now);
    osc1.stop(now + 0.3);

    // Druga nuta - echo
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    
    osc2.frequency.setValueAtTime(1000, now + 0.1);
    osc2.frequency.exponentialRampToValueAtTime(1400, now + 0.2);
    gain2.gain.setValueAtTime(0.2, now + 0.1);
    gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
    
    osc2.start(now + 0.1);
    osc2.stop(now + 0.4);
  }, [isSoundEnabled]);

  // Dźwięk błędnej odpowiedzi - łagodny "ups"
  const playWrong = useCallback(() => {
    if (!isSoundEnabled || !audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const now = ctx.currentTime;

    // Nuta opadająca - delikatne "oh no"
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.3);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    
    osc.start(now);
    osc.stop(now + 0.3);
  }, [isSoundEnabled]);

  // Dźwięk kliknięcia - subtelny klik
  const playClick = useCallback(() => {
    if (!isSoundEnabled || !audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.frequency.setValueAtTime(600, now);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
    
    osc.start(now);
    osc.stop(now + 0.05);
  }, [isSoundEnabled]);

  // Dźwięk rzutu kostką - turkot
  const playDiceRoll = useCallback(() => {
    if (!isSoundEnabled || !audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const now = ctx.currentTime;

    // Seria szybkich dźwięków imitujących turkot
    for (let i = 0; i < 8; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      const time = now + i * 0.06;
      osc.frequency.setValueAtTime(200 + Math.random() * 200, time);
      gain.gain.setValueAtTime(0.05, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.05);
      
      osc.start(time);
      osc.stop(time + 0.05);
    }
  }, [isSoundEnabled]);

  // Zimowy ambient - subtelny szum wiatru
  const playBackgroundAmbient = useCallback(() => {
    if (!isSoundEnabled || !audioContextRef.current || backgroundMusicRef.current) return;

    const ctx = audioContextRef.current;
    
    // Tworzymy biały szum (zimowy wiatr)
    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    // Source node z szumem
    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filtr dolnoprzepustowy - daje efekt miękkiego wiatru
    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 300;

    // Bardzo niski volume dla tła
    const gain = ctx.createGain();
    gain.gain.value = 0.02;

    whiteNoise.connect(lowpass);
    lowpass.connect(gain);
    gain.connect(ctx.destination);

    whiteNoise.start();

    // Zapisz referencję żeby móc później zatrzymać
    const stopAmbient = () => {
      whiteNoise.stop();
    };

    return stopAmbient;
  }, [isSoundEnabled]);

  // Zatrzymaj ambient
  const stopBackgroundAmbient = useCallback(() => {
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.pause();
      backgroundMusicRef.current = null;
    }
  }, []);

  // Toggle dźwięków
  const toggleSound = useCallback(() => {
    setIsSoundEnabled(prev => !prev);
  }, []);

  return {
    isSoundEnabled,
    toggleSound,
    playCorrect,
    playWrong,
    playClick,
    playDiceRoll,
    playBackgroundAmbient,
    stopBackgroundAmbient,
  };
};
