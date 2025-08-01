import { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { useAudio } from '../context/AudioContext';

const AudioVisualizer = () => {
  const { analyserRef } = useAudio();
  const canvasRef = useRef(null);
  const animationId = useRef(null);

  useEffect(() => {
    if (!analyserRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationId.current = requestAnimationFrame(draw);
      analyserRef.current.getByteFrequencyData(dataArray);
      
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
      cancelAnimationFrame(animationId.current);
    };
  }, [analyserRef]);

  return (
    <Box sx={{
      position: 'fixed',
      top: 16,
      right: 16,
      width: 150,
      height: 60,
      zIndex: 1000,
      bgcolor: 'rgba(0,0,0,0.7)',
      borderRadius: 2,
      p: 1
    }}>
      <canvas 
        ref={canvasRef} 
        width={150} 
        height={60}
        style={{ width: '100%', height: '100%' }}
      />
    </Box>
  );
};

export default AudioVisualizer;