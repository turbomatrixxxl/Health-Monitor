import React, { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";

import Modal from "../commonComponents/Modal/Modal";
import useToggle from "../../hooks/useToggle";

import UserLogout from "../UserLogout/UserLogout";
import UpdateUser from "../UpdateUser";
import Logo from "../Logo/Logo";

import { HiX } from "react-icons/hi";

import { NavLink } from "react-router-dom";
import styled from "styled-components";

import healthMonitorImage from "../../images/Health Monitor.jpg";

import styles from "./NavModal.module.css";

const StyledLink = styled(NavLink)`
  color: #9b9faa;
  text-align: center;
  font-family: Verdana;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  letter-spacing: 0.72px;
  text-transform: uppercase;
  text-decoration: none;

  &.active {
    color: blue;
    background: var(--brand-color);
  }
`;

const breakpoints = {
  mobile: "(max-width: 767px)",
  tablet: "(min-width:768px)",
  desktop: "(min-width:1024px)",
};

export default function NavModal() {
  const [isLogoutModalVisible, toggleIsLogoutModalVisible] = useToggle(false);
  const modalRef = useRef();

  const [userUpdateShown, setUserUpdateShown] = useState(false);

  useEffect(() => {
    // Disable scroll when modal is visible
    if (isLogoutModalVisible) {
      document.body.classList.add(styles.noScroll);
    } else {
      document.body.classList.remove(styles.noScroll);
    }

    const handleEscapeKey = (event) => {
      if (event.key === "Escape") toggleIsLogoutModalVisible();
    };

    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.body.classList.remove(styles.noScroll); // Ensure cleanup
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isLogoutModalVisible, toggleIsLogoutModalVisible]);

  const isMobile = useMediaQuery({ query: breakpoints.mobile });
  const isTablet = useMediaQuery({ query: breakpoints.tablet });
  const isDesktop = useMediaQuery({ query: breakpoints.desktop });

  const handleUpdateUser = () => {
    setUserUpdateShown(true);
    console.log("click !!!");
  };

  return (
    <>
      {userUpdateShown && (
        <UpdateUser theme={"light"} onClose={() => setUserUpdateShown(false)} />
      )}
      <button
        type="button"
        onClick={toggleIsLogoutModalVisible}
        className={styles.logoutBtn}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="12"
          viewBox="0 0 18 12"
          fill="none"
        >
          <path
            d="M0 12H18V10H0V12ZM0 7H18V5H0V7ZM0 0V2H18V0H0Z"
            fill="#212121"
          />
        </svg>
      </button>

      {isLogoutModalVisible && (
        <div ref={modalRef} className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <Modal
              modalContentClassName={styles.insideContent}
              closeButton={styles.closeButton}
              handleModalClose={toggleIsLogoutModalVisible}
              isModalVisible={isLogoutModalVisible}
            >
              <header className={styles.modalHeader}>
                <div className={styles.leftCont}>
                  <Logo className={styles.logoHeaderContainer} />
                  {isMobile && (
                    <img
                      className={styles.slimMom}
                      src={healthMonitorImage}
                      alt="Slim"
                    />
                  )}
                </div>
                <div className={styles.rightCont}>
                  {!isDesktop && isTablet && !isMobile && (
                    <UserLogout handleUpdateUserClick={handleUpdateUser} />
                  )}
                </div>
              </header>

              <nav className={styles.modalLogoutActionCenter}>
                <button
                  className={styles.modalCloseButton}
                  type="button"
                  onClick={toggleIsLogoutModalVisible}
                >
                  <HiX size="20px" />
                </button>
                <StyledLink
                  onClick={toggleIsLogoutModalVisible}
                  className={styles.link}
                  to={"/diary"}
                >
                  Food Diary
                </StyledLink>

                <StyledLink
                  onClick={toggleIsLogoutModalVisible}
                  className={styles.link}
                  to={"/calculator"}
                >
                  Diet Calculator
                </StyledLink>

                <StyledLink
                  onClick={toggleIsLogoutModalVisible}
                  className={styles.link}
                  to={"/daily"}
                >
                  Daily Progress
                </StyledLink>

                <StyledLink
                  onClick={toggleIsLogoutModalVisible}
                  className={styles.link}
                  to={"/sleep"}
                >
                  Sleep
                </StyledLink>

                <StyledLink
                  onClick={toggleIsLogoutModalVisible}
                  className={styles.link}
                  to={"/physical"}
                >
                  Psyhical Activity
                </StyledLink>

                <StyledLink
                  onClick={toggleIsLogoutModalVisible}
                  className={styles.link}
                  to={"/alerts"}
                >
                  Alerts
                </StyledLink>

                <StyledLink
                  onClick={toggleIsLogoutModalVisible}
                  className={styles.link}
                  to={"/metrix"}
                >
                  Health Metrics
                </StyledLink>

                <StyledLink
                  onClick={toggleIsLogoutModalVisible}
                  className={styles.link}
                  to={"/export"}
                >
                  Export & Reports
                </StyledLink>
              </nav>
            </Modal>
          </div>
        </div>
      )}
    </>
  );
}
