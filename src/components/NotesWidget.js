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
  TextField,
  Collapse,
  Checkbox
} from '@mui/material';
import { 
  Add as AddIcon, 
  Delete as DeleteIcon,
  Edit as EditIcon,
  ExpandMore as ExpandMoreIcon,
  List as ListIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';
import { SERVER_URL } from '../constants';
import "./note.css"; // ✅ Импорт стилей

const NotesWidget = ({ showOnlyFirst = false }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingNote, setEditingNote] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [expandedNotes, setExpandedNotes] = useState({});
  const [completedItems, setCompletedItems] = useState({});
  const [collapsedChecklistNotes, setCollapsedChecklistNotes] = useState({});

  // Загрузка заметок из бэкенда
  useEffect(() => {
    fetchNotes();
    // Загружаем completedItems из localStorage
    const savedCompletedItems = localStorage.getItem('completedItems');
    if (savedCompletedItems) {
      setCompletedItems(JSON.parse(savedCompletedItems));
    }
  }, []);

  // Сохраняем completedItems в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('completedItems', JSON.stringify(completedItems));
  }, [completedItems]);

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

  const handleViewAllNotes = () => {
    navigate('/notes');
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

  const toggleExpandNote = (noteId) => {
    setExpandedNotes(prev => ({
      ...prev,
      [noteId]: !prev[noteId]
    }));
  };

  const toggleChecklistNote = (noteId) => {
    setCollapsedChecklistNotes(prev => ({
      ...prev,
      [noteId]: !prev[noteId]
    }));
  };

  // Функция для обработки клика по пункту
  const handleItemClick = (noteId, lineIndex) => {
    const itemKey = `${noteId}-${lineIndex}`;
    setCompletedItems(prev => ({
      ...prev,
      [itemKey]: !prev[itemKey]
    }));
  };

  // Функция для парсинга markdown и преобразования в список пунктов
  const parseChecklistItems = (content) => {
    if (!content) return [];
    
    // Ищем строки с checkbox'ами [ ] или [x]
    const checkboxRegex = /^-\s+\[( |x)\]\s+(.+)$/gm;
    const items = [];
    let match;
    
    while ((match = checkboxRegex.exec(content)) !== null) {
      items.push({
        text: match[2],
        checked: match[1] === 'x',
        original: match[0]
      });
    }
    
    return items;
  };

  // Функция для рендеринга пунктов с чекбоксами
  const renderChecklistItems = (note) => {
    const items = parseChecklistItems(note.contentNote);
    
    if (items.length === 0) {
      // Если нет checkbox'ов, показываем обычный текст
      return (
        <Box sx={{ 
          mb: 1,
          '& *': {
            margin: 0,
            padding: 0,
            lineHeight: 1.4
          }
        }}>
          <MDEditor.Markdown 
            source={note.contentNote || ''}
            className='green-markdown'
            style={{ 
              fontSize: '14px',
              background: 'transparent'
            }}
          />
        </Box>
      );
    }

    return (
      <Box sx={{ mb: 1 }}>
        {items.map((item, index) => {
          const itemKey = `${note.noteId}-${index}`;
          const isCompleted = completedItems[itemKey] || item.checked;

         
          
          return (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 1,
                mb: 0.5,
                cursor: 'pointer',
                opacity: isCompleted ? 0.6 : 1,
                textDecoration: isCompleted ? 'line-through' : 'none',
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                  borderRadius: 1
                }
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleItemClick(note.noteId, index);
              }}
            >
              <Checkbox
                size="small"
                checked={isCompleted}
                onChange={(e) => {
                  e.stopPropagation();
                  handleItemClick(note.noteId, index);
                }}
                onClick={(e) => e.stopPropagation()}
                sx={{ 
                  p: 0.5,
                  '& .MuiSvgIcon-root': { fontSize: 18 }
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  flex: 1,
                  fontSize: '14px',
                  lineHeight: 1.4,
                  userSelect: 'none',
                  color: isCompleted ? '#de1717ff' : '#420bc1ff',
                }}
              >
                {item.text}
              </Typography>
            </Box>
          );
        })}
      </Box>
    );
  };

  // Функция для подсчета строк в контенте
  const countLines = (content) => {
    if (!content) return 0;
    return content.split('\n').length;
  };

  const safeNotes = Array.isArray(notes) ? notes : [];
  const displayedNotes = showOnlyFirst ? safeNotes.slice(0, 1) : safeNotes;

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
          <Box sx={{ display: 'flex', gap: 1 }}>
            {showOnlyFirst && safeNotes.length > 1 && (
              <Button 
                variant="outlined" 
                startIcon={<ListIcon />}
                onClick={handleViewAllNotes}
                size="small"
              >
              </Button>
            )}
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={handleAddNote}
              size="small"
            >
              new
            </Button>
          </Box>
        </Box>
        
        <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
          {displayedNotes.length === 0 ? (
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
            displayedNotes.map(note => {
              const isExpanded = expandedNotes[note.noteId];
              const isChecklistCollapsed = collapsedChecklistNotes[note.noteId];
              const lineCount = countLines(note.contentNote);
              const shouldShowExpand = lineCount > 5;
              const hasChecklistItems = parseChecklistItems(note.contentNote).length > 0;
              
              return (
                <Box 
                  key={note.noteId}
                  sx={{
                    p: 2,
                    mb: 1,
                    borderRadius: 2,
                    bgcolor: theme.palette.mode === 'dark' 
                      ? 'rgba(255,255,255,0.05)' 
                      : 'rgba(0, 0, 0, 0.03)',
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:hover': {
                      bgcolor: theme.palette.mode === 'dark' 
                        ? 'rgba(255,255,255,0.08)' 
                        : 'rgba(0,0,0,0.05)'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {note.nameNote || 'Без названия'}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      {/* Кнопка для обычных заметок (без чекбоксов) */}
                      {shouldShowExpand && !hasChecklistItems && (
                        <IconButton 
                          onClick={() => toggleExpandNote(note.noteId)}
                          size="small"
                          sx={{
                            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.3s'
                          }}
                        >
                          <ExpandMoreIcon fontSize="small" />
                        </IconButton>
                      )}
                      
                      {/* Кнопка для заметок с чекбоксами */}
                      {hasChecklistItems && (
                        <IconButton 
                          onClick={() => toggleChecklistNote(note.noteId)}
                          size="small"
                          sx={{
                            transform: isChecklistCollapsed ? 'rotate(0deg)' : 'rotate(180deg)',
                            transition: 'transform 0.3s'
                          }}
                        >
                          <ExpandMoreIcon fontSize="small" />
                        </IconButton>
                      )}
                      
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
                  
                  <Collapse 
                    in={isExpanded || (hasChecklistItems && !isChecklistCollapsed)} 
                    collapsedSize={hasChecklistItems ? (isChecklistCollapsed ? 60 : 'auto') : 60}
                  >
                    {renderChecklistItems(note)}
                  </Collapse>
                  
                  {shouldShowExpand && !isExpanded && !hasChecklistItems && (
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: 'text.secondary',
                        cursor: 'pointer',
                        '&:hover': { textDecoration: 'underline' }
                      }}
                      onClick={() => toggleExpandNote(note.noteId)}
                    >
                      Показать полностью...
                    </Typography>
                  )}
                </Box>
              );
            })
          )}
        </Box>
      </Card>

      {/* Диалог редактирования */}
      <Dialog 
        open={Boolean(editingNote)} 
        onClose={handleCloseEdit} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            minHeight: '500px',
            maxHeight: '90vh'
          }
        }}
      >
        <DialogTitle>Edit note</DialogTitle>
        <DialogContent sx={{ minHeight: '400px' }}>
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
          <Box sx={{ 
            minHeight: '300px',
            maxHeight: '60vh',
            overflow: 'auto'
          }}>
            <MDEditor
              value={editContent}
              onChange={setEditContent}
              height="100%"
              preview="edit"
              disabled={editLoading}
              className="green-editor"
            />
          </Box>
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