import {ProtectedRoute, ProtectedRecover} from "../components/ProtectedRoute";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import Recover from "../pages/Recover";
import "../styles/general.css";
import "../styles/icons.css";

const routes = [
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/*",
    element: <NotFound />,
  },
  {
    path: "/recover",
    element: (
      <ProtectedRecover>
        <Recover/>
      </ProtectedRecover>
    ),
  },
];

export default routes;
