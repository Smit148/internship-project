import React, { createContext, useContext, useState } from 'react';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const isWishlisted = (productId) => wishlist.some(p => p.product_id === productId);

  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const updated = isWishlisted(product.product_id)
        ? prev.filter(p => p.product_id !== product.product_id)
        : [...prev, product];
      localStorage.setItem('wishlist', JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlist(prev => {
      const updated = prev.filter(p => p.product_id !== productId);
      localStorage.setItem('wishlist', JSON.stringify(updated));
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
