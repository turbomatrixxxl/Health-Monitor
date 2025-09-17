export default function formatDate(inputDate) {
  const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const [year, month, day] = inputDate.split("-").map(Number);

  const dateObj = new Date(year, month - 1, day);

  const dayName = days[dateObj.getDay()];
  const monthName = months[month - 1];

  return `${dayName}-${String(day).padStart(2, "0")}-${monthName}-${year}`;
}
