import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ThemeProvider } from './lib/theme';
import { AiErrorBoundary } from './components/AiErrorBoundary';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AiErrorBoundary>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </AiErrorBoundary>
  </StrictMode>,
);

