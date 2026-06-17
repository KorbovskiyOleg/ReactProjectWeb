import React from "react";
import {
  Dialog,
  Box,
  Typography,
  Button,
  Paper,
  Divider,
  Chip
} from "@mui/material";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Rectangle
} from "recharts";

// Имена признаков для отображения
const FEATURE_NAMES = {
  latency: "⏱ Latency (задержка)",
  distance_error: "📏 Distance (расстояние)",
  angle_error: "🧭 Angle (угол)",
  out_of_bounds_ratio: "🎯 In-bounds (в зоне)",
  dispersion: "〰️ Dispersion (разброс)"
};

// Цветовая шкала для времени (от синего к жёлтому)
const getTimeColor = (index, total) => {
  const ratio = total > 1 ? index / (total - 1) : 0;
  const r = Math.round(50 + ratio * 200);
  const g = Math.round(100 + ratio * 155);
  const b = Math.round(200 - ratio * 150);
  return `rgb(${r}, ${g}, ${b})`;
};

// Компонент карточки одного стимула
function StimulusCard({ num, targetName, score, detail, trajectory, targetX, targetY }) {
  // Цвет границы в зависимости от score
  const borderColor = score >= 0.7 ? "#4CAF50" : score >= 0.5 ? "#FF9800" : "#F44336";
  const scoreColor = score >= 0.7 ? "#4CAF50" : score >= 0.5 ? "#FF9800" : "#F44336";

  // Подготовка данных для графика
  const chartData = trajectory?.points?.map((p, idx) => ({
    x: p.x,
    y: p.y,
    index: idx,
    color: getTimeColor(idx, trajectory.points.length)
  })) || [];

  // Размер целевой зоны (BOUND_BOX_WIDTH = 400)
  const halfBox = 200;

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        border: `2px solid ${borderColor}`,
        borderRadius: 2,
        backgroundColor: "#2b2b2b",
        height: "100%"
      }}
    >
      {/* Заголовок карточки */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography variant="h6" sx={{ color: "white", fontWeight: "bold" }}>
          Стимул #{num}: {targetName}
        </Typography>
        <Typography
          variant="h5"
          sx={{ color: scoreColor, fontWeight: "bold" }}
        >
          {score.toFixed(3)}
        </Typography>
      </Box>

      <Divider sx={{ borderColor: "gray", mb: 2 }} />

      {/* График траектории */}
      {chartData.length > 0 && (
        <Box sx={{ mb: 2, backgroundColor: "#1a1a1a", borderRadius: 1, p: 1 }}>
          <Typography variant="caption" sx={{ color: "gray", display: "block", mb: 0.5 }}>
            Траектория взгляда
          </Typography>
          <ResponsiveContainer width="100%" height={200}>
            <ScatterChart margin={{ top: 10, right: 10, bottom: 20, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis
                type="number"
                dataKey="x"
                domain={[0, 1920]}
                name="X"
                tick={{ fill: "white", fontSize: 10 }}
                label={{ value: "X (пиксели)", position: "bottom", fill: "white", fontSize: 10 }}
              />
              <YAxis
                type="number"
                dataKey="y"
                domain={[0, 1080]}
                name="Y"
                orientation="right"
                reversed
                tick={{ fill: "white", fontSize: 10 }}
                label={{ value: "Y (пиксели)", angle: 90, position: "right", fill: "white", fontSize: 10 }}
              />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                contentStyle={{ backgroundColor: "#333", border: "1px solid #555" }}
                labelStyle={{ color: "white" }}
                itemStyle={{ color: "white" }}
                formatter={(value, name) => [value.toFixed(1), name]}
              />
              
              {/* Целевая зона (жёлтая рамка) */}
              <ReferenceLine
                x={targetX - halfBox}
                stroke="#FFEB3B"
                strokeDasharray="5 5"
                strokeWidth={2}
              />
              <ReferenceLine
                x={targetX + halfBox}
                stroke="#FFEB3B"
                strokeDasharray="5 5"
                strokeWidth={2}
              />
              <ReferenceLine
                y={targetY - halfBox}
                stroke="#FFEB3B"
                strokeDasharray="5 5"
                strokeWidth={2}
              />
              <ReferenceLine
                y={targetY + halfBox}
                stroke="#FFEB3B"
                strokeDasharray="5 5"
                strokeWidth={2}
              />

              {/* Целевая точка (красный крестик) */}
              <Scatter
                name="Цель"
                data={[{ x: targetX, y: targetY }]}
                fill="#F44336"
                shape="cross"
                legendType="none"
              >
              </Scatter>

              {/* Траектория взгляда */}
              <Scatter
                name="Взгляд"
                data={chartData}
                legendType="none"
              >
                {chartData.map((entry, index) => (
                  <Rectangle
                    key={`cell-${index}`}
                    fill={entry.color}
                    width={6}
                    height={6}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
          <Box display="flex" justifyContent="space-between" alignItems="center" mt={0.5}>
            <Typography variant="caption" sx={{ color: "gray", fontSize: 9 }}>
              🟦 Начало → 🟨 Конец
            </Typography>
            <Typography variant="caption" sx={{ color: "#FFEB3B", fontSize: 9 }}>
              ⬜ Цель
            </Typography>
          </Box>
        </Box>
      )}

      {/* Признаки */}
      {detail && !detail.error && !detail.velocity_validation && (
        <Box>
          {Object.entries(FEATURE_NAMES).map(([key, displayName]) => {
            if (detail[key] === undefined) return null;
            const value = detail[key];
            const valueStr = typeof value === "number" ? value.toFixed(3) : String(value);
            const valColor = value >= 0.7 ? "#4CAF50" : value >= 0.4 ? "#FF9800" : "#F44336";

            return (
              <Box
                key={key}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                py={0.5}
              >
                <Typography variant="body2" sx={{ color: "white", fontSize: 12 }}>
                  {displayName}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: valColor, fontWeight: "bold", fontSize: 12 }}
                >
                  {valueStr}
                </Typography>
              </Box>
            );
          })}
        </Box>
      )}

      {/* Ошибка */}
      {detail?.error && (
        <Typography variant="body2" sx={{ color: "#F44336" }}>
          ❌ Ошибка: {detail.error}
        </Typography>
      )}
      {detail?.velocity_validation && (
        <Typography variant="body2" sx={{ color: "#F44336" }}>
          ❌ Velocity: {detail.velocity_validation}
        </Typography>
      )}
    </Paper>
  );
}

// Главный компонент диалога результатов
export default function CaptchaResultDialog({ open, onClose, result }) {
  if (!result) return null;

  const success = result.success;
  const finalScore = result.score || 0;
  const stimuli = result.stimuli || [];
  const details = result.details || [];
  const trajectories = result.trajectories || [];
  const sequence = result.sequence || [];
  const stats = result.stats || {};
  const threshold = result.threshold || 0.3;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          backgroundColor: "#1a1a1a",
          color: "white",
          maxHeight: "90vh"
        }
      }}
    >
      <Box sx={{ p: 3 }}>
        {/* === ВЕРХНЯЯ ЧАСТЬ: Заголовок и итог === */}
        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 3,
            textAlign: "center",
            backgroundColor: "#2b2b2b",
            borderRadius: 2
          }}
        >
          <Typography
            variant="h3"
            sx={{
              color: success ? "#4CAF50" : "#F44336",
              fontWeight: "bold",
              mb: 1
            }}
          >
            {success ? "✓ CAPTCHA ПРОЙДЕНА" : "✗ CAPTCHA НЕ ПРОЙДЕНА"}
          </Typography>
          <Typography variant="h5" sx={{ color: "white", fontWeight: "bold" }}>
            Итоговый скор: {finalScore.toFixed(3)}
          </Typography>
          <Typography variant="body2" sx={{ color: "gray", mt: 1 }}>
            Порог прохождения: {threshold}
          </Typography>
        </Paper>

        {/* === СТАТИСТИКА СЕССИИ === */}
        <Paper
          elevation={3}
          sx={{
            p: 2,
            mb: 3,
            backgroundColor: "#2b2b2b",
            borderRadius: 2
          }}
        >
          <Typography variant="h6" sx={{ color: "#2196F3", fontWeight: "bold", mb: 1 }}>
            📊 Статистика сессии
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={2} mb={1}>
            <Chip
              label={`Средний скор: ${stats.mean?.toFixed(3) || 0}`}
              sx={{ backgroundColor: "#333", color: "white" }}
            />
            <Chip
              label={`Стд. отклонение: ${stats.stdev?.toFixed(3) || 0}`}
              sx={{ backgroundColor: "#333", color: "white" }}
            />
            <Chip
              label={`Стимулов: ${stats.count || 0}`}
              sx={{ backgroundColor: "#333", color: "white" }}
            />
            <Chip
              label={`Порог: ${threshold}`}
              sx={{ backgroundColor: "#333", color: "white" }}
            />
          </Box>
          <Typography variant="body2" sx={{ color: "gray" }}>
            Порядок стимулов: {sequence.join(" → ")}
          </Typography>
        </Paper>

        <Divider sx={{ borderColor: "gray", mb: 3 }} />

        {/* === ДЕТАЛИ ПО СТИМУЛАМ (сетка 2x2) === */}
        <Typography variant="h6" sx={{ color: "#2196F3", fontWeight: "bold", mb: 2 }}>
          📋 Детали по каждому стимулу
        </Typography>

        <Box
          display="grid"
          gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}
          gap={2}
          sx={{ maxHeight: "50vh", overflowY: "auto", pr: 1 }}
        >
          {stimuli.map((score, i) => {
            const targetName = sequence[i] || `stimulus_${i}`;
            const detail = details[i] || {};
            const trajectory = trajectories[i] || {};
            
            return (
              <StimulusCard
                key={i}
                num={i + 1}
                targetName={targetName}
                score={score}
                detail={detail}
                trajectory={trajectory}
                targetX={trajectory.target_x || 960}
                targetY={trajectory.target_y || 540}
              />
            );
          })}
        </Box>

        {/* === КНОПКА ЗАКРЫТИЯ === */}
        <Box display="flex" justifyContent="center" mt={3}>
          <Button
            variant="contained"
            size="large"
            onClick={onClose}
            sx={{
              minWidth: 200,
              backgroundColor: success ? "#4CAF50" : "#F44336",
              "&:hover": {
                backgroundColor: success ? "#388E3C" : "#D32F2F"
              }
            }}
          >
            Закрыть
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}