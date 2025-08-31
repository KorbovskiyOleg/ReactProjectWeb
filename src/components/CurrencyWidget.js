import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  CircularProgress,
  Alert
} from '@mui/material';
import { CurrencyExchange as CurrencyIcon } from '@mui/icons-material';

const CurrencyWidget = () => {
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCurrencyRates = async () => {
      try {
        setLoading(true);
        // Бесплатный API (можно заменить на любой другой)
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        
        if (!response.ok) {
          throw new Error('Ошибка загрузки курсов валют');
        }
        
        const data = await response.json();
        
        // Получаем нужные валюты: USD, EUR, CNY
        setRates({
          USD: 1, // Базовая валюта
          EUR: data.rates.EUR,
          CNY: data.rates.CNY,
          RUB: data.rates.RUB // Для конвертации в рубли
        });
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrencyRates();
    
    // Обновляем каждые 30 минут
    const interval = setInterval(fetchCurrencyRates, 30 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Функция для конвертации в рубли
  const convertToRubles = (amount, rate) => {
    if (!rates || !rates.RUB) return '...';
    return (amount * rates.RUB).toFixed(2);
  };

  if (loading) {
    return (
      <Card sx={{ mb: 2, borderRadius: 2, background: 'transparent', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
        <CardContent sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress size={24} />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card sx={{ mb: 2, borderRadius: 2, background: 'transparent' }}>
        <CardContent sx={{ p: 2 }}>
          <Alert severity="error">Не удалось загрузить курсы валют</Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        mb: 2,
        borderRadius: 2,
        boxShadow: "none",
        background: "transparent",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        backdropFilter: "blur(8px)",
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <CurrencyIcon sx={{ color: "white", mr: 1 }} />
          <Typography variant="h6" component="div" sx={{ color: "black" }}>
            Курс валют
          </Typography>
        </Box>
        
        {rates ? (
          <Box sx={{ display: "flex", justifyContent: "space-between", color: "black" }}>
            <Typography variant="body1">
              USD: {convertToRubles(1, rates.USD)} ₽
            </Typography>
            <Typography variant="body1">
              EUR: {convertToRubles(rates.EUR, rates.EUR)} ₽
            </Typography>
            <Typography variant="body1">
              CNY: {convertToRubles(rates.CNY, rates.CNY)} ₽
            </Typography>
          </Box>
        ) : (
          <Typography variant="body1" sx={{ color: "black" }}>
            Данные недоступны
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default CurrencyWidget;