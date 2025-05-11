import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import NavBar from '../components/NavBar';
import SearchBar from '../components/SearchBar';
import MovieCard from '../components/MovieCard';
import FilterBar from '../components/FilterBar';
import { fetchMovies, searchMovies, setSearchQuery, clearMovies } from '../store/slices/moviesSlice';
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
  const dispatch = useDispatch();
  const { movies, searchResults, loading, error, searchQuery, currentPage, totalPages } = useSelector(state => state.movies);
  
  const [genre, setGenre] = useState('');
  const [year, setYear] = useState('');
  const [rating, setRating] = useState('');
  const [searching, setSearching] = useState(false);
  const [search, setSearch] = useState('');
  const [lastSearched, setLastSearched] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [genres, setGenres] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [details, setDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [trailers, setTrailers] = useState([]);
  const loader = useRef(null);

  useEffect(() => {
    // Fetch genres on component mount
    axiosInstance.get(`genre/movie/list?api_key=${API_KEY}`)
      .then((res) => {
        if (res.data.genres) {
          setGenres(res.data.genres);
        }
      });

    // Initial movies fetch
    dispatch(fetchMovies({ page: 1, genre, year, rating }));
  }, [dispatch]);

  useEffect(() => {
    setHasMore(currentPage < totalPages);
  }, [currentPage, totalPages]);

  const fetchMoviesHandler = useCallback((isSearching, pageNumber = 1) => {
    if (isSearching && searchQuery) {
      dispatch(searchMovies({ query: searchQuery, page: pageNumber }));
    } else {
      dispatch(fetchMovies({ page: pageNumber, genre, year, rating }));
    }
  }, [dispatch, searchQuery, genre, year, rating]);

  const handleObserver = useCallback((entries) => {
    const target = entries[0];
    if (target.isIntersecting && hasMore) {
      fetchMoviesHandler(searching, currentPage + 1);
    }
  }, [fetchMoviesHandler, hasMore, searching, currentPage]);

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

  const handleSearch = () => {
    if (search.trim()) {
      setSearching(true);
      dispatch(clearMovies());
      dispatch(setSearchQuery(search));
      setLastSearched({ title: search });
      dispatch(searchMovies({ query: search, page: 1 }));
    }
  };

  const handleSuggestionClick = (title) => {
    setSearch(title);
    setSearching(true);
    dispatch(clearMovies());
    dispatch(setSearchQuery(title));
    setLastSearched({ title });
    dispatch(searchMovies({ query: title, page: 1 }));
  };

  const handleFilterChange = () => {
    setSearching(false);
    dispatch(clearMovies());
    dispatch(setSearchQuery(''));
    setSearch('');
    setLastSearched(null);
    dispatch(fetchMovies({ page: 1, genre, year, rating }));
  };

  useEffect(() => {
    // When filters change, reload movies
    if (!searching) {
      handleFilterChange();
    }
  }, [genre, year, rating]);

  const displayedMovies = searching ? searchResults : movies;

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
          {displayedMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} onClick={handleCardClick} />
          ))}
        </div>
        {/* Infinite scroll loader for search results */}
        {searching && hasMore && <div ref={loader} style={{ height: 40 }} />}
        {/* Load More for discover (not searching) */}
        {!searching && !loading && movies.length > 0 && (
          <button 
            onClick={() => fetchMoviesHandler(false, currentPage + 1)} 
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
                    <div style={{ marginTop: '1.5rem' }}>
                      <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Trailer</h3>
                      <iframe 
                        width="100%" 
                        height="315" 
                        src={`https://www.youtube.com/embed/${trailers[0].key}`}
                        title="Trailer"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  )}
                </>
              ) : (
                <p>Failed to load details.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home; 