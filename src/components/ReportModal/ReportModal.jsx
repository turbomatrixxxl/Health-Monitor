import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useMediaQuery } from "react-responsive";
import { toast } from "react-toastify";
import generateReportPdf from "../../assets/generateReportPdf";
import styles from "./ReportModal.module.css";

const breakpoints = {
  mobile: "(max-width: 767px)",
  tablet: "(min-width:768px) and (max-width:1023px)",
  desktop: "(min-width:1024px)",
};

export default function ReportModal({ report, onClose }) {
  const [pdfUrl, setPdfUrl] = useState("");
  const isMobile = useMediaQuery({ query: breakpoints.mobile });
  const isTablet = useMediaQuery({ query: breakpoints.tablet });

  const normalizedDay = (day) => new Date(day).toDateString();

  useEffect(() => {
    if (!report) return;
    const doc = generateReportPdf(report);
    const pdfBlob = doc.output("blob");
    const url = URL.createObjectURL(pdfBlob);
    setPdfUrl(url); // folosit doar pentru desktop
    return () => URL.revokeObjectURL(url);
  }, [report]);

  const handleOpenPdf = () => {
    if (!report) return;
    const doc = generateReportPdf(report);
    const pdfBlob = doc.output("blob");
    const url = URL.createObjectURL(pdfBlob);
    if (isMobile || isTablet) {
      window.open(url, "_blank");
      toast.success("Report opened in a new tab");
    } else {
      setPdfUrl(url);
    }
  };

  const handleDownload = () => {
    if (!report) return;
    const doc = generateReportPdf(report);
    const fileName = `${report.name}_Health_Report-${normalizedDay(
      report.from
    )}${
      report.from !== report.till ? "-" + normalizedDay(report.till) : ""
    }.pdf`;
    doc.save(fileName);
    if (isMobile || isTablet) toast.success("Report saved successfully");
  };

  if (!report) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>PDF Preview</h2>
        {!isMobile && !isTablet && pdfUrl && (
          <iframe
            src={pdfUrl}
            title="PDF Preview"
            width="100%"
            height="400px"
            style={{ border: "1px solid #ccc" }}
          />
        )}
        <div className={styles.buttons}>
          {(isMobile || isTablet) && (
            <button onClick={handleOpenPdf} className={styles.downloadBtn}>
              Open PDF
            </button>
          )}
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
