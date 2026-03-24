import { createContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";

const RootContext = createContext(null);

export const RootProvider = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // AuthBootstrap already handled auth
    setLoading(false);
  }, []);

  return (
    <RootContext.Provider value={{ loading, isAuthenticated }}>
      {children}
    </RootContext.Provider>
  );
};

export default RootContext;
