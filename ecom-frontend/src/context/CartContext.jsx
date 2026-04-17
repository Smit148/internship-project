import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { token } = useAuth();
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage when not logged in
  useEffect(() => {
    if (!token) {
      const saved = localStorage.getItem('cart');
      if (saved) setCartItems(JSON.parse(saved));
    }
  }, [token]);

  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const addToCart = (product, qty = 1) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.product_id === product.product_id);
      const updated = existing
        ? prev.map(i => i.product_id === product.product_id
            ? { ...i, quantity: i.quantity + qty }
            : i)
        : [...prev, { ...product, quantity: qty }];
      localStorage.setItem('cart', JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => {
      const updated = prev.filter(i => i.product_id !== productId);
      localStorage.setItem('cart', JSON.stringify(updated));
      return updated;
    });
  };

  const updateQty = (productId, qty) => {
    if (qty < 1) return removeFromCart(productId);
    setCartItems(prev => {
      const updated = prev.map(i =>
        i.product_id === productId ? { ...i, quantity: qty } : i
      );
      localStorage.setItem('cart', JSON.stringify(updated));
      return updated;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  return (
    <CartContext.Provider value={{ cartItems, cartCount, cartTotal, addToCart, removeFromCart, updateQty, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
