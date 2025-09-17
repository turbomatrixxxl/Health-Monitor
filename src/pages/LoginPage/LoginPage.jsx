import React, { useEffect } from "react";
import LoginForm from "../../components/LoginForm/LoginForm";

import { toast } from "react-toastify";

import styles from "./LoginPage.module.css";
import { useAuth } from "../../hooks/useAuth";
import { usePrivate } from "../../hooks/usePrivate";
import { useDispatch } from "react-redux";
import { resetPrivateFormError } from "../../redux/private/privateSlice";

export default function LoginPage() {
  const { isLoggedIn, user, errorAuth } = useAuth();
  const { error } = usePrivate();

  const dispatch = useDispatch();

  useEffect(() => {
    if (isLoggedIn || user?.verify) {
      toast.success("Login successful!");
    }
  }, [isLoggedIn, user?.verify]);

  useEffect(() => {
    if (error === "Not authorized") {
      setTimeout(() => {
        dispatch(resetPrivateFormError());
      }, 5000);
    }
    return () => {
      clearTimeout();
    };
  }, [dispatch, error]);

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Log In</h2>

      {(error === "Not authorized" || errorAuth) && (
        <div className={styles.errorMessage}>
          <p>
            For reasons of personal data security, your authorization has
            expired. If you want to continue, please log in again. Thank you for
            understanding!
          </p>
        </div>
      )}

      <LoginForm />
    </section>
  );
}
