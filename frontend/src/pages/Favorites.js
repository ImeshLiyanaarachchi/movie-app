import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import MovieCard from '../components/MovieCard';
import Loader from '../components/Loader';
import axiosInstance from '../utils/Axios';

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const MOVIE_DETAILS_URL = (id) => `movie/${id}?api_key=${API_KEY}`;
const TRAILERS_URL = (id) => `movie/${id}/videos?api_key=${API_KEY}`;

const Favorites = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [details, setDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [trailers, setTrailers] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true);
      try {
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        const movieDetails = await Promise.all(
          favorites.map(id => 
            axiosInstance.get(MOVIE_DETAILS_URL(id))
              .then(res => res.data)
              .catch(() => null)
          )
        );
        setMovies(movieDetails.filter(movie => movie !== null));
      } catch (err) {
        setError('Failed to load favorites.');
      }
      setLoading(false);
    };

    fetchFavorites();
  }, []);

  const handleCardClick = (movie) => {
    setSelectedMovie(movie);
    setDetailsLoading(true);
    setTrailers([]);
    
    axiosInstance.get(MOVIE_DETAILS_URL(movie.id))
      .then((res) => {
        setDetails(res.data);
        setDetailsLoading(false);
      })
      .catch(() => {
        setDetails(null);
        setDetailsLoading(false);
      });

    axiosInstance.get(TRAILERS_URL(movie.id))
      .then((res) => {
        if (res.data.results) {
          setTrailers(res.data.results.filter(v => v.site === 'YouTube' && v.type === 'Trailer'));
        }
      });
  };

  const removeFromFavorites = (movieId) => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const updatedFavorites = favorites.filter(id => id !== movieId);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    setMovies(movies.filter(movie => movie.id !== movieId));
    setSelectedMovie(null);
    setDetails(null);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', color: 'var(--color-text)' }}>
      <NavBar />
      <div style={{ padding: '1rem', background: 'var(--color-bg)', color: 'var(--color-text)' }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: '700', 
          textAlign: 'center',
          marginBottom: '2rem',
          background: 'linear-gradient(45deg, var(--color-accent), var(--color-text))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Your Favorites
        </h1>

        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        
        {loading ? (
          <Loader text="Loading your favorites..." />
        ) : movies.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem', 
            background: 'var(--color-card)',
            borderRadius: '12px',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>No favorites yet!</p>
            <p style={{ color: 'var(--color-text-light)' }}>Start adding movies to your favorites list.</p>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', 
            gap: '1.5rem', 
            padding: '1.5rem',
            background: 'var(--color-card)',
            borderRadius: '12px',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} onClick={handleCardClick} />
            ))}
          </div>
        )}

        {selectedMovie && (
          <div style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            width: '100vw', 
            height: '100vh', 
            background: 'rgba(0,0,0,0.8)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            zIndex: 1000 
          }} onClick={() => { setSelectedMovie(null); setDetails(null); }}>
            <div style={{ 
              background: 'var(--color-card)', 
              color: 'var(--color-text)', 
              padding: '2rem',
              borderRadius: '12px',
              minWidth: '320px',
              maxWidth: '90vw',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
            }} onClick={e => e.stopPropagation()}>
              {detailsLoading ? (
                <Loader />
              ) : details ? (
                <>
                  <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>{details.title}</h2>
                  <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}><b>Release:</b> {details.release_date}</p>
                  <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}><b>Rating:</b> {details.vote_average}</p>
                  <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}><b>Runtime:</b> {details.runtime} min</p>
                  <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}><b>Genres:</b> {details.genres && details.genres.map(g => g.name).join(', ')}</p>
                  <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}><b>Overview:</b> {details.overview}</p>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                    <a 
                      href={`https://www.themoviedb.org/movie/${details.id}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      style={{
                        color: 'var(--color-accent)',
                        textDecoration: 'none',
                        fontSize: '1.1rem',
                        fontWeight: '500'
                      }}
                    >
                      View on TMDb
                    </a>
                    <button
                      onClick={() => removeFromFavorites(details.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#ff4444',
                        fontSize: '1.1rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        padding: 0
                      }}
                    >
                      Remove from Favorites
                    </button>
                  </div>
                  {trailers.length > 0 && (
                    <div style={{ marginTop: '1.5rem' }}>
                      <h4 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>Trailer</h4>
                      <iframe
                        width="100%"
                        height="315"
                        src={`https://www.youtube.com/embed/${trailers[0].key}`}
                        title={trailers[0].name}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={{ borderRadius: '8px' }}
                      ></iframe>
                    </div>
                  )}
                </>
              ) : (
                <p>Failed to load details.</p>
              )}
              <button 
                onClick={() => { setSelectedMovie(null); setDetails(null); }}
                style={{ 
                  marginTop: '1.5rem',
                  padding: '0.8rem 1.5rem',
                  fontSize: '1.1rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'var(--color-accent)',
                  color: '#fff',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites; 