import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const wishlistKey = `wishlist_${user?.email || 'guest'}`;
  
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem(wishlistKey);
    setWishlist(saved ? JSON.parse(saved) : []);
  }, [wishlistKey]);

  const isWishlisted = (productId) => wishlist.some(p => p.product_id === productId);

  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const updated = isWishlisted(product.product_id)
        ? prev.filter(p => p.product_id !== product.product_id)
        : [...prev, product];
      localStorage.setItem(wishlistKey, JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlist(prev => {
      const updated = prev.filter(p => p.product_id !== productId);
      localStorage.setItem(wishlistKey, JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <WishlistContext.Provider value={{ wishlist, isWishlisted, toggleWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
