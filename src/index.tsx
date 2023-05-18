// react imports
import React from 'react';
import { createRoot } from 'react-dom/client';

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
    <h1> Hello World </h1>
  </React.StrictMode>
);

reportWebVitals();
