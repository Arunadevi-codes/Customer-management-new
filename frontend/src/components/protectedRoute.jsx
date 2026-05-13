import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/authContext";

// Role → their home dashboard
const ROLE_HOME = {
  superadmin: "/dashboard",
  staff:      "/staff-dashboard",
};

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  // Not logged in → login page
  if (!user) return <Navigate to="/" replace />;

  // Role not allowed → redirect to their own dashboard
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const home = ROLE_HOME[user.role] || "/";
    return <Navigate to={home} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;