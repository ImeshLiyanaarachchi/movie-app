import React from 'react';
import styled from '@emotion/styled';

const FilterContainer = styled.div`
  display: flex;
  gap: 1.5rem;
  margin: 1rem auto;
  background: var(--color-card);
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
  max-width: 600px;
`;

const Select = styled.select`
  padding: 0.8rem 1.2rem;
  font-size: 1.1rem;
  background: var(--color-card);
  color: var(--color-text);
  border: 2px solid var(--color-accent);
  border-radius: 8px;
  cursor: pointer;
  min-width: 200px;
  transition: all 0.3s ease;
  outline: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1em;
  padding-right: 2.5rem;

  &:hover, &:focus {
    border-color: var(--color-accent);
    box-shadow: 0 0 0 3px rgba(var(--color-accent-rgb), 0.2);
  }
`;

const Input = styled.input`
  padding: 0.8rem 1.2rem;
  font-size: 1.1rem;
  background: var(--color-card);
  color: var(--color-text);
  border: 2px solid var(--color-accent);
  border-radius: 8px;
  transition: all 0.3s ease;
  outline: none;
  width: 120px;

  &:hover, &:focus {
    border-color: var(--color-accent);
    box-shadow: 0 0 0 3px rgba(var(--color-accent-rgb), 0.2);
  }

  &::placeholder {
    color: var(--color-text-light);
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &[type=number] {
    -moz-appearance: textfield;
  }
`;

const FilterBar = ({ genre, setGenre, year, setYear, rating, setRating, genres }) => {
  const currentYear = new Date().getFullYear();

  return (
    <FilterContainer>
      <div>
        <Select 
          value={genre} 
          onChange={e => setGenre(e.target.value)}
        >
          <option value="">All Genres</option>
          {genres.map(g => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </Select>
      </div>

      <div>
        <Input
          type="number"
          placeholder="Year"
          value={year}
          min="1900"
          max={currentYear}
          onChange={e => setYear(e.target.value)}
        />
      </div>

      <div>
        <Input
          type="number"
          placeholder="Min Rating"
          value={rating}
          min="0"
          max="10"
          step="0.1"
          onChange={e => setRating(e.target.value)}
        />
      </div>
    </FilterContainer>
  );
};

export default FilterBar; 