import { useAppSelector } from "@/app/hooks";
import { Navigate, Outlet, useLocation } from "react-router-dom";

function PrivateRoute() {
  const isAuthenticated = useAppSelector((store) => store.auth.isAuthenticated);
  const currentUser = useAppSelector((store) => store.auth.currentUser);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={location} />;
  }

  if (!currentUser.isActive) {
    if (location.pathname !== "/") {
      return <Navigate to="/" state={location} />;
    }
  }

  return <Outlet />;
}

export default PrivateRoute;
