export default function getDaysInterval(start, end) {
  const daysDates = [];

  const normalizedDay = (day) => new Date(day).toISOString().split("T")[0];

  const startInterval = new Date(start);
  startInterval.setHours(0, 0, 0, 0);

  const endInterval = new Date(end);
  endInterval.setHours(0, 0, 0, 0);

  const diffMilisecondsIntervals = endInterval - startInterval;
  const numberOfDays = Math.ceil(
    diffMilisecondsIntervals / (1000 * 60 * 60 * 24)
  );

  for (let index = 1; index <= numberOfDays + 1; index++) {
    const currentDay = new Date(startInterval);
    currentDay.setDate(startInterval.getDate() + index);
    daysDates.push(normalizedDay(currentDay));
  }

  return daysDates;
}
