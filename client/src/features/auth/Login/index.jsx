import styles from "./login.module.scss";
import { Gap, Input, Button } from "../../../components";
import { setCredentials } from "../authSlice";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../authApiSlice.js";
import { useDispatch } from "react-redux";
import { setIsLogged } from "../../main/metaSlice";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userRef = useRef();

  useEffect(() => {
    userRef.current.focus();
  }, []);

  const [login] = useLoginMutation();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { token } = await login({ username, password }).unwrap();
      setErrMsg("");
      setUsername("");
      setPassword("");
      dispatch(setCredentials(token));
      dispatch(setIsLogged(true));
      navigate("/");
    } catch (err) {
      if (!err.status) {
        setErrMsg("No Server Response");
      } else {
        setErrMsg(err.data?.message);
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <h1 className={styles.title}>Login</h1>
        <Gap height={50} />
        <form onSubmit={submit}>
          <Input
            label="Username"
            onChange={(e) => setUsername(e.target.value)}
            ref={userRef}
            model={1}
          />
          <Gap height={20} />
          <Input
            label="Password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            model={1}
          />
          <a className={styles.fp} href="">
            Forgot password?
          </a>
          <Gap height={70} />
          <Button model="button1" value="Login" />
        </form>
        <Gap height={30} />
        <p style={{ color: "red", textAlign: "center" }}>{errMsg}</p>
        <Gap height={40} />
        <p>
          Don't have an account?{" "}
          <Link to="/register" className={styles.reg}>
            Register here.
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
