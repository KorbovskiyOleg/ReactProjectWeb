/*import React, { createContext, useState, useContext } from 'react';

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
};*/

import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (car) => {
    setCart(prev => {
      // Используем _links.self.href как уникальный ID
      const carId = car._links.self.href;
      const existingItem = prev.find(item => item._links.self.href === carId);
      
      if (existingItem) {
        return prev.map(item => 
          item._links.self.href === carId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      // Добавляем новый автомобиль с начальным количеством 1
      return [...prev, { ...car, quantity: 1 }];
    });
  };

  const removeFromCart = (carId) => {
    setCart(prev => prev.filter(item => item._links.self.href !== carId));
  };

  const updateQuantity = (carId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(carId);
      return;
    }

    setCart(prev =>
      prev.map(item =>
        item._links.self.href === carId
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