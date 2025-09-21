import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function generateReportPdf(report) {
  const doc = new jsPDF();

  // --- Titlu ---
  doc.setFontSize(16);
  doc.text(`Health Report for ${report.name}`, 14, 20);

  // --- Perioada ---
  doc.setFontSize(12);
  const isSingleDay = report.from === report.till;
  const periodText = isSingleDay
    ? `Date: ${new Date(report.from).toDateString()}`
    : `Period: ${new Date(report.from).toDateString()} - ${new Date(
        report.till
      ).toDateString()}`;
  doc.text(periodText, 14, 30);

  // --- Recomandări ---
  let y = 40;
  doc.text(
    "Based on your personal info, your daily recommended values are:",
    14,
    y
  );
  y += 8;
  doc.text(`Calories: ${report.caloriesRecommended}`, 14, y);
  y += 6;
  doc.text(`Steps: ${report.stepsRecommended}`, 14, y);
  y += 6;
  doc.text(`Sleep: ${report.sleepRecommended}h`, 14, y);
  y += 6;
  doc.text(
    `Pulse: ${report.pulseRecommended} (Range: ${report.heartRateMin} - ${report.heartRateMax})`,
    14,
    y
  );
  y += 6;
  doc.text(
    `Blood Pressure: ${report.systolicRecommended}/${report.diastolicRecommended} (Sys ${report.systolicMin}-${report.systolicMax}, Dia ${report.diastolicMin}-${report.diastolicMax})`,
    14,
    y
  );
  y += 12;

  // --- Dacă nu există date ---
  if (!report.dates || report.dates.length === 0) {
    doc.setTextColor(200, 0, 0);
    doc.text("No records for this period", 14, y);
    return doc;
  }

  // --- Tabel ---
  const tableColumns = [
    "Date",
    "Calories",
    "Steps",
    "Sleep (h)",
    "Pulse",
    "Blood Pressure",
  ];

  const tableRows = report.dates.map((day) => {
    // Date simplu
    const dateLabel = new Date(day.date).toDateString();

    // Calories
    let caloriesText = "No records";
    if (day.calories > 0) {
      caloriesText =
        day.calories < report.caloriesRecommended * 0.6 ||
        day.calories > report.caloriesRecommended
          ? `${day.calories} (!)`
          : `${day.calories} (OK)`;
    }

    // Steps
    let stepsText = "No records";
    if (day.steps > 0) {
      stepsText =
        day.steps < report.stepsRecommended * 0.6
          ? `${day.steps} (!)`
          : `${day.steps} (OK)`;
    }

    // Sleep
    let sleepText = "No records";
    if (day.sleep > 0) {
      const sleepValue = Number(day.sleep.toFixed(1));
      sleepText =
        sleepValue < report.sleepRecommended * 0.6 ||
        sleepValue > report.sleepRecommended + 1
          ? `${sleepValue}h (!)`
          : `${sleepValue}h (OK)`;
    }

    // Pulse
    const pulseText = day.pulse ? String(day.pulse) : "-";

    // Blood Pressure
    const bloodText =
      day.systolic && day.diastolic ? `${day.systolic}/${day.diastolic}` : "-";

    return [
      dateLabel,
      caloriesText,
      stepsText,
      sleepText,
      pulseText,
      bloodText,
    ];
  });

  autoTable(doc, {
    head: [tableColumns],
    body: tableRows,
    startY: y,
    styles: { fontSize: 10 },
    didParseCell: (data) => {
      if (data.section === "body") {
        const text = String(data.cell.text[0]);
        if (text.includes("(!)")) data.cell.styles.textColor = [200, 0, 0];
        else if (text.includes("(OK)"))
          data.cell.styles.textColor = [0, 150, 0];
        else if (text === "No records")
          data.cell.styles.textColor = [200, 0, 0];
      }
    },
  });

  return doc;
}
