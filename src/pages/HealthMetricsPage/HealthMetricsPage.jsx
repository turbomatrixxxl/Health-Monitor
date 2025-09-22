import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { usePrivate } from "../../hooks/usePrivate";
import { setPrivateFormData } from "../../redux/private/privateSlice";
import {
  fetchPrivateCalculationData,
  setHeartMetrix,
} from "../../redux/private/operationsPrivate";

import clsx from "clsx";

import calculateIdealWeight from "../../Utils/calculateIdealWeight";
import calculateNominalBPAndPulse from "../../Utils/calculateNominalBPAndPulse";

import HeartMetrixDateSelector from "../../components/HeartMetrixDateSelector/HeartMetrixDateSelector";

import weightSvg from "../../images/icons/weight-svgrepo-com.svg";
import bloodPressureSvg2 from "../../images/icons/sphygmomanometer-blood-pressure-gauge-svgrepo-com.svg";
import heartRateSvg from "../../images/icons/gen-heart-rate-svgrepo-com.svg";

import styles from "./HealthMetricsPage.module.css";

export default function HealthMetricsPage() {
  const navigate = useNavigate();

  const { user, privateFormData = {}, privateDispatch } = usePrivate();

  const name = user?.username ?? user?.name ?? "User";
  const age = user?.age ?? 0;
  const height = user?.height ?? 0;
  const weightPrivate = user?.weight ?? 0;
  // console.log("weightPrivate :", weightPrivate);

  const heartMetrix = user?.heart || [];

  const heartMetrixCondition = heartMetrix.length > 0;

  function normalizeDate(date) {
    const dateToNormalize = new Date(date);

    return `${dateToNormalize.getFullYear()}-${String(
      dateToNormalize.getMonth() + 1
    ).padStart(2, "0")}-${String(dateToNormalize.getDate()).padStart(2, "0")}`;
  }

  const heartMetrixDates = heartMetrixCondition
    ? heartMetrix.map((record) => normalizeDate(record.date))
    : [];

  const lastHeartMetrixRecord =
    heartMetrix.length > 0 ? heartMetrix[heartMetrix.length - 1] : false;

  const lastHeartMetrixRecordDate = lastHeartMetrixRecord
    ? lastHeartMetrixRecord.date
    : false;

  const resetedLastHeartMetrixRecordDate = lastHeartMetrixRecordDate
    ? new Date(lastHeartMetrixRecordDate).setHours(0, 0, 0, 0)
    : false;

  // console.log(
  //   "resetedLastHeartMetrixRecordDate :",
  //   resetedLastHeartMetrixRecordDate
  // );

  const todayDate = new Date();
  const resetedtodayDate = todayDate.setHours(0, 0, 0, 0);

  // console.log("resetedtodayDate :", resetedtodayDate);

  const condition = age > 0 && height > 0 && weightPrivate > 0;

  const heartsMetrics = calculateNominalBPAndPulse(age, weightPrivate);
  const {
    heartRate,
    systolic,
    diastolic,
    heartRateMin,
    heartRateMax,
    systolicMin,
    systolicMax,
    diastolicMin,
    diastolicMax,
  } = heartsMetrics;

  const now = new Date();

  const today = (day) => {
    const daytoBe = new Date(day);
    return daytoBe.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short", // prescurtat: Jan, Feb, Mar
      year: "numeric",
    });
  };

  const nowTime = now.toTimeString().slice(0, 8);
  const nowDate = now.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short", // prescurtat: Jan, Feb, Mar
    year: "numeric",
  });
  // console.log("nowDate :", nowDate);
  // console.log("nowTime :", nowTime);

  const [line, setLine] = useState(
    resetedLastHeartMetrixRecordDate === resetedtodayDate
      ? { ...lastHeartMetrixRecord }
      : {
          date: nowDate,
          time: nowTime,
          weight: weightPrivate,
          systolic: 0,
          diastolic: 0,
          pulse: 0,
        }
  );

  // console.log("line :", line);

  const updateLine = (field, value) => {
    setLine((prev) => ({
      ...prev,
      [field]: value === "" ? "" : parseFloat(value),
    }));
  };

  const [lineRecords, setLineRecords] = useState(
    resetedLastHeartMetrixRecordDate === resetedtodayDate
      ? { ...lastHeartMetrixRecord }
      : {
          date: nowDate,
          time: nowTime,
          weight: weightPrivate,
          systolic: line?.systolic,
          diastolic: line?.diastolic,
          pulse: line?.pulse,
        }
  );

  const sysHi = lineRecords?.systolic > systolicMax;
  const sysLo = lineRecords?.systolic < systolicMin;
  const diaHi = lineRecords?.diastolic > diastolicMax;
  const diaLo = lineRecords?.diastolic < diastolicMin;
  const pulseHi = lineRecords?.pulse > heartRateMax;
  const pulseLo = lineRecords?.pulse < heartRateMin;

  useEffect(() => {
    if (resetedLastHeartMetrixRecordDate === resetedtodayDate) {
      setLineRecords({ ...lastHeartMetrixRecord });
    }
  }, [
    resetedLastHeartMetrixRecordDate,
    resetedtodayDate,
    lastHeartMetrixRecord,
  ]);

  // console.log("lineRecords :", lineRecords);

  function handleSet() {
    const newLine = { ...line, date: nowDate, time: nowTime };
    console.log("newLine :", newLine);

    // 1. Actualizează lineRecords pentru UI
    setLineRecords(newLine);

    // 2. Actualizează line (input)
    setLine(newLine);

    // 3. Trimite în Redux
    privateDispatch(setHeartMetrix(newLine));
    privateDispatch(
      setPrivateFormData({ name: "currentWeight", value: newLine.weight })
    );
    privateDispatch(
      fetchPrivateCalculationData({
        ...privateFormData,
        currentWeight: newLine.weight,
      })
    );
  }

  const formatNumber = (num) => String(num).replace(/^0+(?=\d)/, "");

  useEffect(() => {
    if (weightPrivate > 0 && (!line || line.date !== nowDate)) {
      const todayLine = {
        date: nowDate,
        time: nowTime,
        weight: weightPrivate,
        systolic: 0,
        diastolic: 0,
        pulse: 0,
      };
      setLine(todayLine);
      setLineRecords(todayLine);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weightPrivate, nowDate, nowTime]);

  return (
    <div className={styles.cont}>
      <div className={styles.leftSideCont}>
        <h1 className={styles.title}>Health Metrics</h1>
        <div className={styles.leftSideElementsCont}>
          <div className={clsx(styles.leftSideElementCont, styles.weightIcon)}>
            <div className={styles.iconContainer}>
              <img
                src={weightSvg}
                alt="Weight Icon"
                className={clsx(styles.icon)}
              />
              <h2 style={{ color: "blue" }} className={clsx(styles.iconName)}>
                Weight
              </h2>
            </div>
            <p
              className={clsx(
                styles.iconData,
                user?.weight ? styles.hasData : null
              )}
            >
              {weightPrivate ? `${weightPrivate} kg` : "No data !"}
            </p>
          </div>
          <div className={clsx(styles.leftSideElementCont, styles.bloodIcon)}>
            <div className={styles.iconContainer}>
              <img
                src={bloodPressureSvg2}
                alt="Blood pressure Icon"
                className={clsx(styles.icon)}
              />
              <h2
                style={{ color: "forestgreen" }}
                className={clsx(styles.iconName)}
              >
                Blood Pressure
              </h2>
            </div>
            <p
              className={clsx(
                styles.iconData,
                lineRecords?.systolic && lineRecords?.diastolic
                  ? styles.hasData
                  : null
              )}
            >
              {lineRecords?.systolic && lineRecords?.diastolic
                ? `${lineRecords?.systolic}/${lineRecords?.diastolic} mmHg`
                : "No data !"}
            </p>
          </div>
          <div className={clsx(styles.leftSideElementCont, styles.heartIcon)}>
            <div className={styles.iconContainer}>
              <img
                src={heartRateSvg}
                alt="Heart rate Icon"
                className={clsx(styles.icon)}
              />
              <h2 style={{ color: "red" }} className={clsx(styles.iconName)}>
                Heart Rate
              </h2>
            </div>
            <p
              className={clsx(
                styles.iconData,
                line?.pulse ? styles.hasData : null
              )}
            >
              {lineRecords?.pulse ? `${lineRecords?.pulse} bpm` : "No data !"}
            </p>
          </div>
        </div>

        <div className={styles.leftSideNormalMetrixCont}>
          {condition ? (
            <p
              style={{ background: "var(--Gray-5)" }}
              className={styles.metrixTitle}
            >
              Dear {name}, based on your personal info :
            </p>
          ) : null}
          {condition ? (
            <p
              style={{ color: "blue" }}
              className={clsx(styles.metrixTitle, styles.weightIcon)}
            >
              Your ideal weight should be {calculateIdealWeight(age, height)}{" "}
              kg.
            </p>
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
          {condition ? (
            <p
              style={{ color: "forestgreen" }}
              className={clsx(styles.metrixTitle, styles.bloodIcon)}
            >
              Your ideal Blood Pressure should be {systolic}/{diastolic} mmHg.
            </p>
          ) : null}
          {condition ? (
            <p
              style={{ color: "red" }}
              className={clsx(styles.metrixTitle, styles.heartIcon)}
            >
              Your ideal Heart Rate should be around {heartRate} bpm.
            </p>
          ) : null}
        </div>
      </div>
      <div className={styles.rightSideCont}>
        <h1 className={styles.title}>Logs</h1>

        <div className={styles.rightSideContentCont}>
          <div className={styles.fromToCont}>
            <div className={styles.addSleepCont}>
              <p>Add data for Today : {nowDate}</p>
            </div>
            <div className={styles.fromToTitle}>
              <p className={styles.fromExercise}>Time</p>
              <p className={styles.from}>Weight</p>
              <p className={styles.from}>Pressure</p>
              <p className={styles.from}>Pulse</p>
              <p className={styles.rem}>Set</p>
            </div>
            <div className={styles.lineRowCont}>
              <div className={styles.lineRow}>
                <div className={clsx(styles.minutes, styles.date)}>
                  {nowTime}
                </div>
                <div className={styles.minutes}>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={line?.weight ?? ""}
                    onChange={(e) => updateLine("weight", e.target.value)}
                    className={clsx(styles.timeInput)}
                  />{" "}
                  kg
                </div>
                <div className={styles.minutes}>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={formatNumber(line?.systolic)}
                    onChange={(e) =>
                      updateLine(
                        "systolic",
                        e.target.value.replace(/^0+(?=\d)/, "") || "0"
                      )
                    }
                    className={clsx(styles.timeInput)}
                  />
                  /
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={formatNumber(line?.diastolic)}
                    onChange={(e) =>
                      updateLine(
                        "diastolic",
                        e.target.value.replace(/^0+(?=\d)/, "") || "0"
                      )
                    }
                    className={clsx(styles.timeInput)}
                  />
                </div>
                <div className={styles.minutes}>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={formatNumber(line?.pulse)}
                    onChange={(e) =>
                      updateLine(
                        "pulse",
                        e.target.value.replace(/^0+(?=\d)/, "") || "0"
                      )
                    }
                    className={clsx(styles.timeInput)}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleSet()}
                  className={styles.removeBtn}
                >
                  +
                </button>
              </div>
            </div>
          </div>
          {heartMetrixCondition ? (
            <div className={styles.fromToCont}>
              {(sysHi || sysLo) && (
                <p
                  style={{
                    color: "red",
                    background: "var(--Gray5)",
                    textAlign: "left",
                    height: "fit-content",
                  }}
                  className={styles.metrixTitle}
                >
                  Your Systolic blood pressure is too {sysHi ? "high" : "low"}.
                  Please, consult a doctor !
                </p>
              )}
              {(diaHi || diaLo) && (
                <p
                  style={{
                    color: "red",
                    background: "var(--Gray5)",
                    textAlign: "left",
                    height: "fit-content",
                  }}
                  className={styles.metrixTitle}
                >
                  Your Diastolic blood pressure is too {diaHi ? "high" : "low"}.
                  Please, consult a doctor !
                </p>
              )}
              {(pulseHi || pulseLo) && (
                <p
                  style={{
                    color: "red",
                    background: "var(--Gray5)",
                    textAlign: "left",
                    height: "fit-content",
                  }}
                  className={styles.metrixTitle}
                >
                  Your Pulse is too {pulseHi ? "high" : "low"}. Please, consult
                  a doctor !
                </p>
              )}
            </div>
          ) : (
            <p
              style={{
                color: "red",
                background: "var(--Gray5)",
                textAlign: "left",
                height: "fit-content",
              }}
              className={styles.metrixTitle}
            >
              No records yet for today!
            </p>
          )}
          <div className={styles.rightSideSeeRecordsCont}>
            {heartMetrixCondition && (
              <div className={styles.rightSideDate}>
                <p className={styles.rightSideDateP}>
                  Choose records date to see :
                </p>
                <div className={styles.dateWrapper}>
                  <HeartMetrixDateSelector
                    theme={"light"}
                    dates={heartMetrixDates}
                    onSelect={(selectedDate) => {
                      const selectedRecord = heartMetrix.find(
                        (r) => normalizeDate(r.date) === selectedDate
                      );
                      // console.log("selectedRecord :", selectedRecord);

                      if (selectedRecord) {
                        setLineRecords({ ...selectedRecord });
                      }
                    }}
                  />
                </div>
              </div>
            )}
            {!heartMetrixCondition ? (
              <p
                style={{
                  color: "red",
                  background: "var(--Gray5)",
                  textAlign: "left",
                  height: "fit-content",
                }}
                className={styles.metrixTitle}
              >
                Not heart metrix records yet !
              </p>
            ) : (
              <div className={styles.fromToCont}>
                <div className={styles.addSleepCont}>
                  <p>
                    Health Records for : {today(lineRecords.date)}{" "}
                    {lineRecords?.time.slice(0, 5) ?? "00:00:00"}
                  </p>
                </div>
                <div className={styles.fromToTitle}>
                  <p style={{ width: "33%" }} className={styles.from}>
                    Weight
                  </p>
                  <p style={{ width: "33%" }} className={styles.from}>
                    Blood Pressure
                  </p>
                  <p style={{ width: "33%" }} className={styles.from}>
                    HeartRate
                  </p>
                </div>
                <div className={styles.lineRowCont}>
                  <div className={styles.lineRow}>
                    <div style={{ width: "33%" }} className={styles.minutes}>
                      {lineRecords.weight ?? weightPrivate} kg
                    </div>
                    <div style={{ width: "33%" }} className={styles.minutes}>
                      {lineRecords.systolic}/{lineRecords.diastolic} mmHg
                    </div>
                    <div style={{ width: "33%" }} className={styles.minutes}>
                      {lineRecords?.pulse} bpm
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
