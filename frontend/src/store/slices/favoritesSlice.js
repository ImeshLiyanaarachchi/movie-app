import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/Axios';

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

export const fetchFavoriteDetails = createAsyncThunk(
  'favorites/fetchDetails',
  async (movieIds) => {
    const movieDetails = await Promise.all(
      movieIds.map(id =>
        axiosInstance.get(`movie/${id}?api_key=${API_KEY}`)
          .then(res => res.data)
          .catch(() => null)
      )
    );
    return movieDetails.filter(movie => movie !== null);
  }
);

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: {
    favorites: [],
    favoriteIds: JSON.parse(localStorage.getItem('favorites') || '[]'),
    loading: false,
    error: null,
  },
  reducers: {
    addToFavorites: (state, action) => {
      const movieId = action.payload;
      if (!state.favoriteIds.includes(movieId)) {
        state.favoriteIds.push(movieId);
        localStorage.setItem('favorites', JSON.stringify(state.favoriteIds));
      }
    },
    removeFromFavorites: (state, action) => {
      const movieId = action.payload;
      state.favoriteIds = state.favoriteIds.filter(id => id !== movieId);
      state.favorites = state.favorites.filter(movie => movie.id !== movieId);
      localStorage.setItem('favorites', JSON.stringify(state.favoriteIds));
    },
    clearFavorites: (state) => {
      state.favorites = [];
      state.favoriteIds = [];
      localStorage.setItem('favorites', '[]');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavoriteDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFavoriteDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.favorites = action.payload;
      })
      .addCase(fetchFavoriteDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { addToFavorites, removeFromFavorites, clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer; 