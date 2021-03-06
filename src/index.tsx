import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

// used to style react-icons globally
import { IconContext } from "react-icons";


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <IconContext.Provider value={{ className: 'react-icons' }}>
        <App />
      </IconContext.Provider>
    </BrowserRouter>
  </React.StrictMode>
);
