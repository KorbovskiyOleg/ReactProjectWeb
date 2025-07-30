import React, { createContext, useState, useContext, useRef, useEffect } from 'react';

const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const audioRef = useRef(null);
  const [volume, setVolume] = useState(0.2); // Начальная громкость 20%
  const [isMusicAllowed, setIsMusicAllowed] = useState(false);

  useEffect(() => {
    const savedVolume = localStorage.getItem('volume');
    if (savedVolume) {
      setVolume(parseFloat(savedVolume));
    }
    
    const savedMusicAllowed = localStorage.getItem('musicAllowed');
    if (savedMusicAllowed === 'true') {
      setIsMusicAllowed(true);
    }
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      localStorage.setItem('volume', volume.toString());
    }
  }, [volume]);

  const enableMusic = () => {
    setIsMusicAllowed(true);
    localStorage.setItem('musicAllowed', 'true');
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log('Play error:', e));
    }
  };

  return (
    <>
      <audio ref={audioRef} src="/sounds/back1.mp3" preload="auto" loop />
      <AudioContext.Provider value={{ volume, setVolume, isMusicAllowed, enableMusic }}>
        {children}
      </AudioContext.Provider>
    </>
  );
};

export const useAudio = () => useContext(AudioContext);