import React, { useEffect, useState, useRef, useCallback } from 'react';
import NavBar from '../components/NavBar';
import SearchBar from '../components/SearchBar';
import MovieCard from '../components/MovieCard';
import FilterBar from '../components/FilterBar';
import axiosInstance from '../utils/Axios';

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const DISCOVER_URL = (page, genre, year, rating) =>
  `discover/movie?api_key=${API_KEY}` +
  `&page=${page}` +
  (genre ? `&with_genres=${genre}` : '') +
  (year ? `&primary_release_year=${year}` : '') +
  (rating ? `&vote_average.gte=${rating}` : '');
const GENRES_URL = `genre/movie/list?api_key=${API_KEY}`;
const SEARCH_URL = (query, page) => `search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`;
const MOVIE_DETAILS_URL = (id) => `movie/${id}?api_key=${API_KEY}`;
const TRAILERS_URL = (id) => `movie/${id}/videos?api_key=${API_KEY}`;

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [details, setDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [searching, setSearching] = useState(false);
  const [lastSearched, setLastSearched] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [genres, setGenres] = useState([]);
  const [genre, setGenre] = useState('');
  const [year, setYear] = useState('');
  const [rating, setRating] = useState('');
  const [trailers, setTrailers] = useState([]);
  const loader = useRef();

  // Fetch genres on mount
  useEffect(() => {
    axiosInstance.get(GENRES_URL)
      .then((res) => setGenres(res.data.genres || []));
  }, []);

  // Fetch movies (discover) with filters and pagination
  const fetchMovies = (reset = false, nextPage = 1) => {
    setLoading(true);
    axiosInstance.get(DISCOVER_URL(nextPage, genre, year, rating))
      .then((res) => {
        const data = res.data;
        setMovies(reset ? (data.results || []) : [...movies, ...(data.results || [])]);
        setHasMore(data.page < data.total_pages);
        setLoading(false);
        setPage(nextPage);
      })
      .catch((err) => {
        setError('Failed to fetch movies.');
        setLoading(false);
      });
  };

  // Fetch search results with infinite scroll
  const fetchSearch = (reset = true, nextPage = 1) => {
    if (!search.trim()) return fetchMovies(true, 1);
    setLoading(true);
    setSearching(true);
    axiosInstance.get(SEARCH_URL(search, nextPage))
      .then((res) => {
        const data = res.data;
        setMovies(reset ? (data.results || []) : [...movies, ...(data.results || [])]);
        setLoading(false);
        setHasMore(data.page < data.total_pages);
        setPage(nextPage);
        if (reset && data.results && data.results.length > 0) {
          localStorage.setItem('lastSearchedMovie', JSON.stringify(data.results[0]));
          setLastSearched(data.results[0]);
        }
      })
      .catch((err) => {
        setError('Failed to fetch movies.');
        setLoading(false);
      });
  };

  // Fetch details for modal (now also fetch trailers)
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
    // Fetch trailers
    axiosInstance.get(TRAILERS_URL(movie.id))
      .then((res) => {
        if (res.data.results) {
          setTrailers(res.data.results.filter(v => v.site === 'YouTube' && v.type === 'Trailer'));
        }
      });
  };

  // On mount, fetch movies and last searched
  useEffect(() => {
    fetchMovies(true, 1);
    const last = localStorage.getItem('lastSearchedMovie');
    if (last) setLastSearched(JSON.parse(last));
    // eslint-disable-next-line
  }, []);

  // When filters change, reset and fetch
  useEffect(() => {
    fetchMovies(true, 1);
    // eslint-disable-next-line
  }, [genre, year, rating]);

  // Infinite scroll for search results
  const handleObserver = useCallback((entries) => {
    const target = entries[0];
    if (target.isIntersecting && hasMore && searching && !loading) {
      fetchSearch(false, page + 1);
    }
  }, [hasMore, searching, loading, page, search]);

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

  // When a new search is performed
  const handleSearch = () => {
    setPage(1);
    setHasMore(true);
    setSearching(true);
    fetchSearch(true, 1);
  };

  // When a suggestion is clicked
  const handleSuggestionClick = (title) => {
    setSearch(title);
    setTimeout(() => handleSearch(), 0);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', color: 'var(--color-text)' }}>
      <NavBar />
      <div className="searchbar" style={{ padding: '1rem', background: 'var(--color-bg)', color: 'var(--color-text)' }}>
        <SearchBar
          value={search}
          onChange={e => setSearch(e.target.value)}
          onSearch={handleSearch}
          lastSearchedTitle={lastSearched ? lastSearched.title : ''}
          onSuggestionClick={handleSuggestionClick}
        />
        <FilterBar
          genre={genre}
          setGenre={setGenre}
          year={year}
          setYear={setYear}
          rating={rating}
          setRating={setRating}
          genres={genres}
        />
        {loading && <p>Loading movies...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div className="card" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem', 
          marginTop: '1rem', 
          background: 'var(--color-card)', 
          borderRadius: 12, 
          padding: '1.5rem',
          maxWidth: '100%',
          overflowX: 'auto'
        }}>
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} onClick={handleCardClick} />
          ))}
        </div>
        {/* Infinite scroll loader for search results */}
        {searching && hasMore && <div ref={loader} style={{ height: 40 }} />}
        {/* Load More for discover (not searching) */}
        {!searching && hasMore && !loading && !search && (
          <button 
            onClick={() => fetchMovies(false, page + 1)} 
            style={{ 
              margin: '2rem auto', 
              display: 'block', 
              padding: '1rem 2rem', 
              fontSize: '1.2rem', 
              borderRadius: 12,
              border: 'none',
              background: 'var(--color-accent)',
              color: '#fff',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}
            onMouseOver={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
            }}
          >
            Load More
          </button>
        )}
        {selectedMovie && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => { setSelectedMovie(null); setDetails(null); }}>
            <div style={{ background: 'var(--color-card)', color: 'var(--color-text)', padding: '2rem', borderRadius: '8px', minWidth: '320px', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
              {detailsLoading ? (
                <p style={{ fontSize: '1.2rem' }}>Loading details...</p>
              ) : details ? (
                <>
                  <h2 style={{ fontSize: '2.2rem', marginBottom: '1.5rem' }}>{details.title}</h2>
                  <p style={{ fontSize: '1.3rem', marginBottom: '0.8rem' }}><b>Release:</b> {details.release_date}</p>
                  <p style={{ fontSize: '1.3rem', marginBottom: '0.8rem' }}><b>Rating:</b> {details.vote_average}</p>
                  <p style={{ fontSize: '1.3rem', marginBottom: '0.8rem' }}><b>Runtime:</b> {details.runtime} min</p>
                  <p style={{ fontSize: '1.3rem', marginBottom: '0.8rem' }}><b>Genres:</b> {details.genres && details.genres.map(g => g.name).join(', ')}</p>
                  <p style={{ fontSize: '1.3rem', marginBottom: '1.2rem' }}><b>Overview:</b> {details.overview}</p>
                  <a href={`https://www.themoviedb.org/movie/${details.id}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: '1.3rem', color: 'var(--color-accent)', textDecoration: 'none' }}>TMDb Page</a>
                  {trailers.length > 0 && (
                    <div style={{ marginTop: '1.5rem', maxWidth: '600px', margin: '1.5rem auto 0' }}>
                      <h4 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Trailer</h4>
                      <iframe
                        width="100%"
                        height="280"
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
                <p style={{ fontSize: '1.2rem' }}>Failed to load details.</p>
              )}
              <button className="btn" onClick={() => { setSelectedMovie(null); setDetails(null); }} style={{ marginTop: '1.5rem', padding: '0.8rem 1.5rem', borderRadius: 8, border: 'none', fontSize: '1.2rem', background: 'var(--color-accent)', color: '#fff', cursor: 'pointer' }}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home; 