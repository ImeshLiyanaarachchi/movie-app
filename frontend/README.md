#MovieApp

A modern, responsive React application for discovering, searching, and managing your favorite movies. Built with React and powered by The Movie Database (TMDB) API.

## Features

**Movie Discovery**: Browse through a curated list of movies on the home page
**Search Functionality**: Search for any movie using the search bar
**Favorites System**: Add/remove movies to your favorites list
**Responsive Design**: Works seamlessly on desktop and mobile devices
**Dark/Light Mode**: Toggle between dark and light themes
**Movie Details**: View comprehensive movie information including:
  - Release date
  - Rating
  - Runtime
  - Genres
  - Overview
  - Trailers (when available)
**Trending Movies**: Dedicated page for trending movies
**Modern UI**: Beautiful, intuitive interface
**State Management**: Redux for centralized state management


### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ImeshLiyanaarachchi/movie-app.git
   cd movie-app
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install


3. Create a `.env` file in the root directory and add your TMDB API key:
   ```env
   REACT_APP_TMDB_API_KEY=c810ac402e06e7a84670ea1e14a6641f
   ```

4. Start the development server:
   ```bash
   npm start

App Structure

```
src/
├── components/         # Reusable components
│   ├── MovieCard.js   # Movie card component
│   ├── NavBar.js      # Navigation bar
│   ├── SearchBar.js   # Search functionality
│   ├── FilterBar.js   # Movie filtering
│   ├── Loader.js      # Loading animation
│   └── Login.js       # Login page
├── pages/             # Main pages
│   ├── Home.js        # Home page
│   ├── Trending.js    # Trending movies
│   └── Favorites.js   # Favorites page
├── store/             # Redux store configuration
│   ├── store.js       # Redux store setup
│   └── slices/        # Redux slices
│       ├── authSlice.js        # Authentication state
│       ├── favoritesSlice.js   # Favorites management
│       ├── moviesSlice.js      # Movies data
│       └── themeSlice.js       # Theme preferences
├── utils/             # Utility functions
│   └── Axios.js       # Axios configuration
└── App.js             # Main app component
```

## 🎨 Features in Detail

### Authentication
- Simple login system (demo credentials: admin/1234)
- Protected routes for authenticated users
- Redux-based authentication state management

### Movie Management
- Browse movies with infinite scroll
- Search movies by title
- Filter movies by:
  - Genre
  - Year
  - Rating
- Add/remove movies to favorites
- View detailed movie information
- Redux for efficient movie state management

### Theme System
- Toggle between light and dark modes
- Redux-managed theme state with localStorage persistence
- Consistent styling across the application

## 🔐 Environment Variables

The following environment variables are required:

```env
REACT_APP_TMDB_API_KEY=c810ac402e06e7a84670ea1e14a6641f
```

## Redux State Management

The application uses Redux for centralized state management with the following store structure:

- **Auth State**: Manages user authentication
- **Movies State**: Handles movie data, search results, and trending movies
- **Favorites State**: Manages user's favorite movies
- **Theme State**: Controls the application's theme (dark/light mode)

Redux provides several benefits:
- Centralized state management
- Predictable state updates
- Easy debugging with Redux DevTools
- Efficient API calls with Redux Thunk
- Persistent state across the application

