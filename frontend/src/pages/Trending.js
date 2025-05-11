import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import NavBar from '../components/NavBar';
import MovieCard from '../components/MovieCard';
import FilterBar from '../components/FilterBar';
import Loader from '../components/Loader';
import { fetchTrending } from '../store/slices/moviesSlice';
import axiosInstance from '../utils/Axios';

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const MOVIE_DETAILS_URL = (id) => `movie/${id}?api_key=${API_KEY}`;
const TRAILERS_URL = (id) => `movie/${id}/videos?api_key=${API_KEY}`;

const Trending = () => {
  const dispatch = useDispatch();
  const { trending, loading, error, currentPage, totalPages } = useSelector(state => state.movies);
  
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [details, setDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [trailers, setTrailers] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const loader = useRef(null);

  useEffect(() => {
    dispatch(fetchTrending(1));
  }, [dispatch]);

  useEffect(() => {
    setHasMore(currentPage < totalPages);
  }, [currentPage, totalPages]);

  const handleObserver = useCallback((entries) => {
    const target = entries[0];
    if (target.isIntersecting && hasMore && !loading) {
      dispatch(fetchTrending(currentPage + 1));
    }
  }, [dispatch, hasMore, loading, currentPage]);

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: '20px',
      threshold: 1.0
    };
    const observer = new window.IntersectionObserver(handleObserver, option);
    if (loader.current) observer.observe(loader.current);
    return () => observer.disconnect();
  }, [handleObserver]);

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
          Trending This Week
        </h1>

        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1.5rem', 
          padding: '1.5rem',
          background: 'var(--color-card)',
          borderRadius: '12px',
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          {trending.map((movie) => (
            <MovieCard key={movie.id} movie={movie} onClick={handleCardClick} />
          ))}
        </div>

        {loading && <Loader text="Loading trending movies..." />}
        
        <div ref={loader} style={{ height: 40 }} />

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

export default Trending; 