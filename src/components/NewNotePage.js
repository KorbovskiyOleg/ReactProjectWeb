import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  useTheme,
  Snackbar,
  Alert,
  CircularProgress
} from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";
import { SERVER_URL } from "../constants";
import "./note.css"; // ✅ Импорт стилей

const NewNotePage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [noteText, setNoteText] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: "", 
    severity: "success" 
  });

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSaveNote = async () => {
    if (!noteText.trim()) {
      showSnackbar("Заметка не может быть пустой", "error");
      return;
    }

    setLoading(true);
    
    try {
      const token = sessionStorage.getItem("jwt");
      const noteData = {
        nameNote: title.trim() || "Без названия",
        contentNote: noteText
      };

      const response = await fetch(`${SERVER_URL}api/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(noteData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP error! status: ${response.status}`);
      }

      // Убрали неиспользуемую переменную savedNote
    await response.json(); // Просто ждем завершения запроса


      
      showSnackbar("Заметка успешно создана!");
      
      setTimeout(() => {
        navigate("/notes");
      }, 1000);

    } catch (error) {
      console.error("Error saving note:", error);
      showSnackbar(
        error.message.includes("HTTP error") 
          ? "Ошибка сервера при сохранении заметки" 
          : error.message,
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 3,
          bgcolor: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        {/* Кнопка назад*/} 
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mb: 3 }}
          disabled={loading}
        >
          Назад к заметкам
        </Button>

        {/* Заголовок */}
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            background: "linear-gradient(45deg, #5d4037 30%, #8b6b61 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 3,
          }}
        >
          📝 Новый документ
        </Typography>

        {/* Поле для названия */}
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Название заметки..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
          sx={{
            mb: 3,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              fontSize: "1.2rem",
              fontWeight: 600,
            },
          }}
        />

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
            disabled={loading}
            className="green-editor"
            style={{
              borderRadius: "12px",
              border: `1px solid ${theme.palette.divider}`,
            }}
          />
        </Box>

        {/* Кнопки действий */}
        <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
          <Button 
            variant="outlined" 
            onClick={handleBack} 
            size="large"
            disabled={loading}
          >
            Отмена
          </Button>

          <Button
            variant="contained"
            onClick={handleSaveNote}
            disabled={!noteText.trim() || loading}
            size="large"
            sx={{
              background: "linear-gradient(45deg, #5d4037 30%, #8b6b61 90%)",
              fontWeight: 600,
              minWidth: 180,
              position: "relative"
            }}
          >
            {loading ? (
              <>
                <CircularProgress 
                  size={24} 
                  sx={{ 
                    color: "white", 
                    position: "absolute",
                    left: "50%",
                    marginLeft: "-12px"
                  }} 
                />
                <span style={{ opacity: 0 }}>Сохранить</span>
              </>
            ) : (
              "Сохранить заметку"
            )}
          </Button>
        </Box>

        {/* Уведомления */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Paper>
    </Container>
  );
};

export default NewNotePage;
