import React from "react";
import PropTypes from "prop-types";

import { useAuth } from "../../hooks/useAuth";

import WeightLossForm from "../WeightLossForm/WeightLossForm";

import styles from "./Calculator.module.css";

export default function Calculator({ onSubmit }) {
  const { isLoggedIn } = useAuth();

  return (
    <div className={styles.cont}>
      <h2 className={styles.title}>
        {isLoggedIn
          ? "First, enter your personal data to unlock full functionality and calculate your daily calorie needs."
          : "Calculate your daily calorie intake right now"}
      </h2>
      <p className={styles.warn}>
        Please fill <b>All</b> fields*
      </p>

      <WeightLossForm onSubmit={onSubmit} />
    </div>
  );
}

Calculator.propTypes = {
  onSubmit: PropTypes.func.isRequired, // Ensure onSubmit is provided as a prop
};
