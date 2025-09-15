import React, { useEffect, useRef } from "react";
import { useMediaQuery } from "react-responsive";

import { Link } from "react-router-dom";
import Calculator from "../../components/Calculator/Calculator";
import { useDispatch } from "react-redux";

import {
  fetchPrivateCalculationData,
  fetchConsumedProductsForSpecificDay,
} from "../../redux/private/operationsPrivate";
import { resetPrivateForm } from "../../redux/private/privateSlice";
import { usePrivate } from "../../hooks/usePrivate";

// import { useAuth } from "../../hooks/useAuth";
// import { logOut } from "../../redux/auth/operationsAuth";

import useToggle from "../../hooks/useToggle";

import NavLinks from "../../components/NavLinks/NavLinks";

import getFormattedDate from "../../Utils/getFormattedDate";

import Logo from "../../components/Logo/Logo";
import LoginStatistics from "../../components/LoginStatistics/LoginStatistics";
import Button from "../../components/commonComponents/Button";
import Modal from "../../components/commonComponents/Modal/Modal";
import Loader from "../../components/commonComponents/Loader";

import { HiX } from "react-icons/hi";

import styles from "./CalculatorPage.module.css";

const breakpoints = {
  mobile: "(max-width: 767px)",
  tablet: "(min-width:768px)",
  desktop: "(min-width:1024px)",
};

export default function CalculatorPage() {
  // const location = useLocation();
  const dispatch = useDispatch();

  const [isCalculatorModalVisible, toggleIsCalculatorModalVisible] =
    useToggle(false);
  const modalRef = useRef();

  const { privateDispatch, user, privateLoading } = usePrivate();

  // console.log("user :", user);

  const isDesktop = useMediaQuery({ query: breakpoints.desktop });

  const today = getFormattedDate();

  useEffect(() => {
    if (isCalculatorModalVisible) {
      document.body.classList.add(styles.noScroll);
    } else {
      document.body.classList.remove(styles.noScroll);
    }

    const handleEscapeKey = (event) => {
      if (event.key === "Escape") toggleIsCalculatorModalVisible();
    };

    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.body.classList.remove(styles.noScroll);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isCalculatorModalVisible, toggleIsCalculatorModalVisible]);

  const closeOnClickOutside = (event) => {
    if (event.target !== event.currentTarget) {
      toggleIsCalculatorModalVisible();
    }
  };

  useEffect(() => {
    const today = getFormattedDate();
    // console.log("Fetching data for date:", today);

    privateDispatch(fetchConsumedProductsForSpecificDay({ date: today })); // Pass as an object
  }, [privateDispatch]);

  const handleClick = () => {
    privateDispatch(fetchConsumedProductsForSpecificDay({ date: today })); // Pass as an object
  };

  // console.log(getFormattedDate());

  // Function to handle form submission
  const handleSubmit = (formData) => {
    privateDispatch(fetchPrivateCalculationData(formData));
  };

  function formatToDisplayDate(date) {
    const [year, month, day] = date.split("-");
    return `${day}.${month}.${year}`;
  }

  function handleProductsForSelectedDate(date) {
    setTimeout(() => {
      privateDispatch(fetchConsumedProductsForSpecificDay({ date: date }));
    }, 1000); // Delay of 1000ms
  }

  const isMobile = useMediaQuery({ query: breakpoints.mobile });

  // // Redirect to CalculatorPage if `/home` is accessed
  // if (location.pathname === "/home") {
  //   return <Navigate to="/home/calculator" />;
  // }

  return (
    <section className={styles.section}>
      {isCalculatorModalVisible && (
        <div
          ref={modalRef}
          className={styles.modalOverlay}
          onClick={closeOnClickOutside}
        >
          <div className={styles.modalContent}>
            <Modal
              closeButton={styles.closeButton}
              handleModalClose={toggleIsCalculatorModalVisible}
              isModalVisible={isCalculatorModalVisible}
            >
              {isMobile && (
                <div className={styles.mobileHeaderCont}>
                  <header className={styles.modalHeader}>
                    <Logo className={styles.logoHeaderContainer} />
                  </header>
                  <div className={styles.mobileSubHeaderCont}>
                    <button
                      onClick={toggleIsCalculatorModalVisible}
                      className={styles.mobileHeaderExitButton}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="15"
                        height="9"
                        viewBox="0 0 15 9"
                        fill="none"
                      >
                        <path
                          d="M14 1.5V4.5H2M2 4.5L5.5 1M2 4.5L5.5 8"
                          stroke="black"
                          strokeWidth="2"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
              <div className={styles.modalLogoutActionCenter}>
                <button
                  className={styles.closeModal}
                  id="closeModal"
                  onClick={toggleIsCalculatorModalVisible}
                >
                  <HiX size="16px" />
                </button>
                {!user && isMobile && <Loader />}
                {user ? (
                  <>
                    <h2>Your recommended daily calorie intake is</h2>
                    <p className={styles.calories}>
                      {user?.dietaryInfo?.dailyCalorieIntake || "N/A"}
                      <span>kcal</span>
                    </p>
                    <div className={styles.line}></div>
                    <p className={styles.notEat}>Foods you should not eat</p>
                    <ol className={styles.list}>
                      {user?.dietaryInfo?.restrictedAliments?.length > 0 ? (
                        user?.dietaryInfo?.restrictedAliments?.map((item) => (
                          <li key={item._id}>{item.title}</li>
                        ))
                      ) : (
                        <p className={styles.empty}>No foods listed</p>
                      )}
                    </ol>
                    <Link className={styles.link} to="/">
                      <Button
                        handleClick={() => {
                          toggleIsCalculatorModalVisible();
                          dispatch(resetPrivateForm);
                        }}
                        type="button"
                        variant="colored"
                      >
                        Start losing weight
                      </Button>
                    </Link>
                  </>
                ) : (
                  privateLoading && <p className={styles.empty}>Loading...</p>
                )}
              </div>
            </Modal>
          </div>
        </div>
      )}

      <div className={styles.calculatorCont}>
        {isDesktop && (
          <div className={styles.leftCont}>
            <Logo />
            <NavLinks />
          </div>
        )}
        <Calculator
          onSubmit={(formData) => {
            handleSubmit(formData);
            handleProductsForSelectedDate(today);
            handleClick();
            toggleIsCalculatorModalVisible();
          }}
        />
      </div>
      <LoginStatistics day={formatToDisplayDate(today)} />
    </section>
  );
}
