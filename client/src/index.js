import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { reportWebVitals } from "./reportWebVitals";
import { routes } from "./routes";
import "./styles/main.scss";
import "./styles/ncids.css";

const publicUrl = process.env.PUBLIC_URL || "";
const rootStyle = document.documentElement.style;
rootStyle.setProperty("--nci-icon-arrow-up", `url(${publicUrl}/assets/images/f9c01d16faaf56fa4247.svg)`);
rootStyle.setProperty("--nci-icon-plus", `url(${publicUrl}/assets/images/31d5b0683ccce72c008f.svg)`);
rootStyle.setProperty("--nci-icon-chevron", `url(${publicUrl}/assets/images/84649ddddcc0da925ace.svg)`);
rootStyle.setProperty("--nci-icon-chevron-alt", `url(${publicUrl}/assets/images/0a31e5803eb655c58da2.svg)`);

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
