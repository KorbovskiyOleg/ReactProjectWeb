import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (car) => {
    setCart(prev => {
      // Используем car.id как уникальный ID
      const carId = car.id;
      const existingItem = prev.find(item => item.id === carId);
      
      if (existingItem) {
        return prev.map(item => 
          item.id === carId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      // Добавляем новый автомобиль с начальным количеством 1
      return [...prev, { ...car, quantity: 1 }];
    });
  };

  const removeFromCart = (carId) => {
    setCart(prev => prev.filter(item => item.id !== carId));
  };

  const updateQuantity = (carId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(carId);
      return;
    }

    setCart(prev =>
      prev.map(item =>
        item.id === carId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
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
        updateQuantity,
        clearCart,
        cartTotal: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        cartCount: cart.reduce((sum, item) => sum + item.quantity, 0)
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);