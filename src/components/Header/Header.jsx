import React from "react";
import PropTypes from "prop-types";

import { useMediaQuery } from "react-responsive";

import Logo from "../Logo/Logo";
import AuthLinks from "../AuthLinks/AuthLinks";
import NavLinks from "../NavLinks/NavLinks";

import { useAuth } from "../../hooks/useAuth";
import clsx from "clsx";

import UserLogout from "../UserLogout/UserLogout";
import NavModal from "../NavModal/NavModal";

import healthMonitorImage from "../../images/Health Monitor.jpg";

import styles from "./Header.module.css";
import { useLocation } from "react-router-dom";

const breakpoints = {
  mobile: "(max-width: 767px)",
  tablet: "(min-width:768px)",
  desktop: "(min-width:1024px)",
};

function Header({ handleHeaderClick }) {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  // console.log("location :", location);

  const isMobile = useMediaQuery({ query: breakpoints.mobile });
  const isTablet = useMediaQuery({ query: breakpoints.tablet });
  const isDesktop = useMediaQuery({ query: breakpoints.desktop });

  return (
    <>
      <header
        className={clsx(
          styles.header,
          isLoggedIn &&
            (location.pathname === "/" ||
              location.pathname === "/diary" ||
              location.pathname === "/calculator")
            ? styles.loggedHeader
            : styles.otherHeader
        )}
      >
        <div
          className={clsx(styles.leftCont, !isLoggedIn && styles.loggedLeft)}
        >
          <Logo />
          {isLoggedIn && isMobile && (
            <img
              className={styles.slimMom}
              src={healthMonitorImage}
              alt="Monitor logo"
            />
          )}
          {!isLoggedIn && <AuthLinks />}
          {isDesktop && isLoggedIn && <NavLinks />}
        </div>
        <div className={styles.rightCont}>
          {!isMobile && !isDesktop && (
            <UserLogout handleUpdateUserClick={handleHeaderClick} />
          )}
          {(isMobile || isTablet) && !isDesktop && isLoggedIn && <NavModal />}
        </div>
        {isLoggedIn && isDesktop && (
          <div
            className={clsx(
              styles.rightDesktopCont,
              (location.pathname !== "/" ||
                location.pathname !== "/diary" ||
                location.pathname !== "/calculator") &&
                styles.rightOtherPages
            )}
          >
            <UserLogout handleUpdateUserClick={handleHeaderClick} />
          </div>
        )}
      </header>
      {isMobile && <UserLogout handleUpdateUserClick={handleHeaderClick} />}
    </>
  );
}

Header.propTypes = {
  handleHeaderClick: PropTypes.func,
};

export default Header;
