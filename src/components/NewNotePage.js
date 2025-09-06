import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  useTheme,
  Chip,
  //ToggleButtonGroup,
  //ToggleButton
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  //FormatBold,
  //FormatItalic,
  //FormatListBulleted,
  //FormatListNumbered,
  //Code
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';

const NewNotePage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [noteText, setNoteText] = useState('');
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState('');

  const handleSaveNote = () => {
    const newNote = {
      id: Date.now(),
      title: title.trim() || 'Без названия',
      content: noteText,
      tags,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Сохранение в localStorage
    const existingNotes = JSON.parse(localStorage.getItem('notes') || '[]');
    localStorage.setItem('notes', JSON.stringify([...existingNotes, newNote]));
    
    navigate('/notes');
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          borderRadius: 3,
          bgcolor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}
      >
        {/* Кнопка назад */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mb: 3 }}
        >
          Назад к заметкам
        </Button>

        {/* Заголовок */}
        <Typography variant="h3" component="h1" gutterBottom sx={{ 
          fontWeight: 700,
          background: 'linear-gradient(45deg, #5d4037 30%, #8b6b61 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 3
        }}>
          📝 Новый документ
        </Typography>

        {/* Поле для названия */}
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Название заметки..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{
            mb: 3,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              fontSize: '1.2rem',
              fontWeight: 600
            }
          }}
        />

        {/* Теги */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Теги:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
            {tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                onDelete={() => handleRemoveTag(tag)}
                color="primary"
                variant="outlined"
              />
            ))}
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              size="small"
              placeholder="Добавить тег..."
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
              sx={{ width: 200 }}
            />
            <Button 
              variant="outlined" 
              onClick={handleAddTag}
              disabled={!currentTag.trim()}
            >
              Добавить
            </Button>
          </Box>
        </Box>

        {/* Редактор Markdown */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Содержание:
          </Typography>
          <MDEditor
            value={noteText}
            onChange={setNoteText}
            height={400}
            preview="edit"
            style={{ 
              borderRadius: '12px',
              border: `1px solid ${theme.palette.divider}`
            }}
          />
        </Box>

        {/* Предпросмотр */}
        {noteText && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Предпросмотр:
            </Typography>
            <Paper 
              sx={{ 
                p: 2, 
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
                minHeight: 100
              }}
            >
              <MDEditor.Markdown source={noteText} />
            </Paper>
          </Box>
        )}

        {/* Кнопки действий */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            onClick={handleBack}
            size="large"
          >
            Отмена
          </Button>
          
          <Button
            variant="contained"
            onClick={handleSaveNote}
            disabled={!noteText.trim()}
            size="large"
            sx={{
              background: 'linear-gradient(45deg, #5d4037 30%, #8b6b61 90%)',
              fontWeight: 600
            }}
          >
            Сохранить заметку
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default NewNotePage;