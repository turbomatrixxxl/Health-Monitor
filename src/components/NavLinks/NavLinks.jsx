import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./NavLinks.module.css";

export default function NavLinks() {
  const location = useLocation();
  const navigate = useNavigate();

  const links = [
    { path: "/calculator", label: "Diet Calculator" },
    { path: "/daily", label: "Daily Progress" },
    { path: "/diary", label: "Food Diary" },
    { path: "/sleep", label: "Sleep" },
    { path: "/physical", label: "Physical Activity" },
    { path: "/metrix", label: "Health Metrics" },
    { path: "/alerts", label: "Reminders" },
    { path: "/export", label: "Export & Reports" },
  ];

  const handleChange = (e) => {
    navigate(e.target.value);
  };

  const currentPath =
    location.pathname === "/" ? "/calculator" : location.pathname;

  return (
    <div className={styles.container}>
      <span>|</span>
      <select
        className={styles.dropdown}
        value={currentPath}
        onChange={handleChange}
      >
        {links.map((link) => (
          <option key={link.path} value={link.path}>
            {link.label}
          </option>
        ))}
      </select>
    </div>
  );
}
