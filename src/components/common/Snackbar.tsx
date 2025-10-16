import React, { useEffect } from 'react';
import styled from 'styled-components';

interface SnackbarProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  isOpen: boolean;
  onClose: () => void;
  autoHideDuration?: number;
}

const SnackbarContainer = styled.div<{ 
  $isOpen: boolean; 
  $type: 'success' | 'error' | 'info' 
}>`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%) translateY(${props => props.$isOpen ? '0' : '100px'});
  background-color: ${props => {
    switch (props.$type) {
      case 'success': return '#4caf50';
      case 'error': return '#f44336';
      case 'info': default: return '#2196f3';
    }
  }};
  color: white;
  padding: 12px 24px;
  border-radius: 4px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
  min-width: 250px;
  max-width: 80%;
  text-align: center;
  z-index: 1000;
  opacity: ${props => props.$isOpen ? '1' : '0'};
  transition: transform 0.3s ease, opacity 0.3s ease;
`;

const Snackbar: React.FC<SnackbarProps> = ({
  message,
  type = 'info',
  isOpen,
  onClose,
  autoHideDuration = 5000
}) => {
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isOpen && autoHideDuration > 0) {
      timer = setTimeout(() => {
        onClose();
      }, autoHideDuration);
    }
    
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [isOpen, autoHideDuration, onClose]);
  
  return (
    <SnackbarContainer $isOpen={isOpen} $type={type}>
      {message}
    </SnackbarContainer>
  );
};

export default Snackbar;
