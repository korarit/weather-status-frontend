import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

//import './index.css';

//router
import Bot_check from './view/turnstile';
import Rule from './view/rule';
import Reference from './view/reference';

import reportWebVitals from './reportWebVitals';

//router Create
const router = createBrowserRouter([
  {
    path: "/",
    element: <Bot_check />,
    children: [
    ],
  },
  {
    path: "/rule",
    element: <Rule />,
    children: [
    ],
  },
  {
    path: "/reference",
    element: <Reference />,
    children: [
    ],
  }
]);



const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
//root.render(
  //<React.StrictMode>
    //<App />
  //</React.StrictMode>
//);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
