import React, { useEffect, useState } from "react";

import { usePrivate } from "../../hooks/usePrivate";
import { setTotalStepsForToday } from "../../redux/private/privateSlice";

import convertActivityToSteps from "../../Utils/convertActivityToSteps";
import calculateMinimumDailyActivity from "../../Utils/calculateMinimumDailyActivity";

import clsx from "clsx";

import ActivitySelect from "../../components/ActivitySelect";

import styles from "./PsyhicalActivityPage.module.css";

export default function PsyhicalActivityPage() {
  const { user, privateDispatch } = usePrivate();
  // console.log("user psyhical :", user);

  const age = user?.age ?? 0;
  const height = user?.height ?? 0;
  const weight = user?.weight ?? 0;
  const desiredWeight = user?.desiredWeight ?? 0;

  const today = new Date().toISOString().split("T")[0];

  const [filterDate, setFilterDate] = useState(today);

  // o linie inițială
  const [lines, setLines] = useState([
    {
      exerciseType: "walking",
      date: filterDate,
      minutes: "00",
      intensity: "min",
      steps: 0,
    },
  ]);

  const totalSteps = lines.map((line) => line.steps).reduce((a, b) => a + b, 0);
  console.log("totalSteps :", totalSteps);

  useEffect(() => {
    privateDispatch(setTotalStepsForToday(totalSteps));
  }, [privateDispatch, totalSteps]);

  const minDailyActivity = calculateMinimumDailyActivity(
    age,
    height,
    weight,
    desiredWeight
  );

  // funcție pentru actualizarea unei valori într-o linie
  const updateLine = (index, field, value) => {
    const newLines = [...lines];

    newLines[index][field] = value;
    newLines[index].steps = convertActivityToSteps(
      newLines[index].exerciseType,
      newLines[index].minutes,
      age,
      weight,
      height,
      newLines[index].intensity
    );

    setLines(newLines);
  };

  // adaugă o linie nouă
  const addLine = () => {
    setLines([
      ...lines,
      {
        exerciseType: "walking",
        date: filterDate,
        minutes: "00",
        intensity: "min",
        steps: 0,
      },
    ]);
  };

  // șterge o linie după index
  const removeLine = (index) => {
    setLines(lines.filter((_, i) => i !== index));
  };

  const resetLines = () => {
    setLines([
      {
        exerciseType: "walking",
        date: filterDate,
        minutes: "00",
        intensity: "min",
        steps: 0,
      },
    ]);
  };

  const formatNumber = (num) => String(num);

  return (
    <div className={styles.cont}>
      <div className={styles.leftSideCont}>
        <h1 className={styles.title}>Physical Activity</h1>
        <div className={styles.graphCont}>Graphic container</div>
      </div>

      <div className={styles.rightSideCont}>
        <h1 className={styles.title}>Add exercise activities</h1>

        {/* data */}
        <div className={styles.rightSideDate}>
          <div className={styles.dateWrapper}>
            <input
              max={today}
              type="date"
              value={filterDate ?? today}
              onChange={(e) => setFilterDate(e.target.value)}
              className={styles.paramInput}
            />
          </div>
          <p className={styles.rightSideDateP}>Choose date</p>
        </div>

        <div className={styles.fromToCont}>
          <div className={styles.fromToTitle}>
            <p className={styles.fromExercise}>Exercise Type</p>
            <p className={styles.from}>Minutes</p>
            <p className={styles.from}>Intensity</p>

            <p className={styles.rem}>
              {lines.length > 1 ? "Delete" : "Reset"}
            </p>
          </div>

          <div className={styles.lineRowCont}>
            {lines.map((line, idx) => (
              <div key={`physical-${idx}`} className={styles.lineRow}>
                <ActivitySelect
                  value={line.exerciseType}
                  onChange={(val) => updateLine(idx, "exerciseType", val)}
                  theme="light"
                />

                <div className={styles.minutes}>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={formatNumber(line?.minutes)}
                    onChange={(e) => updateLine(idx, "minutes", e.target.value)}
                    className={clsx(styles.timeInput)}
                  />
                </div>
                <div className={styles.minMax}>
                  <select
                    style={
                      line?.intensity === "min"
                        ? { color: "green", fontWeight: "bold" }
                        : { color: "var(--brand-color)", fontWeight: "bold" }
                    }
                    value={line?.intensity}
                    onChange={(e) =>
                      updateLine(idx, "intensity", e.target.value)
                    }
                    className={styles.ampmSelect}
                  >
                    <option
                      style={{ color: "green", fontWeight: "bold" }}
                      value="min"
                    >
                      Min
                    </option>
                    <option
                      style={{
                        color: "var(--brand-color)",
                        fontWeight: "bold",
                      }}
                      value="max"
                    >
                      Max
                    </option>
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
                  <button
                    type="button"
                    onClick={() => resetLines()}
                    className={styles.removeBtn}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* add line */}
        <div className={styles.addSleepCont}>
          <p>Add exercise</p>
          <button onClick={addLine} type="button" className={styles.addBtn}>
            Add +
          </button>
        </div>

        <div className={styles.adviceCont}>
          <h2 className={styles.adviceTitle}>Suggestions</h2>
          {minDailyActivity !== 0 ? (
            <p className={styles.advicep}>
              Try to get at least {minDailyActivity} minutes of activity
              everyday.
            </p>
          ) : (
            <p
              style={{ color: "red", lineHeight: "inherit" }}
              className={styles.advicep}
            >
              It seems that you did not set up your personal info. Please check
              Diet Calculator page to set things right !
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
