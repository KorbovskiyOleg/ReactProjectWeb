import React, { useState, useEffect } from 'react';
import { 
  Card, 
  IconButton, 
  Box, 
  Typography,
  useTheme,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import { 
  Add as AddIcon, 
  Delete as DeleteIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';
import { SERVER_URL } from '../constants';
import "./note.css"; // ✅ Импорт стилей


const NotesWidget = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingNote, setEditingNote] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  

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

      const notesData = await response.json();
      setNotes(Array.isArray(notesData) ? notesData : []);
      
    } catch (error) {
      console.error('Error fetching notes:', error);
      setError(error.message);
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

  // PUT запрос - обновление заметки
  const updateNote = async (id, updatedNote) => {
    try {
      const token = sessionStorage.getItem("jwt");
      const response = await fetch(`${SERVER_URL}api/notes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedNote),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedNoteData = await response.json();
      
      // Обновляем состояние локально
      setNotes(prevNotes => 
        prevNotes.map(note => 
          note.noteId === id ? updatedNoteData : note
        )
      );
      
      return updatedNoteData;
      
    } catch (error) {
      console.error('Error updating note:', error);
      throw error;
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
        prevNotes.filter(note => note.noteId !== id)
      );
      
    } catch (error) {
      console.error('Error deleting note:', error);
      alert('Ошибка при удалении заметки');
    }
  };

  const handleAddNote = () => {
    navigate('/new-note');
  };

  const handleEditClick = (note) => {
    setEditingNote(note);
    setEditTitle(note.nameNote);
    setEditContent(note.contentNote);
  };

  const handleSaveEdit = async () => {
    if (!editTitle.trim() || !editContent.trim()) {
      alert('Название и содержание заметки не могут быть пустыми');
      return;
    }

    setEditLoading(true);
    try {
      const updatedNote = {
        nameNote: editTitle.trim(),
        contentNote: editContent
      };

      await updateNote(editingNote.noteId, updatedNote);
      setEditingNote(null);
      setEditTitle('');
      setEditContent('');
      
    } catch (error) {
      alert('Ошибка при обновлении заметки');
    } finally {
      setEditLoading(false);
    }
  };

  const handleCloseEdit = () => {
    setEditingNote(null);
    setEditTitle('');
    setEditContent('');
  };

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
    <>
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
            Notebook ({safeNotes.length})
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={handleAddNote}
            size="small"
          >
            new
          </Button>
        </Box>
        
        <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
          {safeNotes.length === 0 ? (
            <Box sx={{ 
              textAlign: 'center', 
              py: 4,
              color: 'text.secondary'
            }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Empty
              </Typography>
              <Button 
                variant="outlined" 
                startIcon={<AddIcon />}
                onClick={handleAddNote}
                size="small"
              >
                Create
              </Button>
            </Box>
          ) : (
            safeNotes.map(note => (
              <Box 
                key={note.noteId}
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
                  {note.nameNote || 'Без названия'}
                </Typography>
                
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
                      (note.contentNote || '')
                        .length > 100 
                        ? (note.contentNote || '').substring(0, 100) + '...' 
                        : (note.contentNote || '')
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
                    onClick={() => handleEditClick(note)}
                    size="small"
                    color="primary"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton 
                    onClick={() => deleteNote(note.noteId)}
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

      {/* Диалог редактирования */}
      <Dialog open={Boolean(editingNote)} onClose={handleCloseEdit} maxWidth="md" fullWidth>
        <DialogTitle>Edit note</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Название заметки"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            margin="normal"
            disabled={editLoading}
          />
          <Typography variant="body2" sx={{ mt: 2, mb: 1 }}>
            Summury
          </Typography>
          <MDEditor
            value={editContent}
            onChange={setEditContent}
            height={300}
            preview="edit"
            disabled={editLoading}
            className="green-editor"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit} disabled={editLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleSaveEdit} 
            variant="contained" 
            disabled={editLoading}
          >
            {editLoading ? <CircularProgress size={24} /> : 'Сохранить'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default NotesWidget;