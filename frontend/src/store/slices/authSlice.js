import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    user: null,
    error: null,
  },
  reducers: {
    login: (state, action) => {
      const { username, password } = action.payload;
      if (username === 'admin' && password === '1234') {
        state.isAuthenticated = true;
        state.user = { username };
        state.error = null;
      } else {
        state.error = 'Invalid username or password';
      }
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { login, logout, clearError } = authSlice.actions;
export default authSlice.reducer; 