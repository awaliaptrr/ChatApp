import { Routes, Route, Navigate } from "react-router-dom";
import { Layout, Welcome } from "./pages";
import { Login, Register } from "./features/auth";
import AuthValidation from "./features/auth/AuthValidation";
import { Home } from "./features/main";
import { ROLES } from "./config/roles";
import { useSelector } from "react-redux";
import { selectIsLogged } from "./features/main/metaSlice";
import PersistLogin from "./features/auth/PersistLogin";

const App = () => {
  const isLogged = useSelector(selectIsLogged);
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route element={<PersistLogin />}>
          {!isLogged ? (
            <>
              <Route index element={<Welcome />} />
              <Route path="register" element={<Register />} />
              <Route path="login" element={<Login />} />
            </>
          ) : (
            <Route
              element={
                <AuthValidation
                  allowedRoles={[...Object.values(ROLES)]}
                  mode="authentication"
                />
              }
            >
              <Route index element={<Home />} />
            </Route>
          )}
          <Route path="*" element={<p>NOT FOUND</p>} />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
