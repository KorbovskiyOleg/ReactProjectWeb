import React from 'react';
import { Button, Box } from '@mui/material';
import * as XLSX from 'xlsx';
import { motion } from 'framer-motion';

const ExportData = ({ data, fileName = 'data' }) => {
  // Функция экспорта в Excel
  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  return (
    <Box sx={{ mb: 2 }}>
      <motion.div
        layout
        initial={false}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
        whileTap={{ scale: 0.95 }} // Добавляем анимацию при нажатии
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleExport} // Вызываем экспорт напрямую
          sx={{ 
            minWidth: 120,
            '&:active': {
              transform: 'scale(0.98)', // Дополнительный эффект нажатия
            }
          }}
        >
          Export Excel
        </Button>
      </motion.div>
    </Box>
  );
};

export default ExportData;