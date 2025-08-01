import { createContext, useContext, useRef, useState, useEffect } from 'react';

const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const audioRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const [volume, setVolume] = useState(0.5);
  const [isMusicAllowed, setIsMusicAllowed] = useState(false);

  // Инициализация аудио контекста
  const initAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 64;
    }
  };

  // Подключение аудио ноды
  const connectAudioNodes = () => {
    if (audioRef.current && audioContextRef.current && !audioRef.current.connected) {
      const source = audioContextRef.current.createMediaElementSource(audioRef.current);
      source.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);
      audioRef.current.connected = true; // Помечаем как подключенное
    }
  };

  // Загрузка настроек
  useEffect(() => {
    const savedSettings = localStorage.getItem('audioSettings');
    if (savedSettings) {
      const { volume, isMusicAllowed } = JSON.parse(savedSettings);
      setVolume(volume);
      setIsMusicAllowed(isMusicAllowed);
    }
  }, []);

  // Обработка изменений
  useEffect(() => {
    localStorage.setItem('audioSettings', JSON.stringify({ volume, isMusicAllowed }));
    
    if (audioRef.current) {
      audioRef.current.volume = volume;
      
      if (isMusicAllowed) {
        initAudioContext();
        audioRef.current.play().catch(e => console.log('Play error:', e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [volume, isMusicAllowed]);

  const enableMusic = () => {
    setIsMusicAllowed(true);
  };

  return (
    <AudioContext.Provider value={{
      audioRef,
      analyserRef,
      volume,
      setVolume,
      isMusicAllowed,
      enableMusic,
      connectAudioNodes
    }}>
      <audio 
        ref={audioRef} 
        src="/sounds/back1.mp3" 
        loop 
        onPlay={() => connectAudioNodes()}
      />
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => useContext(AudioContext);