import React, { useState } from "react";

import styles from "./ExportReportsPage.module.css";
// import { usePrivate } from "../../hooks/usePrivate";
import clsx from "clsx";

export default function ExportReportsPage() {
  // const { user } = usePrivate();
  // console.log("user exports:", user);

  const now = new Date();
  const today = now.toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);

  const startDay = new Date(startDate).toDateString();
  const endDay = new Date(endDate).toDateString();

  function handleGenerate() {
    console.log("click generate");
  }

  function handleDownload() {
    console.log("click download");
  }

  function handleOpenReportModal() {
    console.log("click open report modal");
  }

  function handleDeleteReport() {
    console.log("click delete report ");
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
        <button
          onClick={handleGenerate}
          className={styles.generateBtn}
          type="button"
        >
          Generate report
        </button>
      </div>
      <div className={styles.rightSideCont}>
        <h1 className={styles.title}>Generated Reports...</h1>
        <ul className={styles.rightSideContList}>
          <li className={styles.rightSideContListItem}>
            <div className={styles.rightSideContListItemLeftCont}>
              <div className={styles.btnsCont}>
                <button
                  onClick={handleOpenReportModal}
                  type="button"
                  className={styles.openReportModalBtn}
                >
                  PDF Report
                </button>

                <button
                  onClick={handleDeleteReport}
                  type="button"
                  className={clsx(styles.openReportModalBtn, styles.deleteBtn)}
                >
                  Delete
                </button>
              </div>
              <div className={styles.rightSideContListItemDatesCont}>
                <span>{startDay}</span>
                {startDate !== endDate && <span>-{endDay}</span>}
              </div>
            </div>
            <button
              onClick={handleDownload}
              type="button"
              className={styles.downloadBtn}
            >
              Download
            </button>
          </li>
          <li className={clsx(styles.rightSideContListItem, styles.empty)}>
            No Reports Yet
          </li>
          <li className={clsx(styles.rightSideContListItem, styles.empty)}>
            No Reports Yet
          </li>
          <li className={clsx(styles.rightSideContListItem, styles.empty)}>
            No Reports Yet
          </li>
          <li className={clsx(styles.rightSideContListItem, styles.empty)}>
            No Reports Yet
          </li>
          <li className={clsx(styles.rightSideContListItem, styles.empty)}>
            No Reports Yet
          </li>
        </ul>
      </div>
    </div>
  );
}
