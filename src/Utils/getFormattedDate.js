export default function getFormattedDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Add leading zero if needed
  const day = String(today.getDate()).padStart(2, "0"); // Add leading zero if needed
  return `${year}-${month}-${day}`; // Return in YYYY-MM-DD format
}
