import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";

import App from "./App";
import NotFound from "pages/NotFound";
import ErrorBoundary from "pages/ErrorBoundary";

const theme = localStorage.getItem("theme");

if (
  theme === "dark" ||
  (!theme && window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.add("light");
}

const AppContainer = (
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: AppContainer,
    errorElement: <NotFound />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
