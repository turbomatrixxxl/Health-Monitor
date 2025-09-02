import React, { useState } from "react";
import styles from "./SleepPage.module.css";

export default function SleepPage() {
  const [filterDate, setFilterDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // o linie inițială
  const [lines, setLines] = useState([
    {
      fromHour: "00",
      fromMinute: "00",
      fromAmPm: "AM",
      tillHour: "00",
      tillMinute: "00",
      tillAmPm: "AM",
    },
  ]);

  // helper pt formatare 2 cifre
  const formatNumber = (num) => String(num).padStart(2, "0");

  // funcție pentru actualizarea unei valori într-o linie
  const updateLine = (index, field, value) => {
    let val = parseInt(value, 10);

    if (["fromHour", "tillHour"].includes(field)) {
      if (isNaN(val) || val < 0) val = 0;
      if (val > 11) val = 11;
      value = formatNumber(val);
    }

    if (["fromMinute", "tillMinute"].includes(field)) {
      if (isNaN(val) || val < 0) val = 0;
      if (val > 59) val = 59;
      //   // rotunjim la multiplu de 5
      //   val = Math.ceil(val / 5) * 5;
      value = formatNumber(val);
    }

    const newLines = [...lines];
    newLines[index][field] = value;
    setLines(newLines);
  };

  // adaugă o linie nouă
  const addLine = () => {
    setLines([
      ...lines,
      {
        fromHour: "00",
        fromMinute: "00",
        fromAmPm: "AM",
        tillHour: "00",
        tillMinute: "00",
        tillAmPm: "AM",
      },
    ]);
  };

  // șterge o linie după index
  const removeLine = (index) => {
    setLines(lines.filter((_, i) => i !== index));
  };

  return (
    <div className={styles.cont}>
      <div className={styles.leftSideCont}>
        <h1 className={styles.title}>Sleep</h1>
        <div className={styles.graphCont}>Graphic container</div>
      </div>

      <div className={styles.rightSideCont}>
        <p className={styles.rightSideContTitle}>Add sleep</p>

        {/* data */}
        <div className={styles.rightSideDate}>
          <div className={styles.dateWrapper}>
            <input
              type="date"
              value={filterDate ?? new Date().toISOString().split("T")[0]}
              onChange={(e) => setFilterDate(e.target.value)}
              className={styles.paramInput}
            />
          </div>
          <p className={styles.rightSideDateP}>Choose date</p>
        </div>

        {/* from - till lines */}
        <div className={styles.fromToCont}>
          <div className={styles.fromToTitle}>
            <p className={styles.from}>From</p>
            <p className={styles.rem}>Rem</p>
            <p className={styles.to}>Till</p>
          </div>

          <div className={styles.lineRowCont}>
            {lines.map((line, idx) => (
              <div key={idx} className={styles.lineRow}>
                {/* From */}
                <div className={styles.timeInputGroup}>
                  <input
                    type="number"
                    min="0"
                    max="11"
                    step="1"
                    value={line.fromHour}
                    onChange={(e) =>
                      updateLine(idx, "fromHour", e.target.value)
                    }
                    className={styles.timeInput}
                  />
                  <span className={styles.twoDots}>:</span>
                  <input
                    type="number"
                    min="0"
                    max="55"
                    step="1"
                    value={line.fromMinute}
                    onChange={(e) =>
                      updateLine(idx, "fromMinute", e.target.value)
                    }
                    className={styles.timeInput}
                  />
                  <select
                    value={line.fromAmPm}
                    onChange={(e) =>
                      updateLine(idx, "fromAmPm", e.target.value)
                    }
                    className={styles.ampmSelect}
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
                {/* buton remove */}
                {lines.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => removeLine(idx)}
                    className={styles.removeBtn}
                  >
                    ✕
                  </button>
                ) : (
                  <span className={styles.dash}>–</span>
                )}
                {/* Till */}
                <div className={styles.timeInputGroup}>
                  <input
                    type="number"
                    min="0"
                    max="11"
                    step="1"
                    value={line.tillHour}
                    onChange={(e) =>
                      updateLine(idx, "tillHour", e.target.value)
                    }
                    className={styles.timeInput}
                  />
                  <span className={styles.twoDots}>:</span>
                  <input
                    type="number"
                    min="0"
                    max="55"
                    step="1"
                    value={line.tillMinute}
                    onChange={(e) =>
                      updateLine(idx, "tillMinute", e.target.value)
                    }
                    className={styles.timeInput}
                  />
                  <select
                    value={line.tillAmPm}
                    onChange={(e) =>
                      updateLine(idx, "tillAmPm", e.target.value)
                    }
                    className={styles.ampmSelect}
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* add line */}
        <div className={styles.addSleepCont}>
          <p>Add period</p>
          <button onClick={addLine} type="button" className={styles.addBtn}>
            Add +
          </button>
        </div>

        <div className={styles.adviceCont}>
          <h2 className={styles.adviceTitle}>Suggestions</h2>
          <p className={styles.advicep}>
            Try to get at least 7 hours of sleep .
          </p>
        </div>
      </div>
    </div>
  );
}
