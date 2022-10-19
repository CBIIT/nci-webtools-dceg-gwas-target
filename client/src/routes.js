import { Navigate } from "react-router-dom";
import App from "./app";
import Home from "./modules/home/home";
import About from "./modules/about/about";
import Analysis from "./modules/analysis/analysis";

export const routes = [
  {
    element: <App />,
    children: [
      {
        path: "/home",
        element: <Home />,
        title: "Home",
        end: true,
      },
      {
        path: "/analysis/:id",
        element: <Analysis />,
        title: "Analysis",
        hide: true,
      },
      {
        path: "/analysis",
        element: <Analysis />,
        title: "Analysis",
        end: false,
      },
      {
        path: "/about",
        element: <About />,
        title: "About",
        end: true,
      },
      {
        path: "/",
        element: <Navigate to="/analysis" />,
        hide: true,
      },
      {
        path: "*",
        element: <div>Not Found</div>,
        hide: true,
      },
    ],
  },
];
