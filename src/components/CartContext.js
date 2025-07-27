import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [notification, setNotification] = useState({ open: false, message: '' });

  const addToCart = (car) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.id === car.id);
      if (existingItem) {
        return prev.map(item => 
          item.id === car.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { ...car, quantity: 1 }];
    });
    setNotification({
      open: true,
      message: `${car.brand} ${car.model} добавлен в корзину!`
    });
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider 
      value={{ 
        cart, 
        addToCart, 
        removeFromCart, 
        clearCart,
        notification,
        setNotification
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};