import { createSlice } from '@reduxjs/toolkit';

const getInitialMode = () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    return savedTheme === 'dark';
  }
  return true; // Default to dark mode
};

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    darkMode: getInitialMode(),
  },
  reducers: {
    toggleTheme: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem('theme', state.darkMode ? 'dark' : 'light');
      if (state.darkMode) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
    },
    setTheme: (state, action) => {
      state.darkMode = action.payload;
      localStorage.setItem('theme', state.darkMode ? 'dark' : 'light');
      if (state.darkMode) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer; 