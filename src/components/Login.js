/*import React, { useState } from "react";
import { SERVER_URL } from "../constants.js";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import Box from "@mui/material/Box";

function Login({ onLoginSuccess }) {
  // Принимаем пропс из App.js
  const [user, setUser] = useState({
    username: "",
    password: "",
  });

  const [open, setOpen] = useState(false);

  const handleChange = (event) => {
    setUser({ ...user, [event.target.name]: event.target.value });
  };

  const login = () => {
    fetch(SERVER_URL + "login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    })
      .then((res) => {
        const jwtToken = res.headers.get("Authorization");
        if (jwtToken !== null) {
          sessionStorage.setItem("jwt", jwtToken);
          onLoginSuccess(); // Вызываем колбэк из App.js вместо setAuth
        } else {
          setOpen(true);
        }
      })
      .catch((err) => {
        console.error(err);
        setOpen(true);
      });
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="80vh"
    >
      <Stack spacing={2} alignItems="center" sx={{ width: 300 }}>
        <TextField
          name="username"
          label="Username"
          fullWidth
          onChange={handleChange}
        />
        <TextField
          type="password"
          name="password"
          label="Password"
          fullWidth
          onChange={handleChange}
        />
        <Button variant="contained" fullWidth onClick={login} sx={{ mt: 2 }}>
          Login
        </Button>
      </Stack>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
        message="Login failed: Check your username and password"
      />
    </Box>
  );
}

export default Login;*/

import React, { useState, useRef, useEffect } from "react";
import { SERVER_URL } from "../constants.js";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

// URL Python-сервера с CAPTCHA
const PYTHON_API_URL = "http://localhost:8000";

// Позиции точек на экране (в процентах для адаптивности)
const POSITIONS = {
  "top_left": { top: "10%", left: "10%" },
  "top_right": { top: "10%", right: "10%" },
  "center": { top: "50%", left: "50%", transform: "translate(-50%, -50%)" },
  "bottom_left": { bottom: "10%", left: "10%" },
  "bottom_right": { bottom: "10%", right: "10%" }
};

// Последовательности точек
const TARGETS_CALIBRATION = ["top_left", "top_right", "center", "bottom_left", "bottom_right"];
const TARGETS_STIMULI = ["top_left", "top_right", "bottom_left", "bottom_right"];

function Login({ onLoginSuccess }) {
  const [user, setUser] = useState({
    username: "",
    password: "",
  });

  // Состояния для CAPTCHA
  const [captchaOpen, setCaptchaOpen] = useState(false);       // Открыто ли окно CAPTCHA
  const [captchaToken, setCaptchaToken] = useState(null);      // Токен после успешной CAPTCHA
  const [captchaStatus, setCaptchaStatus] = useState("");      // Статус сообщения
  const [captchaMessage, setCaptchaMessage] = useState("");    // Главное сообщение
  const [currentTarget, setCurrentTarget] = useState(null);    // Текущая точка на экране
  const [isProcessing, setIsProcessing] = useState(false);     // Идет ли процесс

  const [open, setOpen] = useState(false);

  // Refs для видео и canvas
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // Очистка камеры при размонтировании компонента
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleChange = (event) => {
    setUser({ ...user, [event.target.name]: event.target.value });
  };

  // === ФУНКЦИИ CAPTCHA ===

  // 1. Инициализация камеры
  const initCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      return true;
    } catch (err) {
      console.error("Ошибка доступа к камере:", err);
      setCaptchaStatus("❌ Ошибка доступа к камере: " + err.message);
      return false;
    }
  };

  // 2. Захват кадров в течение duration секунд
  const captureFrames = (durationSeconds) => {
    return new Promise((resolve) => {
      const frames = [];
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      // Устанавливаем размер canvas равным реальному размеру видео
      canvas.width = video.videoWidth || 1280;
      canvas.height = video.videoHeight || 720;

      const startTime = Date.now();
      const interval = 250; // 4 кадра в секунду (10 кадров за 2.5 сек)

      const timer = setInterval(() => {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        // КАЧЕСТВО 0.95 — критически важно для точности трекинга!
        const base64 = canvas.toDataURL("image/jpeg", 0.95);
        frames.push(base64);

        if (Date.now() - startTime >= durationSeconds * 1000) {
          clearInterval(timer);
          resolve(frames);
        }
      }, interval);
    });
  };

  // 3. Остановка камеры
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  // 4. Основной процесс CAPTCHA
  const startCaptchaProcess = async () => {
    setCaptchaOpen(true);
    setIsProcessing(true);
    setCaptchaToken(null);
    setCaptchaStatus("Инициализация камеры...");
    setCaptchaMessage("Подготовка к калибровке");
    setCurrentTarget(null);

    // Инициализируем камеру
    if (!await initCamera()) {
      setIsProcessing(false);
      return;
    }

    // Ждём пока видео готово
    await new Promise(r => setTimeout(r, 1000));

    try {
      // === ЭТАП 1: КАЛИБРОВКА ===
      setCaptchaMessage("Калибровка: смотрите на красную точку");
      const calibFrames = {};

      for (const target of TARGETS_CALIBRATION) {
        setCurrentTarget(target);
        setCaptchaStatus(`Калибровка: смотрите в ${target.replace('_', ' ')}...`);
        calibFrames[target] = await captureFrames(2.0);
        setCurrentTarget(null);
        await new Promise(r => setTimeout(r, 300));
      }

      setCaptchaStatus("Отправка данных калибровки...");
      
      // Отправляем на Python
      const calibResponse = await fetch(`${PYTHON_API_URL}/api/calibrate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ frames_by_target: calibFrames })
      });
      const calibResult = await calibResponse.json();

      if (!calibResult.success) {
        throw new Error(calibResult.error || "Ошибка калибровки");
      }

      const sessionId = calibResult.session_id;
      setCaptchaStatus("✅ Калибровка успешна! Запуск проверки...");
      await new Promise(r => setTimeout(r, 800));

      // === ЭТАП 2: СТИМУЛЫ (РАНДОМИЗИРОВАННЫЕ) ===
      setCaptchaMessage("Следите за появляющимися метками");
      const shuffledStimuli = [...TARGETS_STIMULI].sort(() => Math.random() - 0.5);
      const stimulusFrames = {};

      for (const target of shuffledStimuli) {
        setCurrentTarget(target);
        setCaptchaStatus(`Смотрите на метку...`);
        stimulusFrames[target] = await captureFrames(2.5);
        setCurrentTarget(null);
        await new Promise(r => setTimeout(r, 300));
      }

      setCaptchaStatus("Проверка результатов...");

      // Отправляем стимулы на Python
      const verifyResponse = await fetch(`${PYTHON_API_URL}/api/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          frames_by_target: stimulusFrames,
          sequence: shuffledStimuli
        })
      });
      const verifyResult = await verifyResponse.json();

      stopCamera();

      if (verifyResult.success) {
        setCaptchaToken(verifyResult.token);
        setCaptchaStatus("✅ CAPTCHA успешно пройдена!");
        setCaptchaMessage("Можете войти в систему");
        await new Promise(r => setTimeout(r, 1000));
        setCaptchaOpen(false);
      } else {
        throw new Error(verifyResult.error || "Не удалось подтвердить");
      }
    } catch (err) {
      console.error("Ошибка CAPTCHA:", err);
      stopCamera();
      setCaptchaStatus(`❌ ${err.message}`);
      await new Promise(r => setTimeout(r, 2000));
      setCaptchaOpen(false);
    } finally {
      setIsProcessing(false);
    }
  };

  // === ЛОГИН (обновлён) ===
  const login = () => {
    // Добавляем captcha_token к запросу
    const loginData = {
      ...user,
      captcha_token: captchaToken
    };

    fetch(SERVER_URL + "login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginData),
    })
      .then((res) => {
        const jwtToken = res.headers.get("Authorization");
        if (jwtToken !== null) {
          sessionStorage.setItem("jwt", jwtToken);
          onLoginSuccess();
        } else {
          setOpen(true);
        }
      })
      .catch((err) => {
        console.error(err);
        setOpen(true);
      });
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="80vh"
    >
      <Stack spacing={2} alignItems="center" sx={{ width: 300 }}>
        <TextField
          name="username"
          label="Username"
          fullWidth
          onChange={handleChange}
        />
        <TextField
          type="password"
          name="password"
          label="Password"
          fullWidth
          onChange={handleChange}
        />

        {/* Кнопка CAPTCHA */}
        <Button
          variant="outlined"
          color="primary"
          fullWidth
          onClick={startCaptchaProcess}
          disabled={isProcessing}
          startIcon={
            captchaToken ? <CheckCircleIcon color="success" /> :
            isProcessing ? <CircularProgress size={20} /> : null
          }
          sx={{
            mt: 1,
            borderColor: captchaToken ? "success.main" : "primary.main",
            color: captchaToken ? "success.main" : "primary.main"
          }}
        >
          {captchaToken
            ? "CAPTCHA пройдена ✓"
            : isProcessing
              ? "Проверка..."
              : "📷 Пройти CAPTCHA"}
        </Button>

        {/* Кнопка Login — неактивна без CAPTCHA */}
        <Button
          variant="contained"
          fullWidth
          onClick={login}
          disabled={!captchaToken}
          sx={{ mt: 1 }}
        >
          Login
        </Button>
      </Stack>

      {/* === МОДАЛЬНОЕ ОКНО CAPTCHA === */}
      <Dialog
        open={captchaOpen}
        fullScreen
        sx={{
          "& .MuiDialog-paper": {
            backgroundColor: "rgba(0, 0, 0, 0.9)",
            overflow: "hidden"
          }
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          {/* Заголовок */}
          <Box sx={{ position: "absolute", top: 40, textAlign: "center", zIndex: 10 }}>
            <Typography variant="h4" color="white" gutterBottom>
              {captchaMessage}
            </Typography>
            <Typography variant="body1" color="gray">
              {captchaStatus}
            </Typography>
          </Box>

          {/* Красная точка (целевой стимул) */}
          {currentTarget && (
            <Box
              sx={{
                position: "absolute",
                width: 40,
                height: 40,
                borderRadius: "50%",
                backgroundColor: "red",
                boxShadow: "0 0 20px red, 0 0 40px red",
                ...POSITIONS[currentTarget],
                zIndex: 5
              }}
            />
          )}

          {/* Видео с камеры (маленькое превью в углу) */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{
              position: "absolute",
              bottom: 20,
              right: 20,
              width: 200,
              height: 150,
              border: "2px solid white",
              borderRadius: 8,
              objectFit: "cover",
              backgroundColor: "#000",
              zIndex: 10
            }}
          />

          {/* Скрытый canvas для захвата кадров */}
          <canvas ref={canvasRef} style={{ display: "none" }} />

          {/* Индикатор загрузки */}
          {isProcessing && (
            <CircularProgress
              size={60}
              sx={{ color: "white", position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)" }}
            />
          )}
        </Box>
      </Dialog>

      {/* Snackbar для ошибок логина */}
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
        message="Login failed: Check your username, password or CAPTCHA"
      />
    </Box>
  );
}

export default Login;
