import React from 'react';
import styled from '@emotion/styled';

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 2rem;
`;

const LoaderOverlayContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const LoaderSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 3px solid var(--color-card);
  border-radius: 50%;
  border-top-color: var(--color-accent);
  animation: spin 1s ease-in-out infinite;
  margin: 0 auto;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoaderText = styled.div`
  color: var(--color-text);
  font-size: 1.2rem;
  margin-top: 1rem;
  text-align: center;
`;

const Loader = ({ overlay, text }) => {
  const content = (
    <>
      <LoaderSpinner />
      {text && <LoaderText>{text}</LoaderText>}
    </>
  );

  if (overlay) {
    return (
      <LoaderOverlayContainer>
        {content}
      </LoaderOverlayContainer>
    );
  }

  return (
    <LoaderContainer>
      {content}
    </LoaderContainer>
  );
};

export default Loader; 