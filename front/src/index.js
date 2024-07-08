import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import ErrorPage from "./pages/ErrorPage";
import PostDetail from "./pages/PostDetail"
import Login from "./pages/Login"
import Register from "./pages/Register"
import UserProfile from "./pages/UserProfile"
import CreatePost from "./pages/CreatePost"
import Authors from "./pages/Authors"
import Logout from "./pages/Logout"
import EditPost from "./pages/EditPost"
import Home from "./pages/Home"
import Dashboard from "./pages/Dashboard"
import CategoryPosts from "./pages/CategoryPosts"
import AuthorPosts from "./pages/AuthorPosts"
import DeletePost from "./pages/DeletePost"
import UserProvider from './context/userContext';

const router = createBrowserRouter([
  {
    path:"/" ,
    element:<UserProvider><Layout /></UserProvider>,
    errorElement: <ErrorPage />,
    children:[
      {index:true , element:<Home />},
      {path:"posts/:id", element:<PostDetail />},
      {path:"register", element:<Register />},
      {path:"login", element:<Login />},
      {path:"profile/:id" , element:<UserProfile />},
      {path:"authors", element:<Authors />},
      {path:"create", element:<CreatePost />},
      {path:"posts/:id/edit", element:<EditPost />},
      {path:"posts/categories/:category", element:<CategoryPosts />},
      {path:"posts/users/:id", element:<AuthorPosts />},
      {path:"posts/:id/delete", element:<DeletePost />},
      {path:"logout", element:<Logout />},
      {path:"myposts/:id", element:<Dashboard />}
    ]
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);


