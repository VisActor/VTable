import ReactDOM from 'react-dom/client';
import React from 'react';
import App from './App';
import './index.css';
/*global document*/
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
