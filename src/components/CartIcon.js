import { useCart } from './CartContext';
import { Badge} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

export const CartIcon = () => {
  const { cart } = useCart();
  
  return (
    <Badge badgeContent={cart.reduce((sum, item) => sum + item.quantity, 0)} color="secondary">
      <ShoppingCartIcon />
    </Badge>
  );
};