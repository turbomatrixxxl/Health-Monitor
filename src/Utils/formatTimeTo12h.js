export default function formatTimeTo12h(time24) {
  // așteaptă time24 în format "HH.mm"
  const [hourStr, minuteStr] = time24.split(":");
  let hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);

  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12;
  if (hour === 0) hour = 12; // cazul 0 -> 12 AM

  const formattedHour = hour.toString().padStart(2, "0");
  const formattedMinute = minute.toString().padStart(2, "0");

  return `${formattedHour}:${formattedMinute} ${ampm}`;
}
