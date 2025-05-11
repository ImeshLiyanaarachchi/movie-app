import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';

const Nav = styled.nav`
  background: var(--color-card);
  color: var(--color-text);
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
`;

const BrandName = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
  letter-spacing: -0.5px;
  background: linear-gradient(45deg, var(--color-accent), var(--color-text));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
`;

const StyledLink = styled(Link)`
  color: var(--color-text);
  text-decoration: none;
  font-size: 1.2rem;
  font-weight: 500;
  transition: all 0.2s ease;
  padding: 0.5rem 1rem;
  border-radius: 8px;

  &:hover {
    background: var(--color-accent);
    color: white;
    transform: translateY(-2px);
  }
`;

const DarkModeButton = styled.button`
  margin-left: 1rem;
  background: var(--color-card);
  border: 2px solid var(--color-accent);
  color: var(--color-accent);
  font-size: 1.3rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: var(--color-accent);
    color: var(--color-card);
    transform: rotate(360deg);
  }
`;

const getInitialMode = () => {
  // Check if theme was previously set
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    return savedTheme === 'dark';
  }
  
  // If no saved theme, return true for dark mode as default
  return true;
};

const NavBar = () => {
  const [darkMode, setDarkMode] = useState(getInitialMode());

  useEffect(() => {
    // Set initial theme class on body
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    // Save theme preference
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  // Set initial dark mode class when component mounts
  useEffect(() => {
    if (getInitialMode()) {
      document.body.classList.add('dark-mode');
    }
  }, []);

  return (
    <Nav>
      <BrandName>
        MovieApp
      </BrandName>
      <NavLinks>
        <StyledLink to="/home">
          Home
        </StyledLink>
        <StyledLink to="/trending">
          Trending
        </StyledLink>
        <StyledLink to="/favorites">
          Favorites
        </StyledLink>
        <DarkModeButton 
          onClick={toggleDarkMode} 
          title="Toggle dark mode"
        >
          {darkMode ? '☀️' : '🌙'}
        </DarkModeButton>
      </NavLinks>
    </Nav>
  );
};

export default NavBar; 