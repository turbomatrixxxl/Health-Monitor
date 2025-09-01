import React from "react";
import PropTypes from "prop-types";

import styles from "./Calculator.module.css";
import WeightLossForm from "../WeightLossForm/WeightLossForm";

export default function Calculator({ onSubmit }) {
  return (
    <div className={styles.cont}>
      <h2 className={styles.title}>
        Calculate your daily calorie intake right now
      </h2>

      <WeightLossForm onSubmit={onSubmit} />
    </div>
  );
}

Calculator.propTypes = {
  onSubmit: PropTypes.func.isRequired, // Ensure onSubmit is provided as a prop
};
