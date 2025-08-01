/*import { useEffect, useRef, useState, useCallback } from "react";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { useAudio } from "../context/AudioContext";
import { Palette as PaletteIcon } from "@mui/icons-material";

// Конфигурация производительности
const VISUALIZER_CONFIG = {
  BAR_COUNT: 27,           // Оптимальное количество столбцов
  TARGET_FPS: 25,          // Целевая частота кадров
  DATA_UPDATE_INTERVAL: 80, // Частота обновления данных (мс)
  BAR_WIDTH: 10,            // Ширина столбца
  BAR_GAP: 2,              // Промежуток между столбцами
  HEIGHT_SCALE: 0.85       // Масштаб высоты столбцов
};

const COLOR_SCHEMES = [
  "spectrum", "fire", "ocean", 
  "forest", "neon", "pastel", "monochrome"
];

const AudioVisualizer = () => {
  const { analyserRef, isMusicAllowed } = useAudio();
  const canvasRef = useRef(null);
  const animationFrameId = useRef(null);
  const lastFrameTime = useRef(0);
  const lastDataUpdate = useRef(0);
  const dataArray = useRef(null);
  const colorCache = useRef(new Map());

  const [colorScheme, setColorScheme] = useState(() => {
    return localStorage.getItem("audioVisualizerColorScheme") || "spectrum";
  });

  // Генератор цветов с мемоизацией
  const getColor = useCallback((scheme, i, value) => {
    const key = `${scheme}-${i}-${value}`;
    
    if (colorCache.current.has(key)) {
      return colorCache.current.get(key);
    }

    const normalized = value / 255;
    let color;

    switch (scheme) {
      case "fire":
        color = `rgb(${Math.floor(normalized * 255)}, ${Math.floor(normalized * 80)}, 0)`;
        break;
      case "ocean":
        color = `rgb(0, ${Math.floor(100 + normalized * 155)}, ${Math.floor(150 + normalized * 105)})`;
        break;
      case "forest":
        color = `rgb(0, ${Math.floor(100 + normalized * 155)}, ${Math.floor(50 + normalized * 80)})`;
        break;
      case "neon":
        color = `hsl(${(i * 12) % 360}, 100%, ${50 + normalized * 40}%)`;
        break;
      case "pastel":
        color = `hsl(${(i * 12) % 360}, 80%, ${70 + normalized * 20}%)`;
        break;
      case "monochrome":
        default:
        const intensity = Math.floor(normalized * 255);
        color = `rgb(${intensity}, ${intensity}, ${intensity})`;
    }

    colorCache.current.set(key, color);
    return color;
  }, []);

  // Очистка кэша цветов при смене схемы
  useEffect(() => {
    colorCache.current.clear();
    localStorage.setItem("audioVisualizerColorScheme", colorScheme);
  }, [colorScheme]);

  // Основной эффект визуализации
  useEffect(() => {
    if (!analyserRef.current || !canvasRef.current || !isMusicAllowed) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { 
      alpha: false,
      willReadFrequently: false
    });

    // Инициализация массива данных
    if (!dataArray.current) {
      dataArray.current = new Uint8Array(analyserRef.current.frequencyBinCount);
    }

    const drawVisualizer = (currentTime) => {
  // Обновление данных с заданным интервалом
  if (currentTime - lastDataUpdate.current > VISUALIZER_CONFIG.DATA_UPDATE_INTERVAL) {
    analyserRef.current.getByteFrequencyData(dataArray.current);
    lastDataUpdate.current = currentTime;
  }

  // Очищаем canvas с прозрачностью
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Отрисовка столбцов с улучшенной видимостью
  for (let i = 0; i < VISUALIZER_CONFIG.BAR_COUNT; i++) {
    const freqIndex = Math.floor(i * (32 / VISUALIZER_CONFIG.BAR_COUNT));
    const value = dataArray.current[freqIndex] || 0;
    const barHeight = (value / 255) * canvas.height * VISUALIZER_CONFIG.HEIGHT_SCALE;
    
    // Генерируем цвет с небольшим затемнением для лучшей видимости
    const baseColor = getColor(colorScheme, i, value);
    
    // Добавляем легкую обводку для контраста
    ctx.strokeStyle = `${baseColor.replace(')', ', 0.7)')}`;
    ctx.lineWidth = 1;
    
    // Заливка столбца
    ctx.fillStyle = baseColor;
    
    // Рисуем столбец
    const xPos = i * (VISUALIZER_CONFIG.BAR_WIDTH + VISUALIZER_CONFIG.BAR_GAP);
    const yPos = canvas.height - barHeight;
    
    ctx.beginPath();
    ctx.roundRect(
      xPos, 
      yPos, 
      VISUALIZER_CONFIG.BAR_WIDTH, 
      barHeight, 
      4
    );
    ctx.fill();
    ctx.stroke();
    
    // Добавляем легкое свечение для лучшей видимости
    ctx.shadowColor = baseColor;
    ctx.shadowBlur = 5;
    ctx.fill();
    ctx.shadowBlur = 0;
  }
};

    const animate = (time) => {
      if (time - lastFrameTime.current > 1000 / VISUALIZER_CONFIG.TARGET_FPS) {
        drawVisualizer(time);
        lastFrameTime.current = time;
      }
      animationFrameId.current = requestAnimationFrame(animate);
    };

    // Обработчик скрытия вкладки
    const handleVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrameId.current);
      } else {
        lastFrameTime.current = performance.now();
        animationFrameId.current = requestAnimationFrame(animate);
      }
    };

    animationFrameId.current = requestAnimationFrame(animate);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      cancelAnimationFrame(animationFrameId.current);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [analyserRef, isMusicAllowed, colorScheme, getColor]);

  if (!isMusicAllowed) return null;

  return (
    <Box
      sx={{
        width: "80%", // Уже основного контейнера
        maxWidth: "400px", // Максимальная ширина
        mb: 2, // Меньший отступ снизу
        p: 1.5, // Меньшие внутренние отступы
        bgcolor: "transparent", // Прозрачный фон
        borderRadius: 2, // Меньший радиус скругления
        border: "1px solid rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(5px)",
        boxShadow: "none", // Убираем тень
         marginRight: "auto", // Смещаем влево (отменяем mx: "auto")
        marginLeft: 0        // Явно указываем 0 слева
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
        <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
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
              aria-label="Change color scheme"
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.1)", // Полупрозрачная кнопка
                '&:hover': {
                  backgroundColor: "rgba(255, 255, 255, 0.2)"
                }
              }}
            >
              <PaletteIcon />
              <Typography
                variant="caption"
                sx={{ ml: 1, textTransform: "capitalize" }}
              >
                {colorScheme}
              </Typography>
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <canvas
        ref={canvasRef}
        width={300}
        height={100}
        style={{
          width: "100%",
          height: 120,
          borderRadius: 6,
          display: "block",
          willChange: "transform",
          background: "transparent" // Прозрачный фон canvas
        }}
        aria-label="Audio visualizer"
      />
    </Box>
  );
};

export default AudioVisualizer;*/

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
