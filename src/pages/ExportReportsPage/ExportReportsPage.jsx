import React, { useEffect, useMemo, useState } from "react";

import styles from "./ExportReportsPage.module.css";
import { usePrivate } from "../../hooks/usePrivate";
import clsx from "clsx";
import calculateDailySteps from "../../Utils/calculateDailySteps";
import calculateSleepHours from "../../Utils/calculateSleepHours";
import { useNavigate } from "react-router-dom";
import calculateNominalBPAndPulse from "../../Utils/calculateNominalBPAndPulse";
import getDaysInterval from "../../Utils/getDaysInterval";
import calculateIntervalSleeptHours from "../../Utils/calculateIntervalSleeptHours";
import {
  addUpdateReport,
  deleteRport,
} from "../../redux/private/operationsPrivate";
import ReportModal from "../../components/ReportModal/ReportModal";
import generateReportPdf from "../../assets/generateReportPdf";

export default function ExportReportsPage() {
  const navigate = useNavigate();

  const { user, privateDispatch } = usePrivate();
  // console.log("user exports:", user);

  const name = user?.username || user?.name || "User";
  const age = user?.age;
  const height = user?.height;
  const weight = user?.weight;
  const desiredWeight = user?.desiredWeight;
  const blood = user?.bloodType;

  // const bloodTypeOptions = [
  //   { value: "1", label: "A" },
  //   { value: "2", label: "B" },
  //   { value: "3", label: "AB" },
  //   { value: "4", label: "O" },
  // ];

  // const bloodType =
  //   bloodTypeOptions.find((opt) => opt.value === String(blood))?.label || "A";

  const usersCondition =
    age !== 0 ||
    age !== "" ||
    age !== undefined ||
    height !== 0 ||
    height !== "" ||
    height !== undefined ||
    weight !== 0 ||
    weight !== "" ||
    weight !== undefined ||
    desiredWeight !== 0 ||
    desiredWeight !== "" ||
    desiredWeight !== undefined ||
    blood !== 0 ||
    blood !== "" ||
    blood !== undefined ||
    !age ||
    !height ||
    !weight ||
    !desiredWeight ||
    !blood;

  // console.log("bloodType :", bloodType);

  const caloriesRecommended = user?.dietaryInfo?.dailyCalorieIntake;
  const stepsRecommended = calculateDailySteps(
    age,
    weight,
    desiredWeight,
    height
  );
  const sleepRecommended = calculateSleepHours(age);
  const heartsMetrix = calculateNominalBPAndPulse(age, weight);
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
  } = heartsMetrix;
  // console.log("pulseRecommended :", heartRate);

  // console.log("systolicRecommended :", systolic);

  // console.log("diastolicRecommended :", diastolic);

  const normalizedDay = (day) => new Date(day).toISOString().split("T")[0];

  const userReports = useMemo(() => user?.reports || [], [user?.reports]);

  const [reports, setReports] = useState([]);

  useEffect(() => {
    const sortedReports = [...userReports].sort(
      (a, b) => new Date(b.from) - new Date(a.from)
    );

    console.log("sortedReports :", sortedReports);

    setReports([...sortedReports]);
  }, [setReports, userReports]);

  const now = new Date();
  const today = normalizedDay(now);
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);

  const [report, setReport] = useState({
    from: startDate,
    till: endDate,
    name: name,
    age: age,
    height: height,
    weight: weight,
    desiredWeight: desiredWeight,
    bloodType: blood,
    caloriesRecommended: caloriesRecommended,
    stepsRecommended: stepsRecommended,
    sleepRecommended: sleepRecommended,
    systolicRecommended: systolic,
    diastolicRecommended: diastolic,
    pulseRecommended: heartRate,
    heartRateMin: heartRateMin,
    heartRateMax: heartRateMax,
    systolicMin: systolicMin,
    systolicMax: systolicMax,
    diastolicMin: diastolicMin,
    diastolicMax: diastolicMax,
    dates: [],
  });

  useEffect(() => {
    setReport((prev) => ({
      ...prev,
      from: startDate,
      till: endDate,
    }));
  }, [startDate, endDate]);

  // console.log("report :", report);

  const daysInterval = useMemo(
    () => getDaysInterval(startDate, endDate),
    [startDate, endDate]
  );

  // console.log(daysInterval);

  useEffect(() => {
    if (!user) return;

    const newDates = daysInterval.map((day) => {
      const consumedProductsForDay = (user?.consumedProducts || []).filter(
        (product) => normalizedDay(product?.date) === normalizedDay(day)
      );

      const totalCalories = consumedProductsForDay.reduce((acc, product) => {
        if (consumedProductsForDay.length === 0) {
          return 0;
        } else {
          acc = acc + product.calories;
        }

        return acc;
      }, 0);

      const stepsForDay = (user?.steps || []).find(
        (step) => normalizedDay(step.date) === normalizedDay(day)
      );
      const totalSteps = stepsForDay
        ? stepsForDay?.interval?.reduce((acc, int) => {
            acc += int.steps;
            return acc;
          }, 0)
        : 0;

      const sleepForDay = (user?.sleep || []).find(
        (sl) => normalizedDay(sl.date) === normalizedDay(day)
      );
      // console.log("sleepForDay :", sleepForDay);

      const totalSleptHours = sleepForDay
        ? sleepForDay.interval?.reduce((acc, int) => {
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
            // console.log("acc :", acc);

            return acc;
          }, 0)
        : 0;
      // console.log("totalSlept :", totalSleptHours, "day :", day);

      const heartForDay = (user?.heart || []).find(
        (hr) => normalizedDay(hr.date) === normalizedDay(day)
      );

      const userHeart = heartForDay
        ? {
            pulse: heartForDay?.pulse,
            systolic: heartForDay?.systolic,
            diastolic: heartForDay?.diastolic,
          }
        : 0;

      const datesCopndition =
        totalCalories > 0 ||
        totalSteps > 0 ||
        totalSleptHours > 0 ||
        userHeart > 0;

      return datesCopndition
        ? {
            date: day,
            calories: totalCalories,
            steps: totalSteps,
            sleep: totalSleptHours,
            systolic: userHeart.systolic || 0,
            diastolic: userHeart.diastolic || 0,
            pulse: userHeart.pulse || 0,
          }
        : null;
    });

    const filteredNewDates = newDates.filter((date) => date !== null);

    setReport((prev) => ({
      ...prev,
      dates: filteredNewDates,
    }));
  }, [daysInterval, user]);

  // console.log("daysInterval :", daysInterval);

  const styledReportDate = (date) => new Date(date).toDateString();

  function handleGenerate() {
    privateDispatch(addUpdateReport({ report: { ...report } }));
    setStartDate(today);
    setEndDate(today);
  }

  const handleDownload = (report) => {
    const doc = generateReportPdf(report);

    const fileName = `${report.name}_Health_Report-${styledReportDate(
      report.from
    )}${
      report.from !== report.till ? "-" + styledReportDate(report.till) : ""
    }.pdf`;

    doc.save(fileName);
  };

  const [selectedReport, setSelectedReport] = useState(null);

  const handleOpenReportModal = (report) => {
    setSelectedReport(report);
  };

  const handleCloseReportModal = () => {
    setSelectedReport(null);
  };

  function handleDeleteReport(id) {
    privateDispatch(deleteRport({ id: id }));
  }

  return (
    <div className={styles.cont}>
      <div className={styles.leftSideCont}>
        <h1 className={styles.title}>Exports & Reports</h1>
        <div className={styles.datesCont}>
          <div className={styles.dateCont}>
            <p className={styles.dateTitle}>Start date</p>
            <input
              onChange={(e) => setStartDate(e.target.value)}
              value={startDate}
              className={styles.date}
              max={today}
              type="date"
            />
          </div>
          <div className={styles.dateCont}>
            <p className={styles.dateTitle}>End date</p>
            <input
              onChange={(e) => setEndDate(e.target.value)}
              value={endDate}
              className={styles.date}
              min={startDate}
              max={today}
              type="date"
            />
          </div>
        </div>
        {usersCondition ? (
          <button
            onClick={handleGenerate}
            className={styles.generateBtn}
            type="button"
          >
            Generate report
          </button>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "5px",
              background: "aliceblue",
              border: "1px solid var(--Gray-5)",
              borderRadius: "5px",
              padding: "10px",
            }}
          >
            <p style={{ display: "flex", textAlign: "center", color: "red" }}>
              It seems that you did not set up your personal info. Please Go:
            </p>
            <button
              onClick={() => navigate("/")}
              className={styles.generateBtn}
              type="button"
            >
              Diet Calculator
            </button>
          </div>
        )}
      </div>
      <div className={styles.rightSideCont}>
        <h1 className={styles.title}>Generated Reports...</h1>
        <ul className={styles.rightSideContList}>
          {reports.length > 0 ? (
            reports.map((report) => {
              return (
                <li
                  key={`report-${report._id}`}
                  className={styles.rightSideContListItem}
                >
                  <div className={styles.rightSideContListItemLeftCont}>
                    <div className={styles.btnsCont}>
                      <button
                        onClick={() => handleOpenReportModal(report)}
                        type="button"
                        className={styles.openReportModalBtn}
                      >
                        PDF Report
                      </button>

                      <button
                        onClick={() => handleDeleteReport(report._id)}
                        type="button"
                        className={clsx(
                          styles.openReportModalBtn,
                          styles.deleteBtn
                        )}
                      >
                        Delete
                      </button>
                    </div>
                    <div className={styles.rightSideContListItemDatesCont}>
                      <span>{styledReportDate(report.from)}</span>
                      {report.from !== report.till && (
                        <span>-{styledReportDate(report.till)}</span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownload(report)}
                    type="button"
                    className={styles.downloadBtn}
                  >
                    Download
                  </button>
                </li>
              );
            })
          ) : (
            <li className={clsx(styles.rightSideContListItem, styles.empty)}>
              No Reports Yet
            </li>
          )}
        </ul>

        {selectedReport && (
          <ReportModal
            report={selectedReport}
            onClose={handleCloseReportModal}
          />
        )}
      </div>
    </div>
  );
}
