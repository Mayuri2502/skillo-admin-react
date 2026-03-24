import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import RootContext from "../contexts/RootContext";
import Loader from "../components/Loader";

const PublicRoute = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { loading } = useContext(RootContext);

  if (loading) return <Loader />;

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
