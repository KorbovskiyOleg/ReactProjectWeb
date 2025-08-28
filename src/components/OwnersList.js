import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { motion, AnimatePresence } from "framer-motion";
//import AddOwner from "./AddOwner";
import EditOwner from "./EditOwner";
import { SERVER_URL } from "../constants";
import { Snackbar } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import SettingsIcon from "@mui/icons-material/Settings";
import ExportData from "./ExportData";
//имя фамилия 
import { 
  //Person, 
  //PersonOutline, 
  Badge, 
  //Face,
  AccountCircle 
} from '@mui/icons-material';

// номер телефона
import { 
  Phone, 
  //PhoneAndroid, 
  //Call, 
  //ContactPhone,
  //Smartphone 
} from '@mui/icons-material';

//email
import { 
  Email, 
  //MailOutline, 
  //AlternateEmail,
  //MarkEmailRead,
  //ContactMail 
} from '@mui/icons-material';

// адрес
import { 
  Home, 
  //LocationOn, 
  //House, 
  //Place,
  //Map,
  //LocationCity 
} from '@mui/icons-material';


const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    x: (i) => (i % 3 === 0 ? -50 : i % 3 === 1 ? 50 : 0),
  },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    x: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.8,
      type: "spring",
      stiffness: 100,
      damping: 15,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

const headerVariants = {
  hidden: { opacity: 0, y: -50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100 },
  },
};

const StyledHeader = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  color: theme.palette.primary.main,
  fontWeight: 600,
  fontSize: "1.8rem",
}));

export default function OwnersList() {
  const [owners, setOwners] = useState([]);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible] = useState(true);

  const updateOwner = (owner, ownerId) => {
    const token = sessionStorage.getItem("jwt");
    fetch(`${SERVER_URL}api/owners/${ownerId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization:`Bearer ${token}`,
      },
      body: JSON.stringify(owner),
    })
      .then((response) => {
        if (response.ok) {
          fetchOwners();
        } else {
          alert("Something went wrong!");
        }
      })
      .catch((err) => console.error(err));
  };


  /*const addOwner = (owner) => {
    const token = sessionStorage.getItem("jwt");
    fetch(SERVER_URL + "api/owners", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(owner),
    })
      .then((response) => {
        if (response.ok) {
          fetchOwners();
        } else {
          alert("Something went wrong!");
        }
      })
      .catch((err) => console.error(err));
  };*/

  useEffect(() => {
    fetchOwners();
  }, []);

  const fetchOwners = () => {
    setIsLoading(true);
    const token = sessionStorage.getItem("jwt");

    fetch(SERVER_URL + "api/owners", {
      headers: {
        Authorization: `Bearer ${token}`, // ← Исправлено
      },
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(text);
          }); // Читаем текст ошибки
        }
        return response.json();
      })
      .then((data) => {
        setOwners(data || []); // Защита от undefined
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Ошибка:", err);
        setIsLoading(false);
      });
  };

  if (isLoading) {
    return <div>Загрузка данных...</div>; // ← Добавлено
  }

  const columns = [
    {
      field: "firstName",
      headerName: (
        <motion.div variants={headerVariants}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <AccountCircle fontSize="small" sx={{ mr: 1 }} />
            <span>Name ({owners.length})</span>
          </Box>
        </motion.div>
      ),
      headerClassName: "header-theme",
      flex: 0.5,
      minWidth: 150,
      renderCell: (params) => (
        <motion.div
          custom={params.rowIndex}
          variants={itemVariants}
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          {params.value}
        </motion.div>
      ),
    },
    {
      field: "lastName",
      headerName: (
        <motion.div variants={headerVariants}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Badge fontSize="small" sx={{ mr: 1 }} />
            <span>Surname</span>
          </Box>
        </motion.div>
      ),
      headerClassName: "header-theme",
      flex: 0.5,
      minWidth: 150,
      renderCell: (params) => (
        <motion.div
          custom={params.rowIndex + 0.3}
          variants={itemVariants}
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          {params.value}
        </motion.div>
      ),
    },

    {
      field: "phone",
      headerName: (
        <motion.div variants={headerVariants}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Phone fontSize="small" sx={{ mr: 1 }} />
            
            <span>Phone</span>
          </Box>
        </motion.div>
      ),
      headerClassName: "header-theme",
      flex: 0.5,
      minWidth: 100,
      renderCell: (params) => (
        <motion.div
          custom={params.rowIndex + 0.9}
          variants={itemVariants}
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          {params.value}
        </motion.div>
      ),
    },

    {
      field: "email",
      headerName: (
        <motion.div variants={headerVariants}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Email fontSize="small" sx={{ mr: 1 }} />
            
            <span>email</span>
          </Box>
        </motion.div>
      ),
      headerClassName: "header-theme",
      flex: 0.5,
      minWidth: 100,
      renderCell: (params) => (
        <motion.div
          custom={params.rowIndex + 0.9}
          variants={itemVariants}
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          {params.value}
        </motion.div>
      ),
    },

    {
      field: "address",
      headerName: (
        <motion.div variants={headerVariants}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Home fontSize="small" sx={{ mr: 1 }} />
            <span>Address</span>
          </Box>
        </motion.div>
      ),
      headerClassName: "header-theme",
      flex: 0.5,
      minWidth: 100,
      renderCell: (params) => (
        <motion.div
          custom={params.rowIndex + 0.9}
          variants={itemVariants}
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          {params.value}
        </motion.div>
      ),
    },



    {
      field: "actions",
      headerName: (
        <motion.div variants={headerVariants}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <SettingsIcon fontSize="small" sx={{ mr: 1 }} />
            <span>Actions</span>
          </Box>
        </motion.div>
      ),
      headerClassName: "header-theme",
      flex: 0.5,
      sortable: false,
      width: 250,
      renderCell: (params) => {
      

        return (
          <motion.div
            custom={params.rowIndex + 1.5}
            variants={itemVariants}
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <EditOwner
                data={{ row: params.row, id: params.row.ownerId }}
                updatedOwner={updateOwner}
              />

              

              <IconButton
                onClick={() => onDelClick(params.row.ownerId)}
                sx={{
                  color: "#ff4444",
                  "&:hover": {
                    backgroundColor: "rgba(255, 68, 68, 0.1)",
                  },
                }}
              >
                <DeleteIcon fontSize="small" />
                <Typography variant="caption" sx={{ ml: 0.5 }}>
                  Delete
                </Typography>
              </IconButton>
            </Box>
          </motion.div>
        );
      },
    },
  ];

  const onDelClick = (ownerId) => {
    if (window.confirm("Are you sure you want to delete?")) {
      const token = sessionStorage.getItem("jwt");
      fetch(`${SERVER_URL}api/owners/${ownerId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => {
          if (response.ok) {
            fetchOwners();
            setOpen(true);
          } else {
            alert("Something went wrong!");
          }
        })
        .catch((err) => console.error(err));
    }
  };

  const exportData = owners.map((owner) => ({
    Имя: owner.firstName,
    Фамилия: owner.lastName,
    
  }));

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      <AnimatePresence>
        {isVisible && (
          <>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.2 }}
              style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <StyledHeader
                variant="h4"
                sx={{
                  fontSize: "3rem",
                  fontWeight: 500,
                  color: "rgba(255, 68, )",
                  fontStyle: ["italic", "normal"],
                }}
              >
                Car owners
              </StyledHeader>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: 0.4 }}
            >
              <Box
                sx={{
                  mb: 3,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                {/*<Box>
                  <AddOwner addOwner={addOwner} />
                </Box>*/}
                <Box sx={{ mt: 1 }}>
                  <ExportData data={exportData} fileName="owners_export" />
                </Box>
                
              </Box>
            </motion.div>

            <motion.div
              initial="hidden"
              animate={!isLoading ? "visible" : "hidden"}
              exit="exit"
            >
              <Box
                sx={{
                  height: 600,
                  width: "100%",
                  "& .header-theme": {
                    backgroundColor: "#1976d2 !important",
                    color: "#ffffff !important",
                    fontSize: "0.875rem",
                    fontWeight: "bold",
                  },
                  "& .MuiDataGrid-cell": {
                    borderBottom: "1px solid #f0f0f0",
                    "&.price-cell": {
                      fontWeight: "bold",
                      color: "#2e7d32",
                    },
                  },
                  "& .MuiDataGrid-root": {
                    border: "none",
                    borderRadius: 2,
                  },
                  "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: "#1976d2 !important",
                    color: "#fff",
                  },
                  "& .MuiDataGrid-cell:focus": {
                    outline: "none",
                  },
                }}
              >
                <DataGrid
                  rows={owners}
                  columns={columns.map((col) => ({
                    ...col,
                    renderCell: (params) => (
                      <motion.div
                        custom={params.rowIndex}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          transitionDelay: `${params.rowIndex * 0.1}s`,
                        }}
                      >
                        {col.renderCell ? col.renderCell(params) : params.value}
                      </motion.div>
                    ),
                  }))}
                  pageSize={10}
                  rowsPerPageOptions={[10, 20, 50]}
                  getRowId={(row) => row.ownerId}
                  disableSelectionOnClick
                  disableColumnSelector
                />
              </Box>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
        message="Car deleted successfully"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Box>
  );
}
