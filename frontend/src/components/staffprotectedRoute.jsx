import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/authContext";

const StaffProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  // Not logged in → back to login
  if (!user) return <Navigate to="/" replace />;

  if (user.role === "superadmin") return <Navigate to="/dashboard" replace />;

  return <Outlet />;
};

export default StaffProtectedRoute;