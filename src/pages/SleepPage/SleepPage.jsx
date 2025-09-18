import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

import calculateSleepHours from "../../Utils/calculateSleepHours";
import calculateIntervalSleeptHours from "../../Utils/calculateIntervalSleeptHours";
import formatDate from "../../Utils/formatDate";
import getRegistrationsForAWeek from "../../Utils/getRegistrationsForAWeek";

import { usePrivate } from "../../hooks/usePrivate";
import { setSleepDailyRegistrations } from "../../redux/private/operationsPrivate";

import WeeklyChart from "../../components/WeeklyChart";

import styles from "./SleepPage.module.css";

export default function SleepPage() {
  const navigate = useNavigate();

  const { user, privateDispatch } = usePrivate();

  const userConditions =
    user?.age !== 0 &&
    user?.height !== 0 &&
    user?.weight !== 0 &&
    user?.desiredWeight !== 0;

  const age = user?.age ?? 0;

  const sleep = useMemo(() => user?.sleep || [], [user?.sleep]);

  const sleepHours = userConditions ? calculateSleepHours(age) : 0;

  const [filterDate, setFilterDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const now = useMemo(() => new Date(), []);
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(now.getDate()).padStart(2, "0")}`;

  const isTodaycondition = filterDate === today;

  const lines = useMemo(
    () =>
      sleep.length > 0
        ? [...sleep]
        : [
            {
              date: now,
              interval: [
                {
                  fromHour: "00",
                  fromMinute: "00",
                  fromAmPm: "AM",
                  tillHour: "00",
                  tillMinute: "00",
                  tillAmPm: "AM",
                },
              ],
            },
          ],
    [sleep, now]
  );

  const filteredLine = lines.find(
    (line) => new Date(line.date).toISOString().split("T")[0] === filterDate
  );

  const [interval, setInterval] = useState([
    {
      fromHour: "00",
      fromMinute: "00",
      fromAmPm: "AM",
      tillHour: "00",
      tillMinute: "00",
      tillAmPm: "AM",
    },
  ]);

  useEffect(() => {
    if (filteredLine) {
      const sorted = [...filteredLine.interval].sort(
        (a, b) =>
          toMinutes(a.fromHour, a.fromMinute, a.fromAmPm) -
          toMinutes(b.fromHour, b.fromMinute, b.fromAmPm)
      );
      setInterval(sorted);
    }
  }, [filteredLine]);

  useEffect(() => {
    const line = lines.find(
      (line) => new Date(line.date).toISOString().split("T")[0] === filterDate
    );

    if (line) {
      const sorted = [...line.interval].sort(
        (a, b) =>
          toMinutes(a.fromHour, a.fromMinute, a.fromAmPm) -
          toMinutes(b.fromHour, b.fromMinute, b.fromAmPm)
      );
      setInterval(sorted);
    } else {
      setInterval([
        {
          fromHour: "00",
          fromMinute: "00",
          fromAmPm: "AM",
          tillHour: "00",
          tillMinute: "00",
          tillAmPm: "AM",
        },
      ]);
    }
  }, [filterDate, sleep, lines]);

  const totalSleptHours = interval?.reduce((acc, int) => {
    acc =
      acc +
      calculateIntervalSleeptHours(
        int.fromHour,
        int.fromMinute,
        int.fromAmPm,
        int.tillHour,
        int.tillMinute,
        int.tillAmPm
      );
    return acc;
  }, 0);

  const lastInterval = interval[interval.length - 1];

  const emptyLineCondition = (line) =>
    Number(String(line.fromHour).trim()) +
      Number(String(line.fromMinute).trim()) +
      Number(String(line.tillHour).trim()) +
      Number(String(line.tillMinute).trim()) ===
      0 &&
    String(line.fromAmPm).trim().toUpperCase() === "AM" &&
    String(line.tillAmPm).trim().toUpperCase() === "AM";

  const emptyLastIntervalLineCondition = emptyLineCondition(lastInterval);

  const formatNumber = (num) => String(num).padStart(2, "0");

  function toMinutes(hour, minute, ampm) {
    let h = parseInt(hour, 10) % 12;
    if (ampm === "PM") h += 12;
    return h * 60 + parseInt(minute, 10);
  }

  function overlaps(newInt, allIntervals, idx) {
    const newFrom = toMinutes(
      newInt.fromHour,
      newInt.fromMinute,
      newInt.fromAmPm
    );
    const newTill = toMinutes(
      newInt.tillHour,
      newInt.tillMinute,
      newInt.tillAmPm
    );

    for (let i = 0; i < allIntervals.length; i++) {
      if (i === idx) continue;
      const int = allIntervals[i];
      const from = toMinutes(int.fromHour, int.fromMinute, int.fromAmPm);
      const till = toMinutes(int.tillHour, int.tillMinute, int.tillAmPm);

      if (newFrom < till && newTill > from) {
        return true;
      }
    }
    return false;
  }

  const updateFilteredLineInterval = (intervalIdx, field, value) => {
    let val = parseInt(value, 10);

    if (["fromHour", "tillHour"].includes(field)) {
      if (isNaN(val) || val < 0) val = 0;
      if (val > 11) val = 11;
      value = formatNumber(val);
    }

    if (["fromMinute", "tillMinute"].includes(field)) {
      if (isNaN(val) || val < 0) val = 0;
      if (val > 59) val = 59;
      value = formatNumber(val);
    }

    const newInterval = [...interval];
    const updated = { ...newInterval[intervalIdx], [field]: value };

    // verificăm dacă se suprapun intervalele de somn
    if (overlaps(updated, newInterval, intervalIdx)) {
      toast.error("Intervalele de somn nu trebuie să se suprapună!");
      return;
    }

    newInterval[intervalIdx] = updated;
    setInterval(newInterval);
  };

  const addFilteredLineNewInterval = () => {
    const newInterval = [...interval] || [];
    newInterval.push({
      fromHour: "00",
      fromMinute: "00",
      fromAmPm: "AM",
      tillHour: "00",
      tillMinute: "00",
      tillAmPm: "AM",
    });
    setInterval(newInterval);
  };

  const removeFilteredLineInterval = (intervalIdx) => {
    const newInterval = interval.filter((_, i) => i !== intervalIdx);
    setInterval(newInterval);
  };

  const resetFilteredLinesInterval = () => {
    setInterval([
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

  function handleSave() {
    const lastIntervalIndex = interval.length - 1;
    const intervalToSave = emptyLastIntervalLineCondition
      ? interval.filter((_, index) => index !== lastIntervalIndex)
      : [...interval];
    privateDispatch(
      setSleepDailyRegistrations({ date: filterDate, interval: intervalToSave })
    );
  }

  const weeklySleep = getRegistrationsForAWeek(sleep, "sleep");

  return (
    <div className={styles.cont}>
      <div className={styles.leftSideCont}>
        <div className={styles.rightSideUpCont}>
          <h1 className={styles.title}>Sleep statistics</h1>
          <div className={styles.graphCont}>
            <WeeklyChart
              target={sleepHours}
              weeklyData={weeklySleep}
              type={"sleep"}
            />
          </div>
        </div>
        <div className={styles.adviceCont}>
          <h2 className={styles.adviceTitle}>Total sleep hours</h2>
          {totalSleptHours !== 0 ? (
            <p
              style={{
                fontSize: "clamp(11px, 1.5vw, 14px)",
                color:
                  totalSleptHours < sleepHours * 0.6 ||
                  totalSleptHours > sleepHours * 1.2
                    ? "red"
                    : undefined,
              }}
              className={styles.advicep}
            >
              <span>
                You have {totalSleptHours}{" "}
                {totalSleptHours === 1 ? "hour" : "hours"} of sleep for{" "}
              </span>{" "}
              <span style={{ marginLeft: "2px" }}>
                {isTodaycondition ? "today" : formatDate(filterDate)}
              </span>
            </p>
          ) : (
            <p style={{ color: "red" }} className={styles.advicep}>
              No sleep records for{" "}
              {isTodaycondition ? "today" : formatDate(filterDate)}
            </p>
          )}
        </div>
      </div>

      <div className={styles.rightSideCont}>
        <div className={styles.rightSideUpCont}>
          <h1 className={styles.title}>Add sleep</h1>
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
              <p className={styles.from}>From</p>
              <p className={styles.rem}>
                {lines.length > 1 ? "Delete" : "Reset"}
              </p>
              <p className={styles.to}>Till</p>
            </div>
            <div className={styles.lineRowCont}>
              {interval.map((line, idx) => (
                <div key={`line-${idx}`} className={styles.lineRow}>
                  <div className={styles.timeInputGroup}>
                    <input
                      type="number"
                      min="0"
                      max="11"
                      step="1"
                      value={line.fromHour}
                      onChange={(e) =>
                        updateFilteredLineInterval(
                          idx,
                          "fromHour",
                          e.target.value
                        )
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
                        updateFilteredLineInterval(
                          idx,
                          "fromMinute",
                          e.target.value
                        )
                      }
                      className={styles.timeInput}
                    />
                    <select
                      value={line.fromAmPm}
                      onChange={(e) =>
                        updateFilteredLineInterval(
                          idx,
                          "fromAmPm",
                          e.target.value
                        )
                      }
                      className={styles.ampmSelect}
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
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
                  <div className={styles.timeInputGroup}>
                    <input
                      type="number"
                      min="0"
                      max="11"
                      step="1"
                      value={line.tillHour}
                      onChange={(e) =>
                        updateFilteredLineInterval(
                          idx,
                          "tillHour",
                          e.target.value
                        )
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
                        updateFilteredLineInterval(
                          idx,
                          "tillMinute",
                          e.target.value
                        )
                      }
                      className={styles.timeInput}
                    />
                    <select
                      value={line.tillAmPm}
                      onChange={(e) =>
                        updateFilteredLineInterval(
                          idx,
                          "tillAmPm",
                          e.target.value
                        )
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
          <div className={styles.addSleepCont}>
            <p>Add sleep period</p>
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
          {age !== 0 ? (
            <p className={styles.advicep}>
              Try to get at least {sleepHours} hours of sleep .
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
                fontSize: "clamp(11px, 2.5vw, 12px)",
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
