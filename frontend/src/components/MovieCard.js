import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToFavorites, removeFromFavorites } from '../store/slices/favoritesSlice';

const IMG_BASE = 'https://image.tmdb.org/t/p/w300';

const MovieCard = ({ movie, onClick }) => {
  const dispatch = useDispatch();
  const { favoriteIds } = useSelector(state => state.favorites);
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    setIsFav(favoriteIds.includes(movie.id));
  }, [favoriteIds, movie.id]);

  const toggleFavorite = (e) => {
    e.stopPropagation();
    if (isFav) {
      dispatch(removeFromFavorites(movie.id));
    } else {
      dispatch(addToFavorites(movie.id));
    }
  };

  if (!movie) return null;
  return (
    <div
      style={{
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        cursor: 'pointer',
        position: 'relative',
        transition: 'all 0.3s ease',
        background: 'var(--color-card)',
        transform: 'translateY(0)'
      }}
      onClick={() => onClick && onClick(movie)}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-10px) scale(1.05)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
      }}
    >
      <div style={{ position: 'relative', paddingTop: '150%' }}>
        <img
          src={movie.poster_path ? IMG_BASE + movie.poster_path : 'https://via.placeholder.com/180x270?text=No+Image'}
          alt={movie.title}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderTopLeftRadius: '12px',
            borderTopRightRadius: '12px',
            transition: 'transform 0.3s ease'
          }}
        />
        <button
          onClick={toggleFavorite}
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            background: 'rgba(0,0,0,0.5)',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '1.2rem',
            color: isFav ? '#ff4d4d' : '#fff',
            transition: 'all 0.3s ease',
            zIndex: 2
          }}
          title={isFav ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFav ? '♥' : '♡'}
        </button>
      </div>
      <div style={{ padding: '1rem' }}>
        <h3 style={{
          fontSize: '1rem',
          margin: '0 0 0.5rem 0',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>{movie.title}</h3>
        <p style={{
          fontSize: '0.9rem',
          color: 'var(--color-text-secondary)',
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span>{movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}</span>
          <span>•</span>
          <span>⭐ {movie.vote_average?.toFixed(1) || 'N/A'}</span>
        </p>
      </div>
    </div>
  );
};

export default MovieCard; 