//оставлю это здесь - анимация визуализатора с более чувствительной отрисовкой! но жрет много ресурсов CPU

import { useEffect, useRef, useState } from "react";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { useAudio } from "../context/AudioContext";
import { Palette as PaletteIcon } from "@mui/icons-material";

const COLOR_SCHEMES = [
  "spectrum",
  "fire",
  "ocean",
  "forest",
  "neon",
  "pastel",
  "monochrome",
];

const getColorForScheme = (colorScheme, i, value) => {
  const normalized = value / 255;

  switch (colorScheme) {
    case "fire":
      return `rgb(${Math.floor(normalized * 255)}, ${Math.floor(
        normalized * 80
      )}, 0)`;
    case "ocean":
      return `rgb(0, ${Math.floor(100 + normalized * 155)}, ${Math.floor(
        150 + normalized * 105
      )})`;
    case "forest":
      return `rgb(0, ${Math.floor(100 + normalized * 155)}, ${Math.floor(
        50 + normalized * 80
      )})`;
    case "neon":
      return `hsl(${((i * 360) / 32) % 360}, 100%, ${50 + normalized * 40}%)`;
    case "pastel":
      return `hsl(${((i * 360) / 32) % 360}, 80%, ${70 + normalized * 20}%)`;
    case "monochrome":
      const intensity = Math.floor(normalized * 255);
      return `rgb(${intensity}, ${intensity}, ${intensity})`;
    default:
      return `hsl(${((i * 360) / 32) % 360}, 100%, ${50 + normalized * 30}%)`;
  }
};

const AudioVisualizer = () => {
  const { analyserRef, isMusicAllowed } = useAudio();
  const canvasRef = useRef(null);
  const animationId = useRef(null);

  const [colorScheme, setColorScheme] = useState(() => {
    return localStorage.getItem("audioVisualizerColorScheme") || "spectrum";
  });

  useEffect(() => {
    localStorage.setItem("audioVisualizerColorScheme", colorScheme);
  }, [colorScheme]);

  useEffect(() => {
    if (!analyserRef.current || !canvasRef.current || !isMusicAllowed) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const drawBars = () => {
      analyserRef.current.getByteFrequencyData(dataArray);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = 8; // Уменьшена ширина столбцов
      const gap = 2; // Уменьшен промежуток
      let x = 0;

      ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < 24; i++) {
        // Уменьшено количество столбцов до 24
        const barHeight = (dataArray[i] / 255) * canvas.height * 0.85;
        const color = getColorForScheme(colorScheme, i, dataArray[i]);

        if (!isValidColor(color)) {
          console.error(`Invalid color: ${color}`);
          continue;
        }

        const gradient = ctx.createLinearGradient(
          0,
          canvas.height - barHeight,
          0,
          canvas.height
        );

        const endColor = color.endsWith(")")
          ? `${color.replace(")", ", 0.4)")}`
          : `${color}66`;

        try {
          gradient.addColorStop(0, color);
          gradient.addColorStop(1, endColor);
        } catch (e) {
          console.error("Failed to add color stop:", e);
          continue;
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, canvas.height - barHeight, barWidth, barHeight, 4); // Меньший радиус скругления
        ctx.fill();

        ctx.shadowColor = color;
        ctx.shadowBlur = 8; // Уменьшено размытие тени
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.fillStyle = "#ffffff40";
        ctx.fillRect(x + 0.5, canvas.height - barHeight, barWidth - 1, 1); // Более тонкая подсветка
        x += barWidth + gap;
      }
    };

    function isValidColor(color) {
      const s = new Option().style;
      s.color = color;
      return s.color !== "";
    }

    const animate = () => {
      animationId.current = requestAnimationFrame(animate);
      drawBars();
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId.current);
    };
  }, [analyserRef, isMusicAllowed, colorScheme]);

  if (!isMusicAllowed) return null;

  return (
    <Box
      sx={{
        width: "100%", // Уменьшена ширина контейнера
        maxWidth: "none", // Максимальная ширина
        mb: 2,
        p: 1.5, // Уменьшены отступы
        bgcolor: "rgba(0, 0, 0, 0.1)",
        borderRadius: 2, // Меньший радиус скругления
        border: "1px solid rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(5px)",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)", // Более тонкая тень
        marginLeft: "auto", // Измените на auto для выравнивания вправо
        marginRight: "0", // Уберите auto
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{ color: "text.secondary", fontSize: "0.75rem" }}
        >
          AUDIO VISUALIZER
        </Typography>
        <Box>
          <Tooltip title="Change Color Scheme">
            <IconButton
              onClick={() => {
                const currentIndex = COLOR_SCHEMES.indexOf(colorScheme);
                const nextIndex = (currentIndex + 1) % COLOR_SCHEMES.length;
                setColorScheme(COLOR_SCHEMES[nextIndex]);
              }}
              size="small"
              sx={{ padding: "6px" }} // Уменьшен размер кнопки
            >
              <PaletteIcon sx={{ fontSize: "1rem" }} />
              <Typography
                variant="caption"
                sx={{
                  ml: 0.5,
                  textTransform: "capitalize",
                  fontSize: "0.7rem",
                }}
              >
                {colorScheme}
              </Typography>
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <canvas
        ref={canvasRef}
        width={240} // Уменьшенный размер canvas
        height={120}
        style={{
          width: "100%",
          height: 120,
          borderRadius: 6,
          display: "block",
        }}
      />
    </Box>
  );
};

export default AudioVisualizer;
