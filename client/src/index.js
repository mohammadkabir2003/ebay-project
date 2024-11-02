import React from "react";
import ReactDOM from "react-dom/client";
import "./App.css";
import App from "./App";
import Profile from "./pages/Profile";
import Contact from "./pages/Contact";
import Authentication from "./pages/Authentication";

//import reportWebVitals from "./reportWebVitals";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
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
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={router} />);
