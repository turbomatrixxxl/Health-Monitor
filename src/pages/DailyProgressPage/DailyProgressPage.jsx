import React, { useEffect } from "react";

import { usePrivate } from "../../hooks/usePrivate";
import { useAuth } from "../../hooks/useAuth";

import { fetchConsumedProductsForSpecificDay } from "../../redux/private/operationsPrivate";

import getFormattedDate from "../../Utils/getFormattedDate";
import calculateDailySteps from "../../Utils/calculateDailySteps";
import calculateSleepHours from "../../Utils/calculateSleepHours";
import calculateNominalBPAndPulse from "../../Utils/calculateNominalBPAndPulse";

import clsx from "clsx";

import styles from "./DailyProgressPage.module.css";

export default function DailyProgressPage() {
  const { dailyCalorieSummary, privateDispatch } = usePrivate();
  //   console.log("dailyCalorieSummary :", dailyCalorieSummary);

  const { user } = useAuth();
  console.log("user :", user);

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

  const condition = age && height && weight && desiredWeight;

  const totalCalories = condition ? dailyCalorieSummary?.dailyCalorieIntake : 0;
  const caloriesPer = condition
    ? dailyCalorieSummary?.percentageCaloriesConsumed
    : 0;
  const caloriesLeft = condition ? dailyCalorieSummary?.remainingCalories : 0;

  const steps = 20000;
  const stepsPer = condition ? Math.round((100 * steps) / neededSteps) : 0;
  const stepsLeft = condition ? neededSteps - steps : 0;
  //   console.log("stepsLeft :", stepsLeft);

  const sleep = 10;
  const sleepPer = condition ? Math.round((100 * sleep) / neededSleep) : 0;
  const sleepLeft = condition ? neededSleep - sleep : 0;
  //   console.log("over :", sleepPer > 100);

  const systolicR = 130;
  const diastolicR = 60;
  const pulse = 100;

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

  return (
    <div className={styles.cont}>
      <div className={styles.leftSideCont}>
        <h1 className={styles.title}>Daily Progress</h1>
        <div className={styles.graphCont}>
          <div>Graphic container</div>
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
        </div>
        <div className={clsx(styles.metrixCont, styles.alerts)}>
          <h3 className={styles.title}>Dayly Reminders</h3>
        </div>
      </div>
      <div className={styles.rightSideCont}>
        <h1 className={styles.title}>Daily Records</h1>
        {condition ? (
          <>
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
              <p className={styles.metrixTitle}>
                <span className={styles.metrixName}>Remaining calories :</span>
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
                  {formatNumber(caloriesLeft)} calories
                </span>
              </p>
            </div>
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
            </div>
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
              {sleepLeft > 0 ? (
                <p className={styles.metrixTitle}>
                  <span className={styles.metrixName}>
                    Remaining steps to do :
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
              {systolicR >= systolicMin &&
              systolicR <= systolicMax &&
              diastolicR >= heartRateMin &&
              diastolicR <= heartRateMax ? (
                <p className={styles.metrixTitle}>
                  <span className={styles.metrixName}>{name} BP :</span>
                  <span
                    className={clsx(styles.metrixQuantity, styles.goodResult)}
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
                  <span className={styles.metrixName}>{name} BP :</span>
                  <span
                    className={clsx(styles.metrixQuantity, styles.goodResult)}
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
            </div>
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
            It seems that you did not set up your personal info. Please check
            Diet Calculator page to set things right !
          </p>
        )}
      </div>
    </div>
  );
}
