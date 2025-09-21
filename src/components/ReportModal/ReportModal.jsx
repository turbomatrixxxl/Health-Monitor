import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import generateReportPdf from "../../assets/generateReportPdf"; // <-- funcția cu tabelul
import styles from "./ReportModal.module.css";

export default function ReportModal({ report, onClose }) {
  const [pdfUrl, setPdfUrl] = useState("");

  const normalizedDay = (day) => new Date(day).toDateString();

  useEffect(() => {
    if (report) {
      const doc = generateReportPdf(report);
      const pdfBlob = doc.output("blob");
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
    }
  }, [report]);

  const handleDownload = () => {
    const doc = generateReportPdf(report);

    const fileName = `${report.name}_Health_Report-${normalizedDay(
      report.from
    )}${
      report.from !== report.till ? "-" + normalizedDay(report.till) : ""
    }.pdf`;

    doc.save(fileName);
  };

  if (!report) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>PDF Preview</h2>
        {pdfUrl && (
          <iframe
            src={pdfUrl}
            title="PDF Preview"
            width="100%"
            height="400px"
            style={{ border: "1px solid #ccc" }}
          />
        )}
        <div className={styles.buttons}>
          <button onClick={handleDownload} className={styles.downloadBtn}>
            Download
          </button>
          <button onClick={onClose} className={styles.closeBtn}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

ReportModal.propTypes = {
  report: PropTypes.object,
  onClose: PropTypes.func.isRequired,
};
