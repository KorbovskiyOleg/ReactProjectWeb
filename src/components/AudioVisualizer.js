// src/components/AudioVisualizer.js
import { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import { useAudio } from '../context/AudioContext';

const AudioVisualizer = () => {
  const { audioRef } = useAudio();
  const canvasRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!audioRef.current || !canvasRef.current) return;

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaElementSource(audioRef.current);
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 64;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barWidth = canvas.width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i] / 2;
        const hue = i * 360 / bufferLength;
        ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }
    };

    draw();

    return () => {
      cancelAnimationFrame(animationRef.current);
      audioContext.close();
    };
  }, [audioRef]);

  return (
    <Box 
      sx={{
        position: 'fixed',
        top: 16,
        right: 16,
        width: 150,
        height: 60,
        zIndex: 1000,
        bgcolor: 'rgba(0,0,0,0.7)',
        borderRadius: 2,
        p: 1,
        display: isVisible ? 'block' : 'none'
      }}
    >
      <canvas 
        ref={canvasRef} 
        width={150} 
        height={60}
        onClick={() => setIsVisible(!isVisible)}
        style={{ cursor: 'pointer', width: '100%', height: '100%' }}
      />
    </Box>
  );
};

export default AudioVisualizer;