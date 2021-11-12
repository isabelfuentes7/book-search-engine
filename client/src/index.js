import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';

ReactDOM.render(
  <React.StrictMode className="app-background-color">
    <App className="app-background-color" />
  </React.StrictMode>,
  document.getElementById('root')
);
