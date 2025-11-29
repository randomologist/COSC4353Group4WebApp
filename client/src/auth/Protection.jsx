import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export default function Protection({ role }) {
  const { token, user } = useAuth();
  if (!token || !user) return <Navigate to="/auth" replace />;
  if (role && user?.role !== role) return <Navigate to="/home" replace />;
  return <Outlet/>;
}
