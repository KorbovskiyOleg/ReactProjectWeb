import React, { useState, useEffect } from 'react';
import { 
  Card, 
  IconButton, 
  Box, 
  Typography,
  useTheme,
  Button,
  CircularProgress
} from '@mui/material';
import { 
  Add as AddIcon, 
  Delete as DeleteIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';
import { SERVER_URL } from '../constants';

const NotesWidget = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Загрузка заметок из бэкенда
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("jwt");
      
      const response = await fetch(`${SERVER_URL}api/notes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // вот здесь изменил было const notesData = await response.json();
      const data = await response.json();
      const notesData = data._embedded?.notes || [];
      
      // ✅ Гарантируем, что notesData будет массивом
      setNotes(Array.isArray(notesData) ? notesData : []);
      
    } catch (error) {
      console.error('Error fetching notes:', error);
      setError(error.message);
      // Fallback to localStorage if backend is not available
      const savedNotes = localStorage.getItem('notes');
      if (savedNotes) {
        try {
          const parsedNotes = JSON.parse(savedNotes);
          setNotes(Array.isArray(parsedNotes) ? parsedNotes : []);
        } catch (parseError) {
          console.error('Error parsing localStorage notes:', parseError);
          setNotes([]);
        }
      } else {
        setNotes([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteNote = async (id) => {
    try {
      const token = sessionStorage.getItem("jwt");
      const response = await fetch(`${SERVER_URL}api/notes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setNotes(prevNotes => 
        Array.isArray(prevNotes) 
          ? prevNotes.filter(note => note.noteId !== id)
          : []
      );
      
    } catch (error) {
      console.error('Error deleting note:', error);
      alert('Ошибка при удалении заметки');
    }
  };

  const handleAddNote = () => {
    navigate('/new-note');
  };

  const handleEditNote = (id) => {
    navigate(`/edit-note/${id}`);
  };

  // ✅ Гарантируем, что notes всегда массив
  const safeNotes = Array.isArray(notes) ? notes : [];

  if (loading) {
    return (
      <Card sx={{
        height: '100%',
        borderRadius: 3,
        bgcolor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        p: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <CircularProgress />
      </Card>
    );
  }

  if (error) {
    return (
      <Card sx={{
        height: '100%',
        borderRadius: 3,
        bgcolor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        p: 2
      }}>
        <Typography color="error">Ошибка загрузки: {error}</Typography>
        <Button 
          variant="outlined" 
          onClick={fetchNotes}
          size="small"
          sx={{ mt: 2 }}
        >
          Повторить попытку
        </Button>
      </Card>
    );
  }

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
          📓 Блокнот ({safeNotes.length})
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
        {safeNotes.length === 0 ? (
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
          safeNotes.map(note => (
            <Box 
              key={note.noteId || note.id}
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
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                {note.nameNote || note.title || 'Без названия'}
              </Typography>
              
              {/* Markdown отображение */}
              <Box sx={{ 
                mb: 1,
                maxHeight: 60,
                overflow: 'hidden',
                '& *': {
                  margin: 0,
                  padding: 0,
                  lineHeight: 1.4
                }
              }}>
                <MDEditor.Markdown 
                  source={
                    (note.contentNote || note.text || '')
                      .length > 100 
                      ? (note.contentNote || note.text || '').substring(0, 100) + '...' 
                      : (note.contentNote || note.text || '')
                  } 
                  className='green-markdown'
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
                  onClick={() => handleEditNote(note.noteId || note.id)}
                  size="small"
                  color="primary"
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton 
                  onClick={() => deleteNote(note.noteId || note.id)}
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