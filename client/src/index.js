import React from "react";
import ReactDOM from "react-dom/client";
import "./App.css";
import App from "./App";
import Profile from "./pages/Profile";
import Contact from "./pages/Contact";
import Authentication from "./pages/Authentication";
import AdminDash from "./pages/AdminDash";

//import reportWebVitals from "./reportWebVitals";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Rating from "./pages/Rating";
const router = createBrowserRouter([
  //{ path: "/", element: <LandingPage /> },
  {
    path: "",
    element: <App />,
  },
  {
    path: "contact",
    element: <Contact />,
  },
  {
    path: "profile",
    element: <Profile />,
  },
  {
    path: "auth",
    element: <Authentication />,
  },
  {
    path: "admin",
    element: <AdminDash />,
  },
  {path: "rating",
    element: <Rating />,
  }
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={router} />);
