import React, { useEffect, useState } from "react";

import { usePrivate } from "../../hooks/usePrivate";
import { useAuth } from "../../hooks/useAuth";

import { fetchConsumedProductsForSpecificDay } from "../../redux/private/operationsPrivate";

import getFormattedDate from "../../Utils/getFormattedDate";
import calculateDailySteps from "../../Utils/calculateDailySteps";
import calculateSleepHours from "../../Utils/calculateSleepHours";
import calculateNominalBPAndPulse from "../../Utils/calculateNominalBPAndPulse";

import clsx from "clsx";

import styles from "./DailyProgressPage.module.css";
import Chart from "../../components/Chart";

export default function DailyProgressPage() {
  const { dailyCalorieSummary, privateDispatch } = usePrivate();
  //   console.log("dailyCalorieSummary :", dailyCalorieSummary);

  const reminders = [
    { id: 1, hour: "9:00 AM", text: "Drink water", done: false },
    { id: 2, hour: "9:00 AM", text: "Drink water", done: false },
    { id: 3, hour: "9:00 AM", text: "Drink water", done: false },
    { id: 4, hour: "9:00 AM", text: "Drink water", done: false },
    { id: 5, hour: "9:00 AM", text: "Drink water", done: false },
    { id: 6, hour: "9:00 AM", text: "Drink water", done: false },
  ];

  const [rem, setRem] = useState(...[reminders]);
  const updatedReminders = rem.filter((reminder) => !reminder.done);
  // console.log("updatedReminders :", updatedReminders.length);

  const { user } = useAuth();
  // console.log("user :", user);

  const name = user?.username ?? "User";
  const age = user?.age ?? 0;
  const height = user?.height ?? 0;
  const weight = user?.weight ?? 0;
  const desiredWeight = user?.desiredWeight ?? 0;

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
    const today = getFormattedDate(); // Ensure the correct format YYYY-MM-DD
    // console.log("Fetching data for date:", today);

    privateDispatch(fetchConsumedProductsForSpecificDay({ date: today })); // Pass as an object
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
  // const caloriesPer = condition
  //   ? dailyCalorieSummary?.percentageCaloriesConsumed
  //   : 0;
  const caloriesPer = 0;
  const caloriesLeft = condition ? dailyCalorieSummary?.remainingCalories : 0;

  const steps = 0;
  const stepsPer = condition ? Math.round((100 * steps) / neededSteps) : 0;
  const stepsLeft = condition ? neededSteps - steps : 0;
  //   console.log("stepsLeft :", stepsLeft);

  const sleep = 0;
  const sleepPer = condition ? Math.round((100 * sleep) / neededSleep) : 0;
  const sleepLeft = condition ? neededSleep - sleep : 0;
  //   console.log("over :", sleepPer > 100);

  const total = caloriesPer + stepsPer + sleepPer;

  const systolicR = 0;
  const diastolicR = 0;
  const pulse = 0;
  const heartCondition = systolicR + diastolicR === 0 || pulse === 0;
  console.log("heartCondition :", heartCondition);

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

  function handleReminderDone(id) {
    // Update the reminders state to mark the reminder as done
    const newReminders = rem.map((reminder) =>
      reminder.id === id ? { ...reminder, done: true } : reminder
    );

    return setRem(newReminders);
  }

  let free = 100 - globalPercentage;

  if (free < 0) {
    free = 0;
  }

  // console.log("percent :", caloriesPer, stepsPer, sleepPer, free);
  console.log("sleepLeft === neededSleep :", sleepLeft === neededSleep);

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
          {updatedReminders.length !== 0 ? (
            <>
              <h3 className={styles.metrixTitle}>Daily Reminders</h3>
              <ul className={styles.remindersList}>
                {rem.map(
                  (reminder) =>
                    !reminder?.done && (
                      <li
                        style={{ color: "red" }}
                        className={styles.metrixTitle}
                        key={`reminder-${reminder.id}`}
                      >
                        <span>{reminder?.hour}</span> -{" "}
                        <span>{reminder?.text}</span>
                        <button
                          className={styles.doneBtn}
                          onClick={() => handleReminderDone(reminder.id)}
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
              No Reminders set !!!
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
              {totalCalories ? (
                <p className={styles.metrixTitle}>
                  <span className={styles.metrixName}>
                    Calories to consume :
                  </span>
                  <span className={clsx(styles.metrixQuantity, styles.needed)}>
                    {formatNumber(totalCalories)} calories
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
                  It seems that you did not set up your personal info. Please
                  check Diet Calculator page to set things right !
                </p>
              )}
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
                    caloriesPer >= 80 && styles.goodResult
                  )}
                >
                  {caloriesPer}%
                </span>
              </p>
              {caloriesPer !== 0 ? (
                <p className={styles.metrixTitle}>
                  <span className={styles.metrixName}>
                    Remaining calories :
                  </span>
                  <span
                    className={clsx(
                      styles.metrixQuantity,
                      (caloriesPer > 100 || caloriesPer <= 50) &&
                        styles.badResult,
                      caloriesPer < 80 &&
                        caloriesLeft > 50 &&
                        styles.mediumResult,
                      caloriesPer >= 80 && styles.goodResult
                    )}
                  >
                    {formatNumber(caloriesLeft)} calories
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
              {neededSteps !== 0 ? (
                <p className={styles.metrixTitle}>
                  <span className={styles.metrixName}>Steps to do :</span>
                  <span className={clsx(styles.metrixQuantity, styles.needed)}>
                    {formatNumber(neededSteps)} steps
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
                  It seems that you did not set up your personal info. Please
                  check Diet Calculator page to set things right !
                </p>
              )}
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
                    {formatNumber(stepsLeft)} steps
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
              {neededSleep !== 0 ? (
                <p className={styles.metrixTitle}>
                  <span className={styles.metrixName}>Hours to sleep :</span>
                  <span className={clsx(styles.metrixQuantity, styles.needed)}>
                    {neededSleep.toFixed(1)} hr
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
                  It seems that you did not set up your personal info. Please
                  check Diet Calculator page to set things right !
                </p>
              )}
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
              {heartsMetrics !== 0 ? (
                <>
                  <p className={styles.metrixTitle}>
                    <span className={styles.metrixName}>Normal BP :</span>
                    <span
                      className={clsx(styles.metrixQuantity, styles.needed)}
                    >
                      {systolic}/{diastolic} mm/Hg
                    </span>
                  </p>
                  <p className={styles.metrixTitle}>
                    <span className={styles.metrixName}>Normal Pulse :</span>
                    <span
                      className={clsx(styles.metrixQuantity, styles.needed)}
                    >
                      {heartRate} bpm
                    </span>
                  </p>
                </>
              ) : (
                <p
                  style={{
                    color: "red",
                    background: "var(--Gray5)",
                    textAlign: "left",
                  }}
                  className={styles.metrixTitle}
                >
                  It seems that you did not set up your personal info. Please
                  check Diet Calculator page to set things right !
                </p>
              )}

              {heartCondition ? (
                <p
                  style={{
                    color: "red",
                    background: "var(--Gray5)",
                    textAlign: "left",
                  }}
                  className={styles.metrixTitle}
                >
                  It seems that You did not recorded heart inputs for today !
                  Please input datas !
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
                      It seems that your blood pressure is too{" "}
                      {diastolicR < diastolicMin || systolicR < systolicMin
                        ? "low"
                        : diastolicR > diastolicMax || systolicR > systolicMax
                        ? "high"
                        : ""}
                      ! Please consult doctor !
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
            }}
            className={styles.metrixTitle}
          >
            It seems that you did not set up your personal info. Please check
            Diet Calculator page to set things right !
          </p>
        )}
      </div>
    </div>
  );
}
