import React from "react";
import { Box, Typography, Card, CardContent, IconButton, useTheme } from "@mui/material";
import { CalendarToday, ChevronRight, Event } from "@mui/icons-material";
//import { motion } from "framer-motion";

const events = [
  { id: 1, date: "2023-10-25", title: "ТО Toyota", color: "#4caf50" },
  { id: 2, date: "2023-10-27", title: "Замена масла", color: "#2196f3" }
];

const CalendarWidget = () => {
  const theme = useTheme();

  return (
    <Card sx={{ 
      height: '100%',
      borderRadius: 3,
      background: theme.palette.background.paper,
      boxShadow: theme.shadows[2],
      display: 'flex',
      flexDirection: 'column'
    }}>
      <CardContent sx={{ p: 2, flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <CalendarToday sx={{ 
            color: theme.palette.primary.main, 
            mr: 1,
            fontSize: '1.2rem'
          }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
            Календарь
          </Typography>
        </Box>

        <Box sx={{ mt: 1 }}>
          {events.map((event) => (
            <Box key={event.id} sx={{ 
              display: 'flex', 
              alignItems: 'center',
              mb: 1.5,
              gap: 1
            }}>
              <Event sx={{ 
                color: event.color, 
                fontSize: '0.9rem' 
              }} />
              <Typography variant="body2" noWrap sx={{ flex: 1 }}>
                {event.title}
              </Typography>
              <Typography variant="caption" sx={{ 
                color: theme.palette.text.secondary,
                whiteSpace: 'nowrap'
              }}>
                {new Date(event.date).toLocaleDateString('ru-RU', {
                  day: 'numeric',
                  month: 'short'
                })}
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>

      <Box sx={{ 
        px: 2, 
        pb: 1,
        textAlign: 'right'
      }}>
        <IconButton size="small" sx={{ color: theme.palette.primary.main }}>
          <ChevronRight fontSize="small" />
        </IconButton>
      </Box>
    </Card>
  );
};

export default CalendarWidget;