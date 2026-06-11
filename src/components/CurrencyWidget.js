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
        setError(null);
        
        // Список API для попыток загрузки (fallback)
        const apiEndpoints = [
          'https://api.exchangerate-api.com/v4/latest/USD',
          'https://open.er-api.com/v6/latest/USD'
        ];
        
        let data = null;
        let lastError = null;
        
        // Пробуем загрузить с каждого API по очереди
        for (const endpoint of apiEndpoints) {
          try {
            // Добавляем timeout для запроса (5 секунд)
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            
            const response = await fetch(endpoint, {
              method: 'GET',
              headers: {
                'Accept': 'application/json',
              },
              signal: controller.signal,
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const responseData = await response.json();
            
            // Проверяем формат ответа (разные API могут иметь разную структуру)
            let rates = null;
            if (responseData.rates) {
              rates = responseData.rates;
            } else if (responseData.USD) {
              // Альтернативный формат
              rates = responseData;
            }
            
            // Проверяем наличие нужных валют
            if (rates && rates.EUR && rates.CNY && rates.RUB) {
              data = responseData;
              break; // Успешно загрузили, выходим из цикла
            } else {
              throw new Error('Неполные данные от API');
            }
          } catch (err) {
            lastError = err;
            if (err.name === 'AbortError') {
              console.warn(`Таймаут при загрузке с ${endpoint}`);
            } else {
              console.warn(`Ошибка загрузки с ${endpoint}:`, err);
            }
            continue; // Пробуем следующий API
          }
        }
        
        if (!data || !data.rates) {
          throw lastError || new Error('Все API недоступны');
        }
        
        // Получаем нужные валюты: USD, EUR, CNY, RUB
        setRates({
          USD: 1, // Базовая валюта
          EUR: data.rates.EUR,
          CNY: data.rates.CNY,
          RUB: data.rates.RUB
        });
        
      } catch (err) {
        console.error('Ошибка загрузки курсов валют:', err);
        setError(err.message || 'Не удалось загрузить курсы валют. Проверьте подключение к интернету.');
      } finally {
        setLoading(false);
      }
    };

    fetchCurrencyRates();
    
    // Обновляем каждые 30 минут
    const interval = setInterval(fetchCurrencyRates, 30 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Функция для получения курса валюты к рублю
  const getRateToRub = (currencyRate) => {
    if (!rates || !rates.RUB) return 0;
    // currencyRate - это курс валюты к USD, нужно умножить на курс USD к RUB
    return currencyRate * rates.RUB;
  };

  // Функция для расчета курса покупки (банк покупает у клиента - ниже среднего)
  const getBuyRate = (currencyRate, spreadPercent = 1.5) => {
    const baseRate = getRateToRub(currencyRate);
    if (baseRate === 0) return '...';
    // Курс покупки ниже среднего на spreadPercent%
    return (baseRate * (1 - spreadPercent / 100)).toFixed(2);
  };

  // Функция для расчета курса продажи (банк продает клиенту - выше среднего)
  const getSellRate = (currencyRate, spreadPercent = 1.5) => {
    const baseRate = getRateToRub(currencyRate);
    if (baseRate === 0) return '...';
    // Курс продажи выше среднего на spreadPercent%
    return (baseRate * (1 + spreadPercent / 100)).toFixed(2);
  };

  // Функция для USD (базовая валюта)
  const getUSDRates = () => {
    if (!rates || !rates.RUB) return { buy: '...', sell: '...' };
    const baseRate = rates.RUB;
    return {
      buy: (baseRate * 0.985).toFixed(2), // Покупка на 1.5% ниже
      sell: (baseRate * 1.015).toFixed(2)  // Продажа на 1.5% выше
    };
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
      <Card sx={{ mb: 2, borderRadius: 2, background: 'transparent', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
        <CardContent sx={{ p: 2 }}>
          <Alert severity="warning" sx={{ fontSize: '0.875rem' }}>
            Не удалось загрузить курсы валют
            {process.env.NODE_ENV === 'development' && (
              <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                {error}
              </Typography>
            )}
          </Alert>
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
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {/* USD */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: "black", minWidth: "50px" }}>
                1 USD
              </Typography>
              <Box sx={{ display: "flex", gap: 2, alignItems: "center", flex: 1, justifyContent: "flex-end" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Typography variant="caption" sx={{ color: "rgba(0,0,0,0.6)" }}>
                    Покупка:
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#2e7d32", fontWeight: 500 }}>
                    {getUSDRates().buy} ₽
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Typography variant="caption" sx={{ color: "rgba(0,0,0,0.6)" }}>
                    Продажа:
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#d32f2f", fontWeight: 500 }}>
                    {getUSDRates().sell} ₽
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* EUR */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: "black", minWidth: "50px" }}>
                1 EUR
              </Typography>
              <Box sx={{ display: "flex", gap: 2, alignItems: "center", flex: 1, justifyContent: "flex-end" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Typography variant="caption" sx={{ color: "rgba(0,0,0,0.6)" }}>
                    Покупка:
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#2e7d32", fontWeight: 500 }}>
                    {getBuyRate(rates.EUR)} ₽
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Typography variant="caption" sx={{ color: "rgba(0,0,0,0.6)" }}>
                    Продажа:
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#d32f2f", fontWeight: 500 }}>
                    {getSellRate(rates.EUR)} ₽
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* CNY */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: "black", minWidth: "50px" }}>
                1 CNY
              </Typography>
              <Box sx={{ display: "flex", gap: 2, alignItems: "center", flex: 1, justifyContent: "flex-end" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Typography variant="caption" sx={{ color: "rgba(0,0,0,0.6)" }}>
                    Покупка:
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#2e7d32", fontWeight: 500 }}>
                    {getBuyRate(rates.CNY)} ₽
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Typography variant="caption" sx={{ color: "rgba(0,0,0,0.6)" }}>
                    Продажа:
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#d32f2f", fontWeight: 500 }}>
                    {getSellRate(rates.CNY)} ₽
                  </Typography>
                </Box>
              </Box>
            </Box>
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