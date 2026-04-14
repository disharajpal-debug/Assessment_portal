import { Navigate } from "react-router-dom";
import { getAccessToken, getAuth } from "../utils/auth";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = getAuth();
  const accessToken = getAccessToken();

  if (!user || !accessToken) {
    return <Navigate to="/" />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
