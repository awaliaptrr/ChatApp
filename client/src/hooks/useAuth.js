import { useSelector } from "react-redux";
import { selectCurrentToken } from "../features/auth/authSlice";
import jwtDecode from "jwt-decode";

const useAuth = () => {
  const token = useSelector(selectCurrentToken);
  let isAdmin = false;
  let isExist = false;

  if (token) {
    const decoded = jwtDecode(token);
    const { username, roles } = decoded.person;

    isAdmin = roles.includes("admin");
    isExist = true;

    return { username, roles, isAdmin, isExist };
  }

  return { username: "", roles: [], isAdmin, isExist };
};

export default useAuth;
