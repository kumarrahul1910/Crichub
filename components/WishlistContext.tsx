import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Product } from '../services/products';

interface WishlistContextType {
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: number) => void;
  isWishlisted: (productId: number) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<Product[]>([]);

  useEffect(() => {
    const loadWishlist = async () => {
      try {
        const storedWishlist = await AsyncStorage.getItem('wishlist');
        if (storedWishlist) {
          setWishlist(JSON.parse(storedWishlist));
        }
      } catch (error) {
        console.error('Failed to load wishlist from storage', error);
      }
    };
    loadWishlist();
  }, []);

  const saveWishlist = async (updatedWishlist: Product[]) => {
    try {
      await AsyncStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      setWishlist(updatedWishlist);
    } catch (error) {
      console.error('Failed to save wishlist to storage', error);
    }
  };

  const addToWishlist = (product: Product) => {
    const updatedWishlist = [...wishlist, product];
    saveWishlist(updatedWishlist);
  };

  const removeFromWishlist = (productId: number) => {
    const updatedWishlist = wishlist.filter((item) => item.id !== productId);
    saveWishlist(updatedWishlist);
  };

  const isWishlisted = (productId: number) => {
    return wishlist.some((item) => item.id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist, isWishlisted }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}; 