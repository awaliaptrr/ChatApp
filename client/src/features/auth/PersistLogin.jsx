import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { selectCurrentToken } from "./authSlice";
import { useRefreshMutation } from "./authApiSlice";

const PersistLogin = () => {
  const token = useSelector(selectCurrentToken);

  const [refresh, { isUninitialized, isLoading, isSuccess, isError, error }] =
    useRefreshMutation();

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (err) {
        console.error(err);
      }
    };

    if (!token) verifyRefreshToken();
  }, []);

  let content;

  if (isLoading) {
    content = <p>loading</p>;
  } else {
    content = <Outlet />;
  }

  return content;
};

export default PersistLogin;
