import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { usePrivate } from "../../hooks/usePrivate";
import { setTotalStepsForToday } from "../../redux/private/privateSlice";
import { setTotalSteps } from "../../redux/private/operationsPrivate";

import convertActivityToSteps from "../../Utils/convertActivityToSteps";
import calculateMinimumDailyActivity from "../../Utils/calculateMinimumDailyActivity";
import formatDate from "../../Utils/formatDate";

import clsx from "clsx";

import ActivitySelect from "../../components/ActivitySelect";

import styles from "./PsyhicalActivityPage.module.css";
import getRegistrationsForAWeek from "../../Utils/getRegistrationsForAWeek";
import calculateDailySteps from "../../Utils/calculateDailySteps";
import WeeklyChart from "../../components/WeeklyChart";

export default function PsyhicalActivityPage() {
  const navigate = useNavigate();

  const { user, privateDispatch } = usePrivate();
  // console.log("user psyhical :", user);

  const age = user?.age ?? 0;
  const height = user?.height ?? 0;
  const weight = user?.weight ?? 0;
  const desiredWeight = user?.desiredWeight ?? 0;

  const steps = useMemo(() => user?.steps || [], [user?.steps]);

  const minDailyActivitySteps = calculateMinimumDailyActivity(
    age,
    height,
    weight,
    desiredWeight
  );

  const [filterDate, setFilterDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  // console.log("filterDate :", filterDate);

  const now = useMemo(() => new Date(), []);
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(now.getDate()).padStart(2, "0")}`;

  const isTodaycondition = filterDate === today;
  // console.log("isTodaycondition :", isTodaycondition);

  const lines = useMemo(
    () =>
      steps.length > 0
        ? [...steps]
        : [
            {
              date: now,
              interval: [
                {
                  exerciseType: "walking",
                  minutes: "00",
                  intensity: "min",
                  steps: 0,
                },
              ],
            },
          ],
    [steps, now]
  );

  const filteredSteps = steps.find(
    (step) => new Date(step.date).toISOString().split("T")[0] === filterDate
  );

  const [interval, setInterval] = useState([
    {
      date: now,
      interval: [
        {
          exerciseType: "walking",
          minutes: "00",
          intensity: "min",
          steps: 0,
        },
      ],
    },
  ]);
  // console.log("interval :", interval);

  useEffect(() => {
    if (filteredSteps) {
      const sortedIntervals = [...filteredSteps.interval];
      setInterval(sortedIntervals);
    }
  }, [filteredSteps]);

  useEffect(() => {
    const dayExercises = lines.find(
      (line) => new Date(line.date).toISOString().split("T")[0] === filterDate
    );

    if (dayExercises) {
      const sortedIntervals = [...dayExercises.interval];
      setInterval(sortedIntervals);
    } else {
      setInterval([
        {
          exerciseType: "walking",
          minutes: "00",
          intensity: "min",
          steps: 0,
        },
      ]);
    }
  }, [filterDate, lines, now, steps]);

  const totalSteps = interval.reduce((acc, int) => {
    const stepsVal = Number(int.steps) || 0;
    return acc + stepsVal;
  }, 0);

  // console.log("totalSteps :", totalSteps);

  useEffect(() => {
    privateDispatch(setTotalStepsForToday(totalSteps));
  }, [privateDispatch, totalSteps]);

  const lastInterval = interval[interval.length - 1];

  const emptyLineCondition = (line) =>
    Number(String(line.minutes).trim()) === 0;

  const emptyLastIntervalLineCondition = emptyLineCondition(lastInterval);

  const updateFilteredLineInterval = (intervalIdx, field, value) => {
    const newInterval = interval.map((int, idx) =>
      idx === intervalIdx
        ? {
            ...int,
            [field]: value,
            steps: convertActivityToSteps(
              field === "exerciseType" ? value : int.exerciseType,
              field === "minutes"
                ? Math.max(0, parseInt(value, 10) || 0)
                : parseInt(int.minutes, 10) || 0,
              age,
              weight,
              height,
              field === "intensity" ? value : int.intensity
            ),
          }
        : { ...int }
    );

    setInterval(newInterval);
  };

  const addFilteredLineNewInterval = () => {
    const newInterval = [...interval] || [];
    newInterval.push({
      exerciseType: "walking",
      minutes: "00",
      intensity: "min",
      steps: 0,
    });
    setInterval(newInterval);
  };

  const removeFilteredLineInterval = (index) => {
    const newInterval = interval.filter((_, i) => i !== index);
    setInterval(newInterval);
  };

  const resetFilteredLinesInterval = () => {
    setInterval([
      {
        exerciseType: "walking",
        date: filterDate,
        minutes: "00",
        intensity: "min",
        steps: 0,
      },
    ]);
  };

  const formatNumber = (num) => String(num).replace(/^0+(?=\d)/, "");

  function handleSave() {
    const lastIntervalIndex = interval.length - 1;
    const intervalToSave = emptyLastIntervalLineCondition
      ? interval.filter((_, index) => index !== lastIntervalIndex)
      : [...interval];

    // console.log("intervalToSave :", intervalToSave);

    privateDispatch(
      setTotalSteps({ date: filterDate, interval: intervalToSave })
    );
  }

  const weeklySteps = getRegistrationsForAWeek(steps, "steps");
  const neededSteps = calculateDailySteps(age, weight, desiredWeight, height);

  return (
    <div className={styles.cont}>
      <div className={styles.leftSideCont}>
        <div className={styles.rightSideUpCont}>
          <h1 className={styles.title}>Physical Activity</h1>
          <div className={styles.graphCont}>
            {" "}
            <WeeklyChart
              target={neededSteps}
              weeklyData={weeklySteps}
              type={"steps"}
            />
          </div>
        </div>
        <div className={styles.adviceCont}>
          <h2 className={styles.adviceTitle}>
            Total converted Exercises in steps
          </h2>
          {totalSteps !== 0 ? (
            <p
              style={{
                fontSize: "clamp(11px, 1.5vw, 12px)",
                color: totalSteps < totalSteps * 0.6 ? "red" : undefined,
              }}
              className={styles.advicep}
            >
              <span style={{ marginRight: "2px" }}>
                Total Steps for{" "}
                {isTodaycondition ? "today" : formatDate(filterDate)}:{" "}
              </span>{" "}
              <span>{totalSteps} steps</span>
            </p>
          ) : (
            <p style={{ color: "red" }} className={styles.advicep}>
              No Physical Activities records for{" "}
              {isTodaycondition ? "today" : formatDate(filterDate)}
            </p>
          )}
        </div>
      </div>

      <div className={styles.rightSideCont}>
        <div className={styles.rightSideUpCont}>
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
                {interval.length > 1 ? "Delete" : "Reset"}
              </p>
            </div>
            <div className={styles.lineRowCont}>
              {interval.map((line, idx) => (
                <div key={`physical-${idx}`} className={styles.lineRow}>
                  <ActivitySelect
                    value={line?.exerciseType ?? "walking"}
                    onChange={(val) =>
                      updateFilteredLineInterval(idx, "exerciseType", val)
                    }
                    theme="light"
                  />
                  <div className={styles.minutes}>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={formatNumber(line?.minutes)}
                      onChange={(e) =>
                        updateFilteredLineInterval(
                          idx,
                          "minutes",
                          e.target.value.replace(/^0+(?=\d)/, "") || "0" // eliminăm 0 la început
                        )
                      }
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
                        updateFilteredLineInterval(
                          idx,
                          "intensity",
                          e.target.value
                        )
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
                  {interval.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => removeFilteredLineInterval(idx)}
                      className={styles.removeBtn}
                    >
                      ✕
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => resetFilteredLinesInterval()}
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
            <button
              onClick={() => {
                !emptyLastIntervalLineCondition && addFilteredLineNewInterval();
              }}
              type="button"
              className={styles.addBtn}
            >
              Add +
            </button>
            {((interval.length === 1 && !emptyLastIntervalLineCondition) ||
              interval.length > 1) && (
              <button
                onClick={handleSave}
                type="button"
                className={styles.saveBtn}
              >
                Save
              </button>
            )}
          </div>
        </div>

        <div className={styles.adviceCont}>
          <h2 className={styles.adviceTitle}>Suggestions</h2>
          {minDailyActivitySteps !== 0 ? (
            <p className={styles.advicep}>
              Try to get at least {minDailyActivitySteps} minutes of activity
              everyday.
            </p>
          ) : (
            <p
              style={{
                color: "red",
                background: "var(--Gray5)",
                textAlign: "left",
                flexWrap: "wrap",
                gap: "3px",
                justifyContent: "flex-start",
                height: "fit-content",
              }}
              className={styles.advicep}
            >
              Personal info missing. Please click
              <button
                className={styles.navBtn}
                onClick={() => navigate("/")}
                type="button"
              >
                Diet Calculator
              </button>{" "}
              to update !
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
