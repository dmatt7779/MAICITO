import { Navigate } from "react-router-dom";
import { ProtectedRoutes } from "../interfaces";

export const ProtectedRoute = ({ children }: ProtectedRoutes) => {
  const dataSession = sessionStorage.getItem("isLogged");
  return !dataSession ? <Navigate to="/login" /> : children;
};

export const ProtectedRecover = ({ children }: ProtectedRoutes) => {
  const queryParams = new URLSearchParams(location.search),
    token = queryParams.get('token');

    return !token ? <Navigate to="/login" /> : children;
};
