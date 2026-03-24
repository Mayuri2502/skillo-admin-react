import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import RootContext from "../contexts/RootContext";
import Loader from "../components/Loader";

const ProtectedRoute = () => {
  const { accessToken, isAuthenticated } = useSelector(
    (state) => state.auth
  );
  console.log('accessToken',accessToken);
  
  const { loading } = useContext(RootContext);

  // Wait for global app bootstrapping
  if (loading) return <Loader />;

  // Hard auth check
  if (!accessToken || !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
