import { Link } from "react-router-dom";
import styles from "./FooterLogo.module.css";
import logoImage from "../../../images/logo-image.jpg";
import PropTypes from "prop-types";

const Logo = ({ variant = "default" }) => {
  return (
    <Link
      className={`${styles.logo} ${styles[variant] || styles.default}`}
      to="/"
    >
      <img src={logoImage} alt="Logo" />
      <span>Health-Monitor</span>
    </Link>
  );
};

Logo.propTypes = {
  variant: PropTypes.string,
};

export default Logo;
