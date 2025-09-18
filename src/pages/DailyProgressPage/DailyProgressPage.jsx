import React, { useEffect } from "react";

import { usePrivate } from "../../hooks/usePrivate";

import {
  addEditReminder,
  fetchConsumedProductsForSpecificDay,
  refreshDoneReminders,
} from "../../redux/private/operationsPrivate";

import getFormattedDate from "../../Utils/getFormattedDate";
import calculateDailySteps from "../../Utils/calculateDailySteps";
import calculateSleepHours from "../../Utils/calculateSleepHours";
import calculateNominalBPAndPulse from "../../Utils/calculateNominalBPAndPulse";
import formatTimeTo12h from "../../Utils/formatTimeTo12h";

import clsx from "clsx";

import Chart from "../../components/Chart";

import calculateIntervalSleeptHours from "../../Utils/calculateIntervalSleeptHours";

import styles from "./DailyProgressPage.module.css";
import { useNavigate } from "react-router-dom";

export default function DailyProgressPage() {
  const navigate = useNavigate();

  const { dailyCalorieSummary, privateDispatch, user } = usePrivate();
  //   console.log("dailyCalorieSummary :", dailyCalorieSummary);

  const reminders = user?.reminders || [];
  const updatedReminders = reminders.filter(
    (reminder) =>
      !reminder.done && reminder.frequency === "daily" && reminder.active
  );
  const sortedReminders = updatedReminders.sort((a, b) => {
    const [aH, aM] = a.time.split(":").map(Number);
    const [bH, bM] = b.time.split(":").map(Number);

    // console.log("aH, aM", aH, aM);

    return aH !== bH ? aH - bH : aM - bM;
  });

  // console.log("sortedReminders :", sortedReminders);

  const rem = [...sortedReminders];

  const handleDoneForToday = (id) => {
    const reminder = sortedReminders.find((r) => r._id === id);
    if (!reminder) return;

    const doneDates = reminder.doneDates ? [...reminder.doneDates] : [];
    const now = new Date();

    const nowStr =
      now
        .toLocaleDateString("ro-RO", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
        .split(".")
        .reverse()
        .join("-") +
      ` ${String(now.getHours()).padStart(2, "0")}:${String(
        now.getMinutes()
      ).padStart(2, "0")}`;

    if (!doneDates.includes(nowStr)) {
      doneDates.push(nowStr);
    }

    privateDispatch(
      addEditReminder({
        ...reminder,
        id: reminder._id,
        doneDates,
        done: true,
      })
    );
  };

  let free = 100 - globalPercentage;

  if (free < 0) {
    free = 0;
  }

  useEffect(() => {
    privateDispatch(refreshDoneReminders());
  }, [privateDispatch]);

  // console.log("updatedReminders :", updatedReminders.length);

  const name = user?.username ?? "User";
  const age = user?.age ?? 0;
  const height = user?.height ?? 0;
  const weight = user?.weight ?? 0;
  const desiredWeight = user?.desiredWeight ?? 0;
  const heartMetrix = user?.heart ?? [];
  const stepsRecords = user?.steps || [];
  // console.log("stepsRecords :", stepsRecords);

  const sleepRecords = user?.sleep || [];
  // console.log("sleepRecords :", sleepRecords);

  const today = getFormattedDate();

  const todayStepsRecords = stepsRecords.find(
    (record) => new Date(record.date).toISOString().split("T")[0] === today
  );
  // console.log("todayStepsRecords :", todayStepsRecords);

  const todaySleepRecords = sleepRecords.find(
    (record) => new Date(record.date).toISOString().split("T")[0] === today
  );
  // console.log("todaySleepRecords :", todaySleepRecords);

  const totalSteps = todayStepsRecords
    ? todayStepsRecords.interval.reduce((ac, line) => {
        const steps = Number(line.steps) || 0;
        ac += steps;
        return ac;
      }, 0)
    : 0;

  const totalSleptHoursForToday = todaySleepRecords
    ? todaySleepRecords?.interval?.reduce((acc, int) => {
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
      }, 0)
    : 0;

  const heartMetrixCondition = heartMetrix?.length > 0;

  const heartMetrixLength = heartMetrix.length;

  const heartMetrixLastRecord = heartMetrixCondition
    ? heartMetrix[heartMetrixLength - 1]
    : [];

  const neededSteps = calculateDailySteps(age, weight, desiredWeight, height);
  const neededSleep = calculateSleepHours(age);
  const heartsMetrics = calculateNominalBPAndPulse(age, weight);
  const {
    heartRate,
    heartRateMin,
    heartRateMax,
    systolic,
    systolicMin,
    systolicMax,
    diastolic,
    diastolicMin,
    diastolicMax,
  } = heartsMetrics;

  useEffect(() => {
    const today = getFormattedDate();
    // console.log("Fetching data for date:", today);

    privateDispatch(fetchConsumedProductsForSpecificDay({ date: today })); //
  }, [privateDispatch]);

  function formatNumber(num) {
    return num.toLocaleString("en-US");
  }

  const condition =
    (age || age !== 0) &&
    (height || height !== 0) &&
    (weight || weight !== 0) &&
    (desiredWeight || desiredWeight !== 0);

  const totalCalories = condition ? dailyCalorieSummary?.dailyCalorieIntake : 0;
  const caloriesPer = condition
    ? dailyCalorieSummary?.percentageCaloriesConsumed
    : 0;
  const caloriesLeft = condition ? dailyCalorieSummary?.remainingCalories : 0;

  const stepsPer = condition ? Math.round((100 * totalSteps) / neededSteps) : 0;
  const stepsLeft = condition ? neededSteps - totalSteps : 0;
  //   console.log("stepsLeft :", stepsLeft);

  const sleep = totalSleptHoursForToday;
  const sleepPer = condition ? Math.round((100 * sleep) / neededSleep) : 0;
  const sleepLeft = condition ? neededSleep - sleep : 0;
  //   console.log("over :", sleepPer > 100);

  const total = caloriesPer + stepsPer + sleepPer;

  const systolicR = heartMetrixCondition ? heartMetrixLastRecord.systolic : 0;
  const diastolicR = heartMetrixCondition ? heartMetrixLastRecord.diastolic : 0;
  const pulse = heartMetrixCondition ? heartMetrixLastRecord.pulse : 0;
  const heartCondition = systolicR + diastolicR === 0 || pulse === 0;
  // console.log("heartCondition :", heartCondition);

  function totalGoalsPercentage(cal, st, sl) {
    let calories = cal ?? 0;
    let steps = st ?? 0;
    let sleep = sl ?? 0;

    if (cal > 100) calories = 100;
    if (sl > 100) sleep = 100;

    const goalsPercentage = (calories + steps + sleep) / 3;

    return Math.floor(goalsPercentage);
  }

  const globalPercentage = totalGoalsPercentage(
    caloriesPer,
    stepsPer,
    sleepPer
  );

  //   console.log("globalPercentage :", globalPercentage);

  // console.log("percent :", caloriesPer, stepsPer, sleepPer, free);

  // console.log("sleepLeft === neededSleep :", sleepLeft === neededSleep);

  return (
    <div className={styles.cont}>
      <div className={styles.leftSideCont}>
        <h1 className={styles.title}>Daily Progress</h1>
        <div className={styles.graphCont}>
          <Chart
            calories={caloriesPer}
            steps={stepsPer}
            sleep={sleepPer}
            free={free}
            totalPercent={globalPercentage}
          />
          {total > 0 ? (
            <p
              className={clsx(
                styles.graphicResult,
                globalPercentage <= 50 && styles.badResult,
                globalPercentage > 50 &&
                  globalPercentage < 80 &&
                  styles.mediumResult,
                globalPercentage >= 80 && styles.goodResult
              )}
            >
              You have reached {globalPercentage}% of your goals today
            </p>
          ) : (
            <p
              className={clsx(
                styles.graphicResult,
                globalPercentage <= 50 && styles.badResult,
                globalPercentage > 50 &&
                  globalPercentage < 80 &&
                  styles.mediumResult,
                globalPercentage >= 80 && styles.goodResult
              )}
            >
              No entries for today ! Please, add some records !
            </p>
          )}
        </div>
        <div className={clsx(styles.metrixCont, styles.alerts)}>
          {updatedReminders.length > 0 ? (
            <>
              <h3 className={styles.metrixTitle}>Daily Reminders</h3>
              <ul className={styles.remindersList}>
                {rem.map(
                  (reminder) =>
                    !reminder?.done && (
                      <li
                        style={{ color: "red" }}
                        className={styles.metrixTitle}
                        key={`reminder-${reminder._id}`}
                      >
                        <div className={styles.metrixTitleContent}>
                          <span>{formatTimeTo12h(reminder?.time)}</span> -{" "}
                          <span>{reminder?.text}</span>
                        </div>
                        <button
                          className={styles.doneBtn}
                          onClick={() => handleDoneForToday(reminder._id)}
                          type="button"
                        >
                          Done
                        </button>
                      </li>
                    )
                )}
              </ul>
            </>
          ) : (
            <p
              style={{ color: "red" }}
              className={clsx(styles.metrixTitle, styles.alerts)}
            >
              Nothing to resolve. You’re all set!
            </p>
          )}
        </div>
      </div>
      <div className={styles.rightSideCont}>
        <h1 className={styles.title}>Daily Records</h1>
        {condition ? (
          <>
            {/* Calories */}
            <div className={styles.metrixCont}>
              <p className={styles.metrixTitle}>
                <span className={styles.metrixName}>Calories to consume :</span>
                <span className={clsx(styles.metrixQuantity, styles.needed)}>
                  {formatNumber(totalCalories)} calories
                </span>
              </p>

              <p className={styles.metrixTitle}>
                <span className={styles.metrixName}>Calories consumed :</span>
                <span
                  className={clsx(
                    styles.metrixQuantity,
                    (caloriesPer === 0 ||
                      caloriesPer > 100 ||
                      caloriesPer <= 50) &&
                      styles.badResult,
                    caloriesPer < 80 &&
                      caloriesLeft > 50 &&
                      styles.mediumResult,
                    caloriesPer >= 80 && caloriesPer <= 100 && styles.goodResult
                  )}
                >
                  {caloriesPer}%
                </span>
              </p>
              {caloriesPer !== 0 ? (
                <p className={styles.metrixTitle}>
                  <span
                    style={caloriesLeft < 0 ? { color: "red" } : {}}
                    className={styles.metrixName}
                  >
                    {caloriesLeft >= 0
                      ? "Remaining calories :"
                      : "Over intake:"}
                  </span>
                  <span
                    className={clsx(
                      styles.metrixQuantity,
                      (caloriesPer > 100 || caloriesPer <= 50) &&
                        styles.badResult,
                      caloriesPer < 80 &&
                        caloriesLeft > 50 &&
                        styles.mediumResult,
                      caloriesPer >= 80 &&
                        caloriesPer <= 100 &&
                        styles.goodResult
                    )}
                  >
                    {Math.abs(formatNumber(caloriesLeft))} calories
                  </span>
                </p>
              ) : (
                <p style={{ color: "red" }} className={styles.metrixTitle}>
                  No entry for today ! Please, input meals entries !
                </p>
              )}
            </div>

            {/* Steps */}
            <div className={styles.metrixCont}>
              <p className={styles.metrixTitle}>
                <span className={styles.metrixName}>Steps to do :</span>
                <span className={clsx(styles.metrixQuantity, styles.needed)}>
                  {formatNumber(neededSteps)} steps
                </span>
              </p>

              <p className={styles.metrixTitle}>
                <span className={styles.metrixName}>Steps taken :</span>
                <span
                  className={clsx(
                    styles.metrixQuantity,
                    (stepsPer === 0 || stepsPer <= 50) && styles.badResult,
                    stepsPer < 80 && stepsPer > 50 && styles.mediumResult,
                    stepsPer >= 80 && styles.goodResult
                  )}
                >
                  {stepsPer}%
                </span>
              </p>
              {stepsPer !== 0 ? (
                <p className={styles.metrixTitle}>
                  <span className={styles.metrixName}>
                    Remaining steps to do :
                  </span>
                  <span
                    className={clsx(
                      styles.metrixQuantity,
                      (stepsPer === 0 || stepsPer <= 50) && styles.badResult,
                      stepsPer < 80 && stepsPer > 50 && styles.mediumResult,
                      stepsPer >= 80 && styles.goodResult
                    )}
                  >
                    {stepsLeft > 0 ? formatNumber(stepsLeft) : 0} steps
                  </span>
                </p>
              ) : (
                <p style={{ color: "red" }} className={styles.metrixTitle}>
                  No steps recorded for today ! Please, walk more or input
                  record !
                </p>
              )}
            </div>

            {/* Sleep */}
            <div className={styles.metrixCont}>
              <p className={styles.metrixTitle}>
                <span className={styles.metrixName}>Hours to sleep :</span>
                <span className={clsx(styles.metrixQuantity, styles.needed)}>
                  {neededSleep.toFixed(1)} hr
                </span>
              </p>

              <p className={styles.metrixTitle}>
                <span className={styles.metrixName}>Hours slept :</span>
                <span
                  className={clsx(
                    styles.metrixQuantity,
                    (sleepPer === 0 || sleepPer <= 50 || sleepPer > 100) &&
                      styles.badResult,
                    sleepPer < 80 && sleepPer > 50 && styles.mediumResult,
                    sleepPer >= 80 && sleepPer < 100 && styles.goodResult
                  )}
                >
                  {sleepPer}%
                </span>
              </p>
              {sleepPer === 0 ? (
                <p
                  style={{
                    color: "red",
                    background: "var(--Gray5)",
                    textAlign: "left",
                  }}
                  className={styles.metrixTitle}
                >
                  No sleep recorded yet for today ! Please, input sleep record !
                </p>
              ) : sleepLeft > 0 ? (
                <p className={styles.metrixTitle}>
                  <span className={styles.metrixName}>
                    Remaining hours to sleep :
                  </span>
                  <span
                    className={clsx(
                      styles.metrixQuantity,
                      (sleepPer === 0 || sleepPer <= 50) && styles.badResult,
                      sleepPer < 80 && sleepPer > 50 && styles.mediumResult,
                      sleepPer >= 80 && styles.goodResult
                    )}
                  >
                    {sleepLeft.toFixed(1)} hr
                  </span>
                </p>
              ) : (
                <p
                  style={{
                    color: "red",
                    background: "var(--Gray5)",
                    textAlign: "left",
                  }}
                  className={styles.metrixTitle}
                >
                  It seems overslept {Math.abs(sleepLeft)} hr. Please sleep less
                  !
                </p>
              )}
            </div>

            {/* Heart Metrics */}
            <div className={styles.metrixCont}>
              <p className={styles.metrixTitle}>
                <span className={styles.metrixName}>Normal BP :</span>
                <span className={clsx(styles.metrixQuantity, styles.needed)}>
                  {systolic}/{diastolic} mm/Hg
                </span>
              </p>
              <p className={styles.metrixTitle}>
                <span className={styles.metrixName}>Normal Pulse :</span>
                <span className={clsx(styles.metrixQuantity, styles.needed)}>
                  {heartRate} bpm
                </span>
              </p>

              {heartCondition ? (
                <p
                  style={{
                    color: "red",
                    background: "var(--Gray5)",
                    textAlign: "left",
                  }}
                  className={styles.metrixTitle}
                >
                  It seems that You did not recorded heart inputs ! Please input
                  data !
                </p>
              ) : (
                <>
                  {systolicR >= systolicMin &&
                  systolicR <= systolicMax &&
                  diastolicR >= diastolicMin &&
                  diastolicR <= diastolicMax ? (
                    <p className={styles.metrixTitle}>
                      <span className={styles.metrixName}>{name} BP :</span>
                      <span
                        className={clsx(
                          styles.metrixQuantity,
                          styles.goodResult
                        )}
                      >
                        {systolicR}/{diastolicR} mm/Hg
                      </span>
                    </p>
                  ) : (
                    <p
                      style={{
                        color: "red",
                        background: "var(--Gray5)",
                        textAlign: "left",
                      }}
                      className={styles.metrixTitle}
                    >
                      It seems that your blood pressure is not good ! Please
                      consult doctor !
                    </p>
                  )}

                  {pulse >= heartRateMin && pulse <= heartRateMax ? (
                    <p className={styles.metrixTitle}>
                      <span className={styles.metrixName}>{name} Pulse :</span>
                      <span
                        className={clsx(
                          styles.metrixQuantity,
                          styles.goodResult
                        )}
                      >
                        {pulse} bpm
                      </span>
                    </p>
                  ) : (
                    <p
                      style={{
                        color: "red",
                        background: "var(--Gray5)",
                        textAlign: "left",
                      }}
                      className={styles.metrixTitle}
                    >
                      It seems that your pulse is too{" "}
                      {pulse < heartRateMin
                        ? "low"
                        : pulse > heartRateMax
                        ? "high"
                        : ""}
                      ! Please consult doctor !
                    </p>
                  )}
                </>
              )}
            </div>
          </>
        ) : (
          <p
            style={{
              color: "red",
              background: "var(--Gray5)",
              textAlign: "left",
              border: "1px solid red",
              flexWrap: "wrap",
              gap: "3px",
              padding: "10px",
              justifyContent: "flex-start",
              height: "fit-content",
            }}
            className={styles.metrixTitle}
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
  );
}
