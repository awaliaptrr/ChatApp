import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const AuthValidation = ({ allowedRoles, mode }) => {
  const { roles, isExist } = useAuth();

  let content;
  if (isExist) {
    if (mode === "authentication") {
      content = roles.some((role) => allowedRoles.includes(role)) ? (
        <Outlet />
      ) : (
        <Navigate to="/login" />
      );
    } else if (mode === "authorization") {
      content = roles.some((role) => allowedRoles.includes(role)) ? (
        <Outlet />
      ) : (
        <p>G BLEH</p>
      );
    }
  } else {
    content = <Navigate to="/login" />;
  }

  return content;
};

export default AuthValidation;
