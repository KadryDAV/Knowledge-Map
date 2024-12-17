import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { MapProvider } from './context/MapContext';
import './css/styles.css';

ReactDOM.render(
  <AuthProvider>
    <MapProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </MapProvider>
  </AuthProvider>,
  document.getElementById('root')
);
