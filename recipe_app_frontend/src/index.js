import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Try to conditionally use react-router-dom if available
let RouterWrapper = ({ children }) => children;
let RoutesComponent = null;

try {
  // Dynamically require to avoid build-time failure if not installed
  // eslint-disable-next-line global-require
  const rrd = require('react-router-dom');
  if (rrd && rrd.BrowserRouter) {
    const { BrowserRouter } = rrd;
    RouterWrapper = function RouterWrap({ children }) {
      return <BrowserRouter>{children}</BrowserRouter>;
    };
    // eslint-disable-next-line global-require
    RoutesComponent = require('./routes/AppRoutes.jsx').default;
  }
} catch {
  // react-router-dom not installed; fall back to plain App
  RouterWrapper = ({ children }) => children;
  RoutesComponent = null;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterWrapper>
      {RoutesComponent ? <RoutesComponent /> : <App />}
    </RouterWrapper>
  </React.StrictMode>
);
