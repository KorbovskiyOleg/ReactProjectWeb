import { Drawer, List, ListItem, ListItemText, IconButton, Typography, Box, Button } from '@mui/material';
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
      <Box sx={{ p: 2 }}>
        <Typography variant="h6">Корзина покупок</Typography>
        
        {cart.length === 0 ? (
          <Typography sx={{ mt: 2 }}>Корзина пуста</Typography>
        ) : (
          <>
            <List>
              {cart.map(item => (
                <ListItem 
                  key={item.id}
                  secondaryAction={
                    <IconButton onClick={() => removeFromCart(item.id)}>
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={`${item.brand} ${item.model}`}
                    secondary={`${item.quantity} × $${item.price}`}
                  />
                </ListItem>
              ))}
            </List>
            
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6">
                Итого: ${total.toFixed(2)}
              </Typography>
              <Button 
                variant="contained" 
                fullWidth 
                sx={{ mt: 2 }}
                onClick={clearCart}
              >
                Очистить корзину
              </Button>
              <Button 
                variant="contained" 
                color="primary" 
                fullWidth 
                sx={{ mt: 1 }}
              >
                Оформить заказ
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Drawer>
  );
};