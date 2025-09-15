import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

import clsx from "clsx";

import { HiChevronDown, HiChevronUp } from "react-icons/hi";

import styles from "./HeartMetrixDateSelector.module.css";

export default function HeartMetrixDateSelector({ theme, dates, onSelect }) {
  const reversedDates = [...dates].sort((a, b) => new Date(b) - new Date(a));

  const [dateA, setDateA] = useState(
    reversedDates.length > 0 ? reversedDates[0] : "No records yet."
  );
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    if (reversedDates.length > 0) {
      setDateA(reversedDates[0]);
    }
  }, [dates, reversedDates]);

  const handleSelect = (selectedDate) => {
    setDateA(selectedDate);
    onSelect(selectedDate);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.selector} ref={dropdownRef}>
      <button
        className={styles.button}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span
          className={clsx(
            styles.span,
            theme === "dark" || theme === "violet"
              ? styles.spanDark
              : styles.span
          )}
        >
          {dateA}
        </span>
        {!isOpen ? (
          <HiChevronDown
            className={clsx(
              styles.svg,
              theme === "dark" || theme === "violet"
                ? styles.svgDark
                : styles.svg
            )}
          />
        ) : (
          <HiChevronUp
            className={clsx(
              styles.svg,
              theme === "dark" || theme === "violet"
                ? styles.svgDark
                : styles.svg
            )}
          />
        )}
      </button>

      {/* Dropdown options */}
      {isOpen && (
        <ul
          className={clsx(
            styles.options,
            theme === "dark" ? styles.optionsDark : styles.options,
            theme === "violet" ? styles.optionsViolet : styles.options
          )}
        >
          {[...reversedDates].map((option) => (
            <li
              key={`date-${option}`}
              className={clsx(
                styles.option,
                theme === "dark" ? styles.optionDark : styles.option,
                option === dateA &&
                  (theme === "violet"
                    ? styles.activeOptionViolet
                    : styles.activeOption)
              )}
              onClick={() => handleSelect(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

HeartMetrixDateSelector.propTypes = {
  dates: PropTypes.arrayOf(PropTypes.string).isRequired,
  theme: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
};
