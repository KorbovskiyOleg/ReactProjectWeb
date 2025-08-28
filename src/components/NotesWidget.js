import React, { useState } from 'react';
import { 
  Card, 
 // CardContent, 
  TextField, 
  IconButton, 
  Box, 
  Typography,
  useTheme
} from '@mui/material';
import { 
  Add as AddIcon, 
  Delete as DeleteIcon,
  //Edit as EditIcon
} from '@mui/icons-material';

const NotesWidget = () => {
  const theme = useTheme();
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');

  const addNote = () => {
    if (newNote.trim()) {
      setNotes([...notes, { id: Date.now(), text: newNote }]);
      setNewNote('');
    }
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
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
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Notebook
      </Typography>
      
      {/* Поле для новой заметки */}
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Новая заметка..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          size="small"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              bgcolor: theme.palette.background.paper
            }
          }}
        />
        <IconButton 
          onClick={addNote}
          sx={{ 
            bgcolor: theme.palette.primary.main,
            color: '#fff',
            '&:hover': { bgcolor: theme.palette.primary.dark }
          }}
        >
          <AddIcon />
        </IconButton>
      </Box>
      
      {/* Список заметок */}
      <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
        {notes.map(note => (
          <Box 
            key={note.id}
            sx={{
              p: 1.5,
              mb: 1,
              borderRadius: 2,
              bgcolor: theme.palette.mode === 'dark' 
                ? 'rgba(255,255,255,0.05)' 
                : 'rgba(0,0,0,0.03)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Typography>{note.text}</Typography>
            <IconButton 
              onClick={() => deleteNote(note.id)}
              size="small"
              color="error"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        ))}
      </Box>
    </Card>
  );
};

export default NotesWidget;