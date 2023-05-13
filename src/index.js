import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import Split from './components/Split/Split';
import reportWebVitals from './reportWebVitals';
import Settings from './components/Settings/Settings';
import Inheritance from './components/Inheritance/Inheritance';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Inheritance />,
    children: []
  },
  {
    path: '/settings',
    element: <Settings />
  },
  {
    path: '/split',
    element: <Split />
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
