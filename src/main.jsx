import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { store } from './redux/store';
import { Provider } from 'react-redux';
import User from './pages/User.jsx';
import Post from './pages/Post.jsx';
import Home from './pages/Home.jsx';


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: "/user",
        element: <User />
      },
      {
        path: "/post",
        element: <Post />
      }
    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
)
