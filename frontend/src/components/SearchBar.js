import React, { useState, useRef } from 'react';
import styled from '@emotion/styled';

const SearchWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: 0 auto 2rem auto;
`;

const SearchContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  width: 100%;
  position: relative;
`;

const Input = styled.input`
  padding: 1rem 1.5rem;
  font-size: 1.2rem;
  width: 100%;
  border-radius: 12px;
  border: 2px solid var(--color-accent);
  background: var(--color-card);
  color: var(--color-text);
  transition: all 0.3s ease;
  outline: none;

  &:focus {
    box-shadow: 0 0 0 3px rgba(var(--color-accent-rgb), 0.3);
  }

  &::placeholder {
    color: var(--color-text-light);
  }
`;

const Button = styled.button`
  padding: 1rem 2rem;
  font-size: 1.2rem;
  background: var(--color-accent);
  color: #fff;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  min-width: 120px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0,0,0,0.15);
  }
`;

const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  width: 100%;
  background: var(--color-card);
  border: 2px solid var(--color-accent);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  z-index: 10;
  cursor: pointer;
  padding: 1rem 1.5rem;
  text-align: left;
  animation: slideDown 0.3s ease;
  color: var(--color-text);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 24px rgba(0,0,0,0.2);
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const LastSearchedLabel = styled.span`
  color: var(--color-text-light);
  font-size: 1rem;
  display: block;
  margin-bottom: 0.5rem;
`;

const LastSearchedTitle = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--color-text);
`;

const SearchBar = ({ value, onChange, onSearch, placeholder, lastSearchedTitle, onSuggestionClick }) => {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef();

  return (
    <SearchWrapper>
      <SearchContainer>
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder || "Search movies..."}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 100)}
          onKeyDown={e => { if (e.key === 'Enter') onSearch(); }}
        />
        <Button onClick={onSearch}>
          Search
        </Button>
      </SearchContainer>
      {focused && !value && lastSearchedTitle && (
        <Dropdown
          onMouseDown={e => {
            e.preventDefault();
            onSuggestionClick && onSuggestionClick(lastSearchedTitle);
          }}
        >
          <LastSearchedLabel>Last searched:</LastSearchedLabel>
          <LastSearchedTitle>{lastSearchedTitle}</LastSearchedTitle>
        </Dropdown>
      )}
    </SearchWrapper>
  );
};

export default SearchBar; 