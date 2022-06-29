import { Suspense, lazy } from "react";
import { RecoilRoot } from "recoil";
import { HashRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import Loader from "./modules/common/loader";
import ErrorBoundary from "./modules/common/error-boundary";
import "./styles/main.scss";

// preload lazy-loaded page components
const Home = preloadLazyComponent(() => import("./modules/home/home"));
const Analysis = preloadLazyComponent(() => import("./modules/analysis/analysis"));
const About = preloadLazyComponent(() => import("./modules/about/about"));

function preloadLazyComponent(factory) {
  const loader = factory();
  return lazy(() => loader);
}

export default function App() {
  const links = [
    {
      route: "/home",
      title: "Home",
      component: Home,
    },
    {
      route: "/",
      title: "Analysis",
      component: Analysis,
    },
    {
      route: "/about",
      title: "About",
      component: About,
    },
  ];

  return (
    <RecoilRoot>
      <Router>
        <div className="d-flex flex-column flex-grow-1">
          <Navbar expand="sm" variant="dark" className="py-0 flex-none-auto bg-dark">
            <Container className="px-5">
              <Navbar.Toggle aria-controls="app-navbar" />
              <Navbar.Collapse id="app-navbar">
                <Nav className="d-flex w-100">
                  {links.map((link, index) => (
                    <NavLink key={`navlink-${index}`} to={link.route} className="nav-link">
                      {link.title}
                    </NavLink>
                  ))}
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
          <div id="main-content" className="d-flex flex-column flex-grow-1">
            <ErrorBoundary fallback="">
              <Suspense fallback={<Loader>Loading Page</Loader>}>
                <Routes>
                  {links.map((link, index) => (
                    <Route exact key={`route-${index}`} path={link.route} element={<link.component />} />
                  ))}
                </Routes>
              </Suspense>
            </ErrorBoundary>
          </div>
        </div>
      </Router>
      {/* <pre>{JSON.stringify(process.env, null, 2)}</pre> */}
    </RecoilRoot>
  );
}
