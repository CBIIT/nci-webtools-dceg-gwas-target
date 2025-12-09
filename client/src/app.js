import { Outlet } from "react-router-dom";
import Navbar from "./modules/navbar/navbar";
import { routes } from "./routes";
import Footer from "./modules/footer/footer";
export default function App() {
  const childRoutes = routes[0].children.filter((route) => !route.hide);

  return (
    <>
      <Navbar routes={childRoutes} />
      <div className="bg-light">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}
