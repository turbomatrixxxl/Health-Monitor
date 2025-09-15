import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import styles from "./AlertForm.module.css";

const daysOfWeek = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

const now = new Date();
const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
  2,
  "0"
)}-${String(now.getDate()).padStart(2, "0")}`;

export default function AlertForm({ onClose, handleSubmit, data, editId }) {
  const modalRef = useRef();

  const [freqType, setFreqType] = useState(() => {
    if (data.frequency === "daily") return "daily";
    if (
      typeof data.frequency === "string" &&
      data.frequency.includes("monthly")
    )
      return "monthly";
    if (
      typeof data.frequency === "string" &&
      /^\d{4}-\d{2}-\d{2}$/.test(data.frequency)
    )
      return "date";
    if (Array.isArray(data.frequency)) return "weekly";
    return "weekly";
  });

  const [localFrequency, setLocalFrequency] = useState(
    Array.isArray(data.frequency) ? [...data.frequency] : []
  );

  const [formData, setFormData] = useState({
    ...data,
    frequency: data.frequency,
  });

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
  }, [onClose]);

  useEffect(() => {
    if (Array.isArray(data.frequency)) setLocalFrequency([...data.frequency]);
  }, [data.frequency]);

  const handleSet = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleWeeklyChange = (day) => {
    let updated = localFrequency.includes(day)
      ? localFrequency.filter((d) => d !== day)
      : [...localFrequency, day];

    if (updated.length === 7) {
      setFreqType("daily");
      setLocalFrequency([]);
      handleSet("frequency", "daily");
    } else {
      setLocalFrequency(updated);
      handleSet("frequency", updated);
    }
  };

  const handleMonthlyChange = (day) => handleSet("frequency", `${day} monthly`);
  const handleDateChange = (dateStr) => handleSet("frequency", dateStr);
  const handleFormSubmit = (e) => {
    e.preventDefault();

    let frequencyValue;

    if (freqType === "daily") {
      frequencyValue = "daily";
    } else if (freqType === "weekly") {
      frequencyValue = localFrequency; // array cu zile
    } else if (freqType === "monthly") {
      frequencyValue = formData.frequency; // ex: "15 monthly"
    } else if (freqType === "date") {
      frequencyValue = filterDate; // ex: "2025-09-13"
    } else {
      frequencyValue = formData.frequency; // fallback
    }

    const submitData = {
      ...formData,
      frequency: frequencyValue,
    };

    handleSubmit(submitData);
  };

  const alertCondition =
    formData.type === "alert" || formData.type === "metrix";

  const closeOnClickOutside = (event) => {
    if (event.currentTarget === event.target) onClose();
  };

  return (
    <div
      ref={modalRef}
      onClick={closeOnClickOutside}
      className={styles.formModalCont}
    >
      <form className={styles.form} onSubmit={handleFormSubmit}>
        <button className={styles.close} onClick={onClose} type="button">
          x
        </button>

        {alertCondition && (
          <div className={styles.inputGroup}>
            <label>Reminder Text</label>
            <input
              type="text"
              placeholder="Enter reminder"
              value={formData.text}
              onChange={(e) => handleSet("text", e.target.value)}
              required
            />
          </div>
        )}

        <div className={styles.inputGroup}>
          <label>Time</label>
          <input
            type="time"
            value={formData.time}
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
                  if (e.target.value === "weekly") handleSet("frequency", []);
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
                      checked={localFrequency.includes(day)}
                      onChange={() => handleWeeklyChange(day)}
                    />
                    {day}
                  </label>
                ))}
                <button
                  type="button"
                  className={styles.smallBtn}
                  onClick={() => {
                    setFreqType("daily");
                    setLocalFrequency([]);
                    handleSet("frequency", "daily");
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
                  value={parseInt(formData.frequency) || ""}
                  onChange={(e) =>
                    handleMonthlyChange(parseInt(e.target.value))
                  }
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
                    /^\d{4}-\d{2}-\d{2}$/.test(formData.frequency)
                      ? formData.frequency
                      : filterDate
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
            value={
              formData.repeat === "noRepeat"
                ? ""
                : parseInt(formData.repeat) || ""
            }
            onChange={(e) => {
              const h = parseInt(e.target.value);
              if (isNaN(h) || h < 1) {
                handleSet("repeat", "noRepeat");
              } else {
                handleSet("repeat", h === 1 ? "1 hour" : `${h} hours`);
              }
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
  data: PropTypes.object.isRequired,
  editId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};
