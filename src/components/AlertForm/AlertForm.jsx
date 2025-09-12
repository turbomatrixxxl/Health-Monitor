import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import styles from "./AlertForm.module.css";

const daysOfWeek = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

const now = new Date();
const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
  2,
  "0"
)}-${String(now.getDate()).padStart(2, "0")}`;

export default function AlertForm({
  onClose,
  handleSubmit,
  data,
  handleSet,
  editId,
}) {
  const modalRef = useRef();

  const [filterDate, setFilterDate] = useState(today);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const addCloseEvent = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", addCloseEvent);

    return () => {
      document.body.style.overflow = "auto";
      document.removeEventListener("keydown", addCloseEvent);
    };
  });

  const closeOnClickOutside = (event) => {
    if (event.currentTarget === event.target) {
      onClose();
    }
  };

  const [freqType, setFreqType] = useState(
    data.frequency === "daily"
      ? "daily"
      : data.frequency.includes("monthly")
      ? "monthly"
      : data.frequency.match(/^\d{4}-\d{2}-\d{2}$/)
      ? "date"
      : "weekly"
  );

  const handleWeeklyChange = (day) => {
    let selected = data.frequency === "daily" ? [] : data.frequency.split(",");
    selected.includes(day)
      ? (selected = selected.filter((d) => d !== day))
      : selected.push(day);
    if (selected.length === 7) {
      handleSet("frequency", "daily");
      setFreqType("daily");
    } else handleSet("frequency", selected.join(","));
  };

  const handleMonthlyChange = (day) => handleSet("frequency", `${day} monthly`);
  const handleDateChange = (dateStr) => handleSet("frequency", dateStr);

  const alertCondition = data.type === "alert";

  return (
    <div
      ref={modalRef}
      onClick={closeOnClickOutside}
      className={styles.formModalCont}
    >
      <form className={styles.form} onSubmit={handleSubmit}>
        <button className={styles.close} onClick={onClose} type="button">
          x
        </button>
        {alertCondition && (
          <div className={styles.inputGroup}>
            <label>Reminder Text</label>
            <input
              type="text"
              placeholder="Enter reminder"
              value={data.text}
              onChange={(e) => handleSet("text", e.target.value)}
              required
            />
          </div>
        )}
        <div className={styles.inputGroup}>
          <label>Time</label>
          <input
            type="time"
            value={data.time}
            onChange={(e) => handleSet("time", e.target.value)}
            required
          />
        </div>
        {alertCondition && (
          <>
            <div className={styles.inputGroup}>
              <label>Frequency</label>
              <select
                value={freqType}
                onChange={(e) => {
                  setFreqType(e.target.value);
                  if (e.target.value === "daily")
                    handleSet("frequency", "daily");
                }}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly (choose days)</option>
                <option value="monthly">Monthly (choose day)</option>
                <option value="date">Specific Date</option>
              </select>
            </div>
            {freqType === "weekly" && (
              <div className={styles.weekly}>
                {daysOfWeek.map((day) => (
                  <label key={day} className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={
                        data.frequency === "daily" ||
                        data.frequency.split(",").includes(day)
                      }
                      onChange={() => handleWeeklyChange(day)}
                    />
                    {day}
                  </label>
                ))}
                <button
                  type="button"
                  className={styles.smallBtn}
                  onClick={() => {
                    handleSet("frequency", "daily");
                    setFreqType("daily");
                  }}
                >
                  All
                </button>
              </div>
            )}
            {freqType === "monthly" && (
              <div className={styles.inputGroup}>
                <label>Day of Month</label>
                <input
                  type="number"
                  min={1}
                  max={31}
                  step={1}
                  value={parseInt(data.frequency) || 1}
                  onChange={(e) => handleMonthlyChange(e.target.value)}
                />
              </div>
            )}
            {freqType === "date" && (
              <div className={styles.inputGroup}>
                <label>Specific Date</label>
                <input
                  style={{ color: "blue", fontWeight: "bold" }}
                  type="date"
                  min={today}
                  value={
                    /^\d{4}-\d{2}-\d{2}$/.test(data.frequency)
                      ? data.frequency
                      : today
                  }
                  onChange={(e) => {
                    handleDateChange(e.target.value);
                    setFilterDate(e.target.value);
                  }}
                />
              </div>
            )}
          </>
        )}
        <div className={styles.inputGroup}>
          <label>Repeat Interval (hours)</label>
          <input
            type="number"
            min={1}
            max={12}
            step={1}
            value={parseInt(data.repeat) || ""}
            onChange={(e) => {
              const h = parseInt(e.target.value);
              handleSet("repeat", h === 1 ? "1 hour" : `${h} hours`);
            }}
            placeholder="No Repeat"
          />
        </div>
        <div className={styles.buttonGroup}>
          <button type="submit" className={styles.saveBtn}>
            {editId ? "Update Reminder" : "Add Reminder"}
          </button>
          <button type="button" onClick={onClose} className={styles.cancelBtn}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

AlertForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleSet: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  editId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};
