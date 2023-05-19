// react imports
import React from 'react';
import { createRoot } from 'react-dom/client';

// component imports
import App from './components/App';

// style imports
import './styles/css/main.css';

// icon imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// misc imports
import reportWebVitals from './reportWebVitals';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');
const root = createRoot(rootElement);

//the app
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
