
import { useState, useEffect } from 'react';

const FAVORITES_KEY = 'news-favorites';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(FAVORITES_KEY);
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    }
  }, []);

  const toggleFavorite = (articleTitle: string) => {
    const newFavorites = favorites.includes(articleTitle)
      ? favorites.filter(title => title !== articleTitle)
      : [...favorites, articleTitle];
    
    setFavorites(newFavorites);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
  };

  const isFavorite = (articleTitle: string) => favorites.includes(articleTitle);

  return { favorites, toggleFavorite, isFavorite };
};
