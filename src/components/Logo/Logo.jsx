import React from "react";
import { Link } from "react-router-dom";

import DesktopLogo from "./DesktopLogo/DesktopLogo";

import healthMonitorImage from "../../images/Health Monitor.jpg";

import styles from "./Logo.module.css";

export default function Logo() {
  return (
    <Link to={"/"} className={styles.container}>
      <DesktopLogo />
      <img
        className={styles.slimMom}
        src={healthMonitorImage}
        alt="Slim"
      />{" "}
    </Link>
  );
}
