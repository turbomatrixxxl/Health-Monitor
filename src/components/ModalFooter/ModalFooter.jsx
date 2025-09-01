import React, { useEffect, useRef } from "react";
import { useMediaQuery } from "react-responsive";
import ModalLogo from "../commonComponents/FooterLogo/FooterLogo";
import { FaGithub, FaPhoneAlt } from "react-icons/fa";
import FormButton from "../commonComponents/FormButton/FormButton";
import "animate.css";

// Corectarea importului imaginii
import Ionela from "../../images/Ionela.jpg";

import styles from "./ModalFooter.module.css";

const ModalFooter = ({ closeModal }) => {
  const modalRef = useRef();

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const addCloseEvent = (event) => {
      if (event.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", addCloseEvent);

    return () => {
      document.body.style.overflow = "auto";
      document.removeEventListener("keydown", addCloseEvent);
    };
  });

  const closeOnClickOutside = (event) => {
    if (event.currentTarget === event.target) {
      closeModal();
    }
  };

  const screenCondition = useMediaQuery({ query: "(min-width: 768px)" });

  const animation = "animate__animated animate__fadeInDown animate__slow";

  return (
    <div
      className={styles.modalFooter}
      onClick={closeOnClickOutside}
      ref={modalRef}
    >
      <div className={styles.modalBg}>
        <div className={styles.modalContent}>
          {screenCondition && <ModalLogo variant={"formLogo"} />}
          <h2>Fullstack Developer:</h2>

          <div className={styles.footerCards}>
            {/* Card pentru Ionela */}
            <div
              className={`${styles.footerTeamCard} ${animation} ${styles.Ionela}`}
            >
              <img
                src={Ionela} // Folosește variabila corectă pentru imagine
                alt="Ionela"
                className={styles.teamMemberImage}
              />
              <span className={styles.footerTeamName}>Bocoiu Ionela Maria</span>
              <em className={styles.footerTeamFunction}>Fullstack Developer</em>
              <div className={styles.socialLinks}>
                <a
                  href="https://github.com/BocoiuIonelaMaria"
                  className={styles.footerGithubIcon}
                  aria-label="GitHub profile"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <FaGithub />
                </a>
                <a
                  href="tel:+40745099526"
                  className={styles.footerPhoneIcon}
                  aria-label="Phone"
                >
                  <FaPhoneAlt />
                </a>
              </div>
            </div>
          </div>

          <FormButton
            type={"button"}
            text={"Thank You"}
            variant={"whiteButtton"}
            handlerFunction={() => closeModal()}
          />
        </div>
      </div>
    </div>
  );
};

export default ModalFooter;
