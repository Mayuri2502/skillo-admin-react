import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCredentials } from "./redux/slice/authSlice";

const AuthBootstrap = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("_dw_aat");
    const user = localStorage.getItem("userData");

    if (token && user) {
      dispatch(
        setCredentials({
          accessToken: token,
          user: JSON.parse(user),
        })
      );
    }
  }, [dispatch]);

  return children;
};

export default AuthBootstrap;
