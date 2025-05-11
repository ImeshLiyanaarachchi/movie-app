import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg);
  color: var(--color-text);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
`;

const LoginCard = styled.div`
  background: var(--color-card);
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  background: linear-gradient(45deg, var(--color-accent), var(--color-text));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const Input = styled.input`
  padding: 1rem 1.5rem;
  font-size: 1.1rem;
  border: 2px solid var(--color-accent);
  border-radius: 8px;
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
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  margin-top: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(var(--color-accent-rgb), 0.3);
  }
`;

const Message = styled.p`
  margin-top: 1rem;
  text-align: center;
  font-size: 1.1rem;
  color: ${props => props.success ? 'var(--color-success)' : 'var(--color-accent)'};
  transition: all 0.3s ease;
`;

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Hardcoded credentials
    if (username === 'admin' && password === '1234') {
      setMessage('✅ Login successful!');
      setTimeout(() => navigate('/home'), 800); // Navigate after a short delay
    } else {
      setMessage('❌ Invalid username or password.');
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <Title>MovieApp</Title>
        <Form onSubmit={handleLogin}>
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit">Login</Button>
        </Form>
        {message && (
          <Message success={message.includes('successful')}>
            {message}
          </Message>
        )}
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;