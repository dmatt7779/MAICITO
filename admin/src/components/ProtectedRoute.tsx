import { Navigate } from "react-router-dom";
import { ProtectedRoutes } from "../interfaces";

const ProtectedRoute = ({ children }: ProtectedRoutes) => {
  const dataSession = sessionStorage.getItem("isLogged");
  return !dataSession ? <Navigate to="/login" /> : children;
};

export default ProtectedRoute;
