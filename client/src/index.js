import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { reportWebVitals } from "./reportWebVitals";
import { routes } from "./routes";
import "./styles/main.scss";

const root = createRoot(document.getElementById("root"));
const router = createBrowserRouter(routes, { basename: process.env.PUBLIC_URL });

root.render(
  <StrictMode>
    <RecoilRoot>
      <RouterProvider router={router} />
    </RecoilRoot>
  </StrictMode>
);

reportWebVitals(console.log);
