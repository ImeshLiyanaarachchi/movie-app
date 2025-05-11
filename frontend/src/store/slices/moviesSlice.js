import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/Axios';

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

export const fetchMovies = createAsyncThunk(
  'movies/fetchMovies',
  async ({ page, genre, year, rating }) => {
    const response = await axiosInstance.get(
      `discover/movie?api_key=${API_KEY}&page=${page}${genre ? `&with_genres=${genre}` : ''}${year ? `&primary_release_year=${year}` : ''}${rating ? `&vote_average.gte=${rating}` : ''}`
    );
    return response.data;
  }
);

export const searchMovies = createAsyncThunk(
  'movies/searchMovies',
  async ({ query, page }) => {
    const response = await axiosInstance.get(
      `search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`
    );
    return response.data;
  }
);

export const fetchTrending = createAsyncThunk(
  'movies/fetchTrending',
  async (page) => {
    const response = await axiosInstance.get(
      `trending/movie/week?api_key=${API_KEY}&page=${page}`
    );
    return response.data;
  }
);

const moviesSlice = createSlice({
  name: 'movies',
  initialState: {
    movies: [],
    trending: [],
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 0,
    searchResults: [],
    searchQuery: '',
  },
  reducers: {
    clearMovies: (state) => {
      state.movies = [];
      state.currentPage = 1;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = state.currentPage === 1 
          ? action.payload.results 
          : [...state.movies, ...action.payload.results];
        state.totalPages = action.payload.total_pages;
        state.currentPage = action.payload.page;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(searchMovies.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = state.currentPage === 1 
          ? action.payload.results 
          : [...state.searchResults, ...action.payload.results];
        state.totalPages = action.payload.total_pages;
        state.currentPage = action.payload.page;
      })
      .addCase(searchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchTrending.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTrending.fulfilled, (state, action) => {
        state.loading = false;
        state.trending = state.currentPage === 1 
          ? action.payload.results 
          : [...state.trending, ...action.payload.results];
        state.totalPages = action.payload.total_pages;
        state.currentPage = action.payload.page;
      })
      .addCase(fetchTrending.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearMovies, setSearchQuery } = moviesSlice.actions;
export default moviesSlice.reducer; 