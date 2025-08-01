import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent,
  CircularProgress,
  IconButton,
  Tooltip,
  Button
} from '@mui/material';
import {
  WbSunny,
  Cloud,
  Opacity,
  AcUnit,
  Thunderstorm,
  LocationOn,
  Refresh,
  ErrorOutline
} from '@mui/icons-material';

const WeatherWidget = () => {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  

  // Функция для получения погоды
  
  const fetchWeather = async (cityName) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=ed2822603fef85060d62f746a32eeb7e&lang=ru`
      );
      
      if (!response.ok) throw new Error('Ошибка получения погоды');
      
      const data = await response.json();
      setWeather({
        temp: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        description: data.weather[0].description,
        icon: data.weather[0].main,
        wind: data.wind.speed,
        humidity: data.main.humidity
      });
      setCity(cityName);
    } catch (err) {
      setError(err.message);
      // Автоматический повтор через 5 секунд (макс 3 попытки)
      if (retryCount < 3) {
        setTimeout(() => {
          setRetryCount(retryCount + 1);
          fetchWeather(cityName);
        }, 5000);
      }
    } finally {
      setLoading(false);
    }
  };

  // Определение местоположения и загрузка погоды
 useEffect(() => {
  const getCityByCoords = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=ed2822603fef85060d62f746a32eeb7e`
      );
      if (!response.ok) throw new Error('Ошибка определения города');
      const data = await response.json();
      return data[0]?.name || 'Moscow';
    } catch (err) {
      console.error('Geocoding error:', err);
      return 'Moscow';
    }
  };

  const fetchWeather = async (cityName) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=ed2822603fef85060d62f746a32eeb7e&lang=ru`
      );
      
      if (!response.ok) throw new Error('Ошибка получения погоды');
      
      const data = await response.json();
      setWeather({
        temp: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        description: data.weather[0].description,
        icon: data.weather[0].main,
        wind: data.wind.speed,
        humidity: data.main.humidity
      });
      setCity(cityName);
    } catch (err) {
      setError(err.message);
      if (retryCount < 3) {
        setTimeout(() => {
          setRetryCount(retryCount + 1);
          fetchWeather(cityName);
        }, 5000);
      }
    } finally {
      setLoading(false);
    }
  };

  const getWeather = async () => {
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            const detectedCity = await getCityByCoords(latitude, longitude);
            await fetchWeather(detectedCity);
          },
          async (err) => {
            console.warn('Geolocation error:', err);
            await fetchWeather('Moscow');
          }
        );
      } else {
        await fetchWeather('Moscow');
      }
    } catch (err) {
      console.error('Initialization error:', err);
      setError('Не удалось определить местоположение');
      setLoading(false);
    }
  };

  getWeather();
}, [retryCount]); // Добавляем retryCount как зависимость

  const getWeatherIcon = (iconType) => {
    const iconProps = { fontSize: "large" };
    switch(iconType) {
      case 'Clear': return <WbSunny {...iconProps} color="warning" />;
      case 'Clouds': return <Cloud {...iconProps} color="action" />;
      case 'Rain': return <Opacity {...iconProps} color="primary" />;
      case 'Snow': return <AcUnit {...iconProps} color="info" />;
      case 'Thunderstorm': return <Thunderstorm {...iconProps} color="error" />;
      default: return <WbSunny {...iconProps} />;
    }
  };

  const handleRefresh = () => {
    setRetryCount(0);
    if (city) {
      fetchWeather(city);
    } else {
      window.location.reload();
    }
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
      <CircularProgress />
    </Box>
  );

  if (error) return (
    <Card sx={{ p: 2, textAlign: 'center', background: 'rgba(255, 235, 238, 0.6)' }}>
      <ErrorOutline color="error" sx={{ fontSize: 40 }} />
      <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>
      <Button 
        variant="outlined" 
        color="error" 
        sx={{ mt: 2 }}
        onClick={handleRefresh}
        startIcon={<Refresh />}
      >
        Попробовать снова
      </Button>
    </Card>
  );

  return (
  <Card sx={{ 
    minWidth: 280,
    background: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    borderRadius: 3,
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    height: '100%', // Растягиваем на всю доступную высоту
    minHeight: 320 // Минимальная высота (можно регулировать)
  }}>
    <Tooltip title="Обновить">
      <IconButton
        sx={{ position: 'absolute', right: 8, top: 8 }}
        onClick={handleRefresh}
      >
        <Refresh fontSize="small" />
      </IconButton>
    </Tooltip>
    
    <CardContent sx={{ 
      flexGrow: 1, // Растягиваем содержимое
      display: 'flex',
      flexDirection: 'column',
      pb: 3 // Увеличиваем отступ снизу
    }}>
      {/* Блок локации */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        mb: 2,
        minHeight: 40
      }}>
        <LocationOn color="primary" sx={{ mr: 1 }} />
        <Typography variant="h6" component="div">
          {city}
        </Typography>
      </Box>
      
      {/* Основная информация */}
      <Box sx={{ 
        flexGrow: 1,
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        {/* Температура */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 3,
          minHeight: 80
        }}>
          {weather && getWeatherIcon(weather.icon)}
          <Typography variant="h3" sx={{ ml: 2, fontWeight: 300 }}>
            {weather?.temp}°C
          </Typography>
        </Box>
        
        {/* Доп. параметры */}
        <Box>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Ощущается как: {weather?.feelsLike}°C
          </Typography>
          
          <Box sx={{ 
            display: 'flex',
            justifyContent: 'space-between',
            gap: 2,
            mt: 'auto' // Прижимаем к низу
          }}>
            <Box>
              <Typography variant="body2">Ветер</Typography>
              <Typography>{weather?.wind} м/с</Typography>
            </Box>
            <Box>
              <Typography variant="body2">Влажность</Typography>
              <Typography>{weather?.humidity}%</Typography>
            </Box>
            <Box>
              <Typography variant="body2">Погода</Typography>
              <Typography textTransform="capitalize">
                {weather?.description}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </CardContent>
  </Card>
);
};

export default WeatherWidget;