import React from 'react'; 
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
  AppBar
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { useCart } from './CartContext';

export const CartDrawer = ({ open, onClose }) => {
  const { cart, removeFromCart, clearCart } = useCart();
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: 350 } }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Шапка с кнопкой закрытия */}
        <AppBar position="static" elevation={0}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={onClose}
              aria-label="close"
              sx={{ mr: 2 }}
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Chopping Cart
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Содержимое корзины */}
        <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
          {cart.length === 0 ? (
            <Typography sx={{ mt: 2 }}>Cart empty</Typography>
          ) : (
            <List>
              {cart.map(item => (
                <React.Fragment key={item.id}>
                  <ListItem 
                    secondaryAction={
                      <IconButton 
                        edge="end" 
                        aria-label="delete"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={`${item.brand} ${item.model}`}
                      secondary={`${item.quantity} × $${item.price}`}
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          )}
        </Box>

        {/* Подвал с итогами */}
        {cart.length > 0 && (
          <Box sx={{ p: 2, borderTop: '1px solid rgba(0,0,0,0.12)' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Total: ${total.toFixed(2)}
            </Typography>
            <Button 
              variant="contained" 
              fullWidth 
              sx={{ mb: 1 }}
              onClick={clearCart}
            >
              Clear Cart
            </Button>
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth
            >
              Place an order
            </Button>
          </Box>
        )}
      </Box>
    </Drawer>
  );
};