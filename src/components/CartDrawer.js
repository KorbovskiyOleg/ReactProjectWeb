import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Drawer,
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
  const { cart, removeFromCart, updateQuantity, clearCart, cartTotal } =
    useCart();

  return (
    <>
      {/* Затемнение фона */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "black",
              zIndex: 1199, // Ниже чем Drawer (1200 по умолчанию)
              pointerEvents: open ? "auto" : "none",
            }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        slotProps={{
          paper: {
            sx: {
              width: 400,
              bgcolor: "background.paper",
            },
          },
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
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
              <Typography sx={{ mt: 2 }}>Cart empty</Typography>
            ) : (
              <List>
                {cart.map((item) => (
                  <React.Fragment key={item._links.self.href}>
                    <ListItem>
                      <ListItemText
                        primary={`${item.brand} ${item.model}`}
                        secondary={`Price: $${item.price}`}
                      />
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <IconButton
                          onClick={() =>
                            updateQuantity(
                              item._links.self.href,
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
                              item._links.self.href,
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
                              item._links.self.href,
                              item.quantity + 1
                            )
                          }
                        >
                          +
                        </IconButton>
                        <IconButton
                          onClick={() => removeFromCart(item._links.self.href)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            )}
          </Box>

          {cart.length > 0 && (
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
          )}
        </Box>
      </Drawer>
    </>
  );
};
