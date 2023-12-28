import { Link } from "react-router-dom";

const index = () => {
  return (
    <>
      <h1>WELCOME</h1>
      <Link to="/login">Login</Link>
    </>
  );
};

export default index;
