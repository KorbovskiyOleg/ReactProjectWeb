import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Box,
  Button,
  Divider,
  Toolbar,
  AppBar,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { useCart } from "./CartContext";

export const CartDrawer = ({ open, onClose }) => {
  const { cart, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();

  // Анимационные параметры
  const drawerVariants = {
    hidden: { 
      x: "100%",
      opacity: 0,
      transition: { 
        type: "spring", 
        stiffness: 300,
        damping: 40,
        when: "afterChildren"
      }
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.1
      }
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 0.5 }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Затемнение фона */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "black",
              zIndex: 1199,
              pointerEvents: "auto",
            }}
            transition={{ duration: 0.3 }}
          />

          {/* Сама корзина */}
          <motion.div
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              height: "100vh",
              width: 400,
              zIndex: 1200,
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              boxShadow: "0 0 24px rgba(0,0,0,0.3)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <AppBar position="static" elevation={0}>
              <Toolbar>
                <IconButton edge="start" color="inherit" onClick={onClose}>
                  <CloseIcon />
                </IconButton>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                  Shopping Cart ({cart.length})
                </Typography>
              </Toolbar>
            </AppBar>

            <Box sx={{ flexGrow: 1, overflow: "auto", p: 2 }}>
              {cart.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Typography sx={{ mt: 2 }}>Cart empty</Typography>
                </motion.div>
              ) : (
                <List>
                  {cart.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <ListItem>
                        <ListItemText
                          primary={`${item.brand} ${item.model}`}
                          secondary={`Price: $${item.price}`}
                        />
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <IconButton
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                item.quantity - 1
                              )
                            }
                          >
                            -
                          </IconButton>
                          <TextField
                            value={item.quantity}
                            onChange={(e) =>
                              updateQuantity(
                                item.id,
                                parseInt(e.target.value) || 1
                              )
                            }
                            type="number"
                            slotProps={{
                              input: {
                                min: 1,
                                sx: {
                                  textAlign: "center",
                                  MozAppearance: "textfield",
                                  "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button":
                                    {
                                      WebkitAppearance: "none",
                                      margin: 0,
                                    },
                                },
                              },
                            }}
                            sx={{ width: 60, mx: 1 }}
                          />
                          <IconButton
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                item.quantity + 1
                              )
                            }
                          >
                            +
                          </IconButton>
                          <IconButton
                            onClick={() => removeFromCart(item.id)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </ListItem>
                      <Divider />
                    </motion.div>
                  ))}
                </List>
              )}
            </Box>

            {cart.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Box sx={{ p: 2, borderTop: "1px solid rgba(0,0,0,0.12)" }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Total: ${cartTotal.toFixed(2)}
                  </Typography>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{ mb: 1 }}
                    onClick={clearCart}
                  >
                    Clear cart
                  </Button>
                  <Button variant="contained" color="primary" fullWidth>
                    Place an order
                  </Button>
                </Box>
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

