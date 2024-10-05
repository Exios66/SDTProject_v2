import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ErrorBoundary } from 'react-error-boundary';

// Custom error fallback component
const ErrorFallback = ({ error }) => (
  <div role="alert">
    <h1>Oops! Something went wrong.</h1>
    <pre style={{ whiteSpace: 'normal' }}>{error.message}</pre>
  </div>
);

// Function to initialize the React app
const initializeApp = () => {
  const root = document.getElementById('root');
  if (!root) {
    console.error('Root element not found');
    return;
  }

  try {
    const reactRoot = ReactDOM.createRoot(root);
    reactRoot.render(
      <React.StrictMode>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <App />
        </ErrorBoundary>
      </React.StrictMode>
    );
    console.log('React app rendered successfully');
  } catch (error) {
    console.error('Error rendering React app:', error);
  }
};

// Event listener for DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded and parsed');
  initializeApp();
});

// Performance monitoring
reportWebVitals(console.log);

// Hot Module Replacement (HMR) setup
if (module.hot) {
  module.hot.accept('./App', () => {
    console.log('Hot Module Replacement triggered');
    initializeApp();
  });
}

// Global error handling
window.addEventListener('error', (event) => {
  console.error('Uncaught error:', event.error);
  // You can add additional error reporting logic here
});

// Optimize loading performance
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('ServiceWorker registered:', registration);
      })
      .catch(error => {
        console.error('ServiceWorker registration failed:', error);
      });
  });
}