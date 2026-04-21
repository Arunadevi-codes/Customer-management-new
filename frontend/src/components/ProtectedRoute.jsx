import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/authContext";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  // Wait until auth check completes
  if (loading) {
    return <div>Loading...</div>;
  }

  // If no user → redirect
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
