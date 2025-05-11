import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from '@emotion/styled';
import { toggleTheme } from '../store/slices/themeSlice';
import { logout } from '../store/slices/authSlice';

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

const LogoutButton = styled.button`
  color: var(--color-text);
  background: none;
  border: none;
  text-decoration: none;
  font-size: 1.2rem;
  font-weight: 500;
  transition: all 0.2s ease;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: #ff4444;
    color: white;
    transform: translateY(-2px);
  }
`;

const NavBar = () => {
  const dispatch = useDispatch();
  const { darkMode } = useSelector(state => state.theme);
  
  const handleToggleDarkMode = () => {
    dispatch(toggleTheme());
  };

  const handleLogout = () => {
    dispatch(logout());
  };

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
          onClick={handleToggleDarkMode} 
          title="Toggle dark mode"
        >
          {darkMode ? '☀️' : '🌙'}
        </DarkModeButton>
        <LogoutButton onClick={handleLogout}>
          Logout
        </LogoutButton>
      </NavLinks>
    </Nav>
  );
};

export default NavBar; 