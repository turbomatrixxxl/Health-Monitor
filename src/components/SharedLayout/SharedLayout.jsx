import React, { useEffect, useState } from "react";
// import { useMediaQuery } from "react-responsive";

import { Outlet } from "react-router-dom";

import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import UpdateUser from "../UpdateUser";

import { useAuth } from "../../hooks/useAuth";
import { usePrivate } from "../../hooks/usePrivate";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import clsx from "clsx";

import styles from "./SharedLayout.module.css";

function SharedLayout() {
  const { isLoggedIn, isLoggedOut, errorAuth } = useAuth();
  const { message } = usePrivate();

  const [logoutShown, setLogoutShown] = useState(false);
  const [userUpdateShown, setUserUpdateShown] = useState(false);

  useEffect(() => {
    if (isLoggedOut && !logoutShown) {
      toast.success("You are not Logged in!");
      setLogoutShown(true);
    }
  }, [isLoggedOut, logoutShown]);

  useEffect(() => {
    if (errorAuth) {
      toast.error(errorAuth);
    }
  }, [errorAuth]);

  useEffect(() => {
    if (message) {
      toast.success(message);
    }
  }, [message]);

  // console.log({
  //   isLoggedIn: isLoggedIn,
  //   toastShown: toastShown,
  //   logoutShown: logoutShown,
  //   isLoggedOut: isLoggedOut,
  //   error: error,
  //   errorAuth: errorAuth,
  //   message: message,
  //   isRegistered: isRegistered,
  // });

  const handleUpdateUser = () => {
    setUserUpdateShown(true);
    console.log("click !!!");
  };

  return (
    <div className={styles.cont}>
      <ToastContainer position="top-center" autoClose={5000} />
      {userUpdateShown && (
        <UpdateUser theme={"light"} onClose={() => setUserUpdateShown(false)} />
      )}
      <div
        className={
          isLoggedIn ? styles.content : clsx(styles.content, styles.notLoggedIn)
        }
      >
        <Header handleHeaderClick={handleUpdateUser} />
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default SharedLayout;
