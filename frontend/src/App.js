import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Home from './pages/Home';

const Trending = React.lazy(() => import('./pages/Trending'));
const Favorites = React.lazy(() => import('./pages/Favorites'));

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/trending" element={<React.Suspense fallback={<div>Loading...</div>}><Trending /></React.Suspense>} />
          <Route path="/favorites" element={<React.Suspense fallback={<div>Loading...</div>}><Favorites /></React.Suspense>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;