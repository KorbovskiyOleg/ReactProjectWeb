import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Switch, 
  FormControlLabel, 
  //Divider, 
  Button,
  Select, 
  MenuItem,
  InputLabel,
  FormControl,
  Slider,
  Stack,
  //TextField
} from '@mui/material';
import { motion } from 'framer-motion';
import { CloudUpload, Palette, Language, Notifications } from '@mui/icons-material';
import { 
  
  VolumeUp, // Иконка громкости
  VolumeDown,
  VolumeOff 
} from '@mui/icons-material';


const Settings = () => {
  // Состояния для настроек
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('ru');
  const [notifications, setNotifications] = useState(true);
  const [odometerUnit, setOdometerUnit] = useState('km');
  const [backupEnabled, setBackupEnabled] = useState(false);
  const [volume, setVolume] = useState(70);


  // Обработчики
  const handleExportBackup = () => {
    console.log('Создание резервной копии...');
    // Здесь будет логика экспорта
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Настройки приложения
      </Typography>

      {/* Блок внешнего вида */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <Box sx={{ mb: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Palette color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6">Внешний вид</Typography>
          </Box>
          
          <FormControlLabel
            control={
              <Switch 
                checked={darkMode} 
                onChange={() => setDarkMode(!darkMode)} 
                color="primary"
              />
            }
            label="Тёмная тема"
            sx={{ mb: 1 }}
          />
          
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Цвет акцента</InputLabel>
            <Select
              value={'blue'}
              label="Цвет акцента"
              onChange={(e) => console.log(e.target.value)}
            >
              <MenuItem value="blue">Синий (по умолчанию)</MenuItem>
              <MenuItem value="green">Зелёный</MenuItem>
              <MenuItem value="red">Красный</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </motion.div>

      {/* Блок настроек звука */}
<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
  <Box sx={{ 
    mb: 4, 
    p: 3, 
    bgcolor: 'background.paper', 
    borderRadius: 2, 
    boxShadow: 1 
  }}>
    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
      <VolumeUp color="primary" sx={{ mr: 1 }} />
      Настройки звука
    </Typography>

    <Box sx={{ width: '100%', px: 2 }}>
      <Stack spacing={2} direction="row" alignItems="center">
        {volume === 0 ? (
          <VolumeOff color="action" />
        ) : volume < 50 ? (
          <VolumeDown color="action" />
        ) : (
          <VolumeUp color="action" />
        )}
        
        <Slider
          value={volume}
          onChange={(e, newValue) => setVolume(newValue)}
          aria-labelledby="volume-slider"
          sx={{
            color: 'primary.main',
            '& .MuiSlider-thumb': {
              width: 16,
              height: 16,
              transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
              '&:hover, &.Mui-focusVisible': {
                boxShadow: '0 0 0 8px rgba(25, 118, 210, 0.16)'
              },
              '&.Mui-active': {
                width: 20,
                height: 20
              }
            }
          }}
        />
        
        <Typography variant="body1" sx={{ minWidth: 40, textAlign: 'right' }}>
          {volume}%
        </Typography>
      </Stack>
    </Box>

    <FormControlLabel
      control={
        <Switch 
          checked={volume > 0}
          onChange={(e) => setVolume(e.target.checked ? 50 : 0)}
          color="primary"
        />
      }
      label="Звуковые уведомления"
      sx={{ mt: 2 }}
    />
  </Box>
</motion.div>

      {/* Блок языка и единиц измерения */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <Box sx={{ mb: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Language color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6">Язык и единицы измерения</Typography>
          </Box>
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Язык</InputLabel>
            <Select
              value={language}
              label="Язык"
              onChange={(e) => setLanguage(e.target.value)}
            >
              <MenuItem value="ru">Русский</MenuItem>
              <MenuItem value="en">English</MenuItem>
            </Select>
          </FormControl>
          
          <FormControlLabel
            control={
              <Switch 
                checked={odometerUnit === 'km'} 
                onChange={() => setOdometerUnit(odometerUnit === 'km' ? 'mi' : 'km')} 
                color="primary"
              />
            }
            label={`Пробег в ${odometerUnit === 'km' ? 'километрах' : 'милях'}`}
          />
        </Box>
      </motion.div>

      {/* Блок уведомлений и резервных копий */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <Box sx={{ mb: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Notifications color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6">Уведомления и данные</Typography>
          </Box>
          
          <FormControlLabel
            control={
              <Switch 
                checked={notifications} 
                onChange={() => setNotifications(!notifications)} 
                color="primary"
              />
            }
            label="Email-уведомления"
            sx={{ mb: 2 }}
          />
          
          <FormControlLabel
            control={
              <Switch 
                checked={backupEnabled} 
                onChange={() => setBackupEnabled(!backupEnabled)} 
                color="primary"
              />
            }
            label="Автоматическое резервное копирование"
            sx={{ mb: 3 }}
          />
          
          <Button
            variant="outlined"
            startIcon={<CloudUpload />}
            onClick={handleExportBackup}
            fullWidth
          >
            Создать резервную копию сейчас
          </Button>
        </Box>
      </motion.div>

      {/* Кнопка сохранения */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.4 }}
      >
        <Button 
          variant="contained" 
          size="large" 
          fullWidth
          sx={{ mt: 2, py: 1.5 }}
        >
          Сохранить настройки
        </Button>
      </motion.div>
    </Box>
  );
};

export default Settings;