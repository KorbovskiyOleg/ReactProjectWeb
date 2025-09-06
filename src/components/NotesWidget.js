import React, { useState, useEffect } from 'react';
import { 
  Card, 
  IconButton, 
  Box, 
  Typography,
  useTheme,
  Button
} from '@mui/material';
import { 
  Add as AddIcon, 
  Delete as DeleteIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';

const NotesWidget = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);

  // Загрузка заметок из localStorage при монтировании
  useEffect(() => {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  // Сохранение заметок в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const handleAddNote = () => {
    navigate('/new-note');
  };

  const handleEditNote = (id) => {
    navigate(`/edit-note/${id}`);
  };

  return (
    <Card sx={{
      height: '100%',
      borderRadius: 3,
      bgcolor: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(8px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      p: 2
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          📓 Блокнот
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={handleAddNote}
          size="small"
        >
          Новая
        </Button>
      </Box>
      
      {/* Список заметок */}
      <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
        {notes.length === 0 ? (
          <Box sx={{ 
            textAlign: 'center', 
            py: 4,
            color: 'text.secondary'
          }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Заметок пока нет
            </Typography>
            <Button 
              variant="outlined" 
              startIcon={<AddIcon />}
              onClick={handleAddNote}
              size="small"
            >
              Создать первую
            </Button>
          </Box>
        ) : (
          notes.map(note => (
            <Box 
              key={note.id}
              sx={{
                p: 2,
                mb: 1,
                borderRadius: 2,
                bgcolor: theme.palette.mode === 'dark' 
                  ? 'rgba(255,255,255,0.05)' 
                  : 'rgba(0,0,0,0.03)',
                border: '1px solid',
                borderColor: 'divider',
                '&:hover': {
                  bgcolor: theme.palette.mode === 'dark' 
                    ? 'rgba(255,255,255,0.08)' 
                    : 'rgba(0,0,0,0.05)'
                }
              }}
            >
              {/* Заменено отображение текста на Markdown */}
              <Box sx={{ 
                mb: 1,
                maxHeight: 60,
                overflow: 'hidden',
                '& *': {
                  margin: 0,
                  padding: 0,
                  lineHeight: 1.4
                },
                '& h1, & h2, & h3, & h4, & h5, & h6': {
                  fontSize: '14px !important',
                  fontWeight: 600
                },
                '& p': {
                  fontSize: '14px'
                },
                '& ul, & ol': {
                  pl: 2,
                  fontSize: '14px'
                }
              }}>
                <MDEditor.Markdown 
                  source={note.text.length > 100 ? note.text.substring(0, 100) + '...' : note.text} 
                  style={{ 
                    fontSize: '14px',
                    background: 'transparent'
                  }}
                />
              </Box>
              
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'flex-end',
                gap: 0.5
              }}>
                <IconButton 
                  onClick={() => handleEditNote(note.id)}
                  size="small"
                  color="primary"
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton 
                  onClick={() => deleteNote(note.id)}
                  size="small"
                  color="error"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          ))
        )}
      </Box>
    </Card>
  );
};

export default NotesWidget;