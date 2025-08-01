import React, { useState } from "react";
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  IconButton, 
  Grid,
  useTheme
} from "@mui/material";
import { 
  ChevronLeft, 
  ChevronRight
} from "@mui/icons-material";
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  isSameMonth,
  isToday,
  startOfWeek,
  endOfWeek,
  addDays,
  getDay
} from "date-fns";
import { ru } from "date-fns/locale";

const CalendarWidget = () => {
  const theme = useTheme();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Правильное определение начала недели (понедельник)
  const startOfWeekCorrected = (date) => {
    const sunday = startOfWeek(date);
    return addDays(sunday, 1); // Добавляем 1 день, чтобы неделя начиналась с понедельника
  };

  const endOfWeekCorrected = (date) => {
    const sunday = endOfWeek(date);
    return addDays(sunday, 1); // Добавляем 1 день, чтобы неделя заканчивалась воскресеньем
  };

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const startDate = startOfWeekCorrected(monthStart);
  const endDate = endOfWeekCorrected(monthEnd);

  const days = [];
  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  
  let day = startDate;
  while (day <= endDate) {
    days.push(day);
    day = addDays(day, 1);
  }

  // Проверка текущего дня
  console.log("Сегодня:", format(new Date(), 'EEEE, dd.MM.yyyy')); // Для отладки

  return (
    <Card sx={{ 
      height: '100%',
      borderRadius: 3,
      background: theme.palette.mode === 'dark' 
    ? 'rgba(25, 25, 35, 0.7)'  // Для темной темы (последнее число - прозрачность)
    : 'rgba(255, 255, 255, 0.4)', // Для светлой темы
      boxShadow: theme.shadows[2],
      display: 'flex',
      flexDirection: 'column'
    }}>
      <CardContent sx={{ p: 2 }}>
        {/* Заголовок календаря с навигацией */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          mb: 2
        }}>
          <IconButton onClick={prevMonth} size="small">
            <ChevronLeft />
          </IconButton>
          
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {format(currentMonth, 'LLLL yyyy', { locale: ru })}
          </Typography>
          
          <IconButton onClick={nextMonth} size="small">
            <ChevronRight />
          </IconButton>
        </Box>

        {/* Дни недели */}
        <Grid container columns={7} sx={{ mb: 1 }}>
          {weekDays.map((day) => (
            <Grid 
              item 
              xs={1} 
              key={day}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                minWidth: 'calc(100%/7)',
                maxWidth: 'calc(100%/7)',
                bgcolor: theme.palette.mode === 'dark' 
                  ? 'rgba(255, 255, 255, 0.05)' 
                  : 'rgba(0, 0, 0, 0.02)',
                borderRadius: 1,
                py: 0.5
              }}
            >
              <Typography 
                variant="caption" 
                sx={{ 
                  color: theme.palette.mode === 'dark' 
                    ? theme.palette.primary.light 
                    : theme.palette.primary.dark,
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  textAlign: 'center',
                  width: '100%',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                {day}
              </Typography>
            </Grid>
          ))}
        </Grid>

        {/* Ячейки календаря */}
        <Grid container columns={7}>
          {days.map((day, i) => {
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isDayToday = isToday(day);
            const dayNumber = format(day, 'd');
            const dayOfWeek = getDay(day); // 0-6 (воскресенье-суббота)

            // Для отладки
            if (isDayToday) {
              console.log("Найден сегодняшний день:", format(day, 'EEEE, dd.MM.yyyy'), "День недели:", dayOfWeek);
            }

            return (
              <Grid 
                item 
                xs={1} 
                key={i}
                sx={{ 
                  height: '36px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minWidth: 'calc(100%/7)',
                  maxWidth: 'calc(100%/7)'
                }}
              >
                <Box
                  sx={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isDayToday ? '#fff' : 
                          !isCurrentMonth ? theme.palette.text.disabled :
                          theme.palette.text.primary,
                    fontWeight: isDayToday ? 600 : 'normal',
                    fontSize: '0.85rem',
                    bgcolor: isDayToday ? theme.palette.primary.main : 'transparent',
                    position: 'relative',
                    '&:hover': {
                      bgcolor: !isDayToday ? theme.palette.action.hover : theme.palette.primary.dark
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  {dayNumber}
                  {isDayToday && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '-2px',
                        left: '-2px',
                        right: '-2px',
                        bottom: '-2px',
                        border: `2px solid ${theme.palette.primary.light}`,
                        borderRadius: '50%',
                        animation: 'pulse 2s infinite'
                      }}
                    />
                  )}
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default CalendarWidget;