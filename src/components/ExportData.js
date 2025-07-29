import React from 'react';
import { Button, Menu, MenuItem, Box } from '@mui/material';
import * as XLSX from 'xlsx';
import { motion } from 'framer-motion';

const ExportData = ({ data, fileName = 'data' }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
    handleClose();
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
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleClick}
          sx={{ minWidth: 120 }}
        >
        Export
        </Button>
      </motion.div>
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        disableAutoFocusItem
        transitionDuration={0}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{
          '& .MuiPaper-root': {
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            mt: 0.5,
          }
        }}
      >
        <MenuItem 
          onClick={exportToExcel}
          sx={{ py: 1, px: 2 }}
        >
          Excel (.xlsx)
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default ExportData;