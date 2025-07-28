import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const OwnersList = () => {
  // Пример данных владельцев
  const owners = [
    { id: 1, name: "Иван Иванов", phone: "+79123456789", email: "ivan@example.com" },
    { id: 2, name: "Петр Петров", phone: "+79234567890", email: "petr@example.com" }
  ];

  const columns = [
    { field: "name", headerName: "ФИО", width: 200 },
    { field: "phone", headerName: "Телефон", width: 180 },
    { field: "email", headerName: "Email", width: 250 }
  ];

  return (
    <Box sx={{ height: 600, width: "100%" }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Owners Cars
      </Typography>
      <DataGrid
        rows={owners}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        checkboxSelection
        disableSelectionOnClick
      />
    </Box>
  );
};

export default OwnersList;