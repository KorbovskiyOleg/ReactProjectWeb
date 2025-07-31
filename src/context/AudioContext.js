import React, { createContext, useState, useContext, useRef, useEffect } from 'react';

const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const audioRef = useRef(null);
  const [volume, setVolume] = useState(0.5); // Начальная громкость 50%
  const [isMusicAllowed, setIsMusicAllowed] = useState(false);

  useEffect(() => {
    const savedSettings = JSON.parse(localStorage.getItem('audioSettings'));
    if (savedSettings) {
      setVolume(savedSettings.volume);
      setIsMusicAllowed(savedSettings.isMusicAllowed);
    }
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      localStorage.setItem('audioSettings', JSON.stringify({
        volume,
        isMusicAllowed
      }));
    }
  }, [volume, isMusicAllowed]);

  const enableMusic = () => {
    setIsMusicAllowed(true);
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log('Play error:', e));
    }
  };

  return (
    <>
      <audio ref={audioRef} src="/sounds/back1.mp3" loop />
      <AudioContext.Provider value={{ 
        volume, 
        setVolume,
        isMusicAllowed,
        enableMusic,
        audioRef // Добавляем ref в контекст
      }}>
        {children}
      </AudioContext.Provider>
    </>
  );
};

export const useAudio = () => useContext(AudioContext);