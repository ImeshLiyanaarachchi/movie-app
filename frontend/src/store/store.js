import { configureStore } from '@reduxjs/toolkit';
import moviesReducer from './slices/moviesSlice';
import favoritesReducer from './slices/favoritesSlice';
import themeReducer from './slices/themeSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    movies: moviesReducer,
    favorites: favoritesReducer,
    theme: themeReducer,
    auth: authReducer,
  },
}); 