import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Login from './components/Login';
import Home from './pages/Home';
import { setTheme } from './store/slices/themeSlice';

const Trending = React.lazy(() => import('./pages/Trending'));
const Favorites = React.lazy(() => import('./pages/Favorites'));

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector(state => state.auth);
  return isAuthenticated ? children : <Navigate to="/" />;
};

function App() {
  const dispatch = useDispatch();
  const { darkMode } = useSelector(state => state.theme);

  // Apply theme on app initialization
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route 
            path="/home" 
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/trending" 
            element={
              <ProtectedRoute>
                <React.Suspense fallback={<div>Loading...</div>}>
                  <Trending />
                </React.Suspense>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/favorites" 
            element={
              <ProtectedRoute>
                <React.Suspense fallback={<div>Loading...</div>}>
                  <Favorites />
                </React.Suspense>
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;