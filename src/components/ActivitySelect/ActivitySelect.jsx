import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";
import styles from "./ActivitySelect.module.css";

const activities = [
  "football",
  "tennis",
  "basketball",
  "gym",
  "fitness",
  "cycling",
  "running",
  "jogging",
  "swimming",
  "hockey",
  "rugby",
  "volley",
  "yoga",
  "walking",
  "dancing",
  "skiing",
  "snowboarding",
  "surfing",
  "boxing",
  "climbing",
  "other",
];

export default function ActivitySelect({ theme, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleSelect = (selectedActivity) => {
    onChange(selectedActivity);
    setIsOpen(false);
  };

  // închide dropdown dacă dai click în afară
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.selector} ref={dropdownRef}>
      <button className={styles.button} onClick={() => setIsOpen((p) => !p)}>
        <span
          className={clsx(
            styles.span,
            theme === "dark" || theme === "violet"
              ? styles.spanDark
              : styles.span
          )}
        >
          {value.charAt(0).toUpperCase() + value.slice(1)}
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

      {isOpen && (
        <ul
          className={clsx(
            styles.options,
            theme === "dark" ? styles.optionsDark : styles.options,
            theme === "violet" ? styles.optionsViolet : styles.options
          )}
        >
          {activities.map((option) => (
            <li
              key={option}
              className={clsx(
                styles.option,
                theme === "dark" ? styles.optionDark : styles.option,
                option === value &&
                  (theme === "violet"
                    ? styles.activeOptionViolet
                    : styles.activeOption)
              )}
              onClick={() => handleSelect(option)}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

ActivitySelect.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  theme: PropTypes.string,
};
