import { StrictMode } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.tsx';
import { AuthProvider } from './context/AuthContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChakraProvider>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </ChakraProvider>
  </StrictMode>,
);
