import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const cartKey = `cart_${user?.email || 'guest'}`;
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem(cartKey);
    setCartItems(saved ? JSON.parse(saved) : []);
  }, [cartKey]);

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
      localStorage.setItem(cartKey, JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => {
      const updated = prev.filter(i => i.product_id !== productId);
      localStorage.setItem(cartKey, JSON.stringify(updated));
      return updated;
    });
  };

  const updateQty = (productId, qty) => {
    if (qty < 1) return removeFromCart(productId);
    setCartItems(prev => {
      const updated = prev.map(i =>
        i.product_id === productId ? { ...i, quantity: qty } : i
      );
      localStorage.setItem(cartKey, JSON.stringify(updated));
      return updated;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem(cartKey);
  };

  return (
    <CartContext.Provider value={{ cartItems, cartCount, cartTotal, addToCart, removeFromCart, updateQty, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
