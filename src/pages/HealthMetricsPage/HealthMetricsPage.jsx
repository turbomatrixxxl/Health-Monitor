import React, { useState } from "react";

import { usePrivate } from "../../hooks/usePrivate";

import calculateIdealWeight from "../../Utils/calculateIdealWeight";
import calculateNominalBPAndPulse from "../../Utils/calculateNominalBPAndPulse";

import clsx from "clsx";

import weightSvg from "../../images/icons/weight-svgrepo-com.svg";
import bloodPressureSvg2 from "../../images/icons/sphygmomanometer-blood-pressure-gauge-svgrepo-com.svg";
import heartRateSvg from "../../images/icons/gen-heart-rate-svgrepo-com.svg";

import styles from "./HealthMetricsPage.module.css";
import { setPrivateFormData } from "../../redux/private/privateSlice";

import { fetchPrivateCalculationData } from "../../redux/private/operationsPrivate";

export default function HealthMetricsPage() {
  const { user, privateFormData = {}, privateDispatch } = usePrivate();

  // useEffect(() => {
  //   console.log("privateFormData has changed:", privateFormData);
  // }, [privateFormData]);

  const name = user?.username ?? user?.name ?? "User";
  const age = user?.age ?? 0;
  const height = user?.height ?? 0;
  const weightPrivate = user?.weight ?? 0;

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
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(now.getDate()).padStart(2, "0")}`;

  const [filterDate, setFilterDate] = useState(today);

  const nowTime = now.toTimeString().slice(0, 8);
  const nowDate = now.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short", // prescurtat: Jan, Feb, Mar
    year: "numeric",
  });
  // console.log("nowDate :", nowDate);
  // console.log("nowTime :", nowTime);

  const [line, setLine] = useState({
    date: nowDate,
    hour: nowTime,
    weight: weightPrivate ?? 0,
    systolic: 0,
    diastolic: 0,
    heartRate: 0,
  });

  const sysHi = line?.systolic > systolicMax;
  const sysLo = line?.systolic < systolicMin;
  const diaHi = line?.diastolic > diastolicMax;
  const diaLo = line?.diastolic < diastolicMin;
  const pulseHi = line?.heartRate > heartRateMax;
  const pulseLo = line?.heartRate < heartRateMin;

  // console.log("line :", line);

  const updateLine = (field, value) => {
    const newLine = { ...line };
    newLine[field] = value;

    setLine(newLine);
  };

  //  const [lineRecords, setLineRecords] = useState({
  //    date: nowDate,
  //    hour: nowTime,
  //    weight: weight ?? 0,
  //    systolic: 0,
  //    diastolic: 0,
  //    heartRate: 0,
  //  });

  const lineRecords = {
    date: nowDate,
    hour: nowTime,
    weight: weightPrivate ?? 0,
    systolic: 0,
    diastolic: 0,
    heartRate: 0,
  };

  //  const handleSubmit = (formData) => {
  //     privateDispatch(fetchPrivateCalculationData(formData));
  //   };

  function handleSet(value) {
    setLine({ ...line, date: nowDate, hour: nowTime });
    const newWeight = line?.weight;
    // console.log("newWeight :", newWeight);

    privateDispatch(setPrivateFormData({ name: "currentWeight", value }));

    privateDispatch(
      fetchPrivateCalculationData({
        ...privateFormData,
        currentWeight: newWeight,
      })
    );
  }

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
              {line?.weight ? `${line.weight} kg` : "No data !"}
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
                line?.systolic && line?.diastolic ? styles.hasData : null
              )}
            >
              {line?.systolic && line?.diastolic
                ? `${line?.systolic}/${line?.diastolic} mmHg`
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
                line?.heartRate ? styles.hasData : null
              )}
            >
              {line?.heartRate ? `${line?.heartRate} bpm` : "No data !"}
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
              }}
              className={styles.metrixTitle}
            >
              It seems that you did not set up your personal info. Please check
              Diet Calculator page to set things right !
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
                    step="1"
                    value={line?.weight}
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
                    value={line?.systolic}
                    onChange={(e) => updateLine("systolic", e.target.value)}
                    className={clsx(styles.timeInput)}
                  />
                  /
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={line?.diastolic}
                    onChange={(e) => updateLine("diastolic", e.target.value)}
                    className={clsx(styles.timeInput)}
                  />
                </div>
                <div className={styles.minutes}>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={line?.heartRate}
                    onChange={(e) => updateLine("heartRate", e.target.value)}
                    className={clsx(styles.timeInput)}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleSet(line?.weight)}
                  className={styles.removeBtn}
                >
                  +
                </button>
              </div>
            </div>
          </div>
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
                Your Pulse is too {pulseHi ? "high" : "low"}. Please, consult a
                doctor !
              </p>
            )}
          </div>
          <div className={styles.rightSideSeeRecordsCont}>
            <div className={styles.rightSideDate}>
              <p className={styles.rightSideDateP}>
                Choose records date to see :
              </p>
              <div className={styles.dateWrapper}>
                <input
                  max={today}
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className={styles.paramInput}
                />
              </div>
            </div>
            {today === filterDate ? (
              <p
                style={{
                  color: "red",
                  background: "var(--Gray5)",
                  textAlign: "left",
                  height: "fit-content",
                }}
                className={styles.metrixTitle}
              >
                Not records date selected. Please select a past date to see
                records !
              </p>
            ) : (
              <div className={styles.fromToCont}>
                <div className={styles.addSleepCont}>
                  <p>Health Records for : {filterDate}</p>
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
                      {lineRecords.weight} kg
                    </div>
                    <div style={{ width: "33%" }} className={styles.minutes}>
                      {lineRecords.systolic}/{lineRecords.diastolic} mmHg
                    </div>
                    <div style={{ width: "33%" }} className={styles.minutes}>
                      {lineRecords?.heartRate} bpm
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
