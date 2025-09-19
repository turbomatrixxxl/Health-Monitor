import calculateIntervalSleeptHours from "./calculateIntervalSleeptHours";

export default function getRegistrationsForAWeek(userData, param) {
  const date = new Date();
  const day = date.getDay(); // 0 = Duminică, 1 = Luni, ..., 6 = Sâmbătă
  const diffToMonday = day === 0 ? -6 : 1 - day;

  const startOfTheWeek = new Date(date);
  startOfTheWeek.setDate(date.getDate() + diffToMonday);
  // console.log("date.getDate() :", date.getDate());
  // date.getDate() : 19

  startOfTheWeek.setHours(0, 0, 0, 0);
  // console.log("startOfTheWeek :", startOfTheWeek);
  // getRegistrationsForAWeek.js:13 startOfTheWeek : Mon Sep 15 2025 00:00:00 GMT+0300 (Eastern European Summer Time)

  const weekTotal = [];

  for (let index = 0; index < 7; index++) {
    const currentDay = new Date(startOfTheWeek);
    currentDay.setDate(startOfTheWeek.getDate() + index);

    // console.log("currentDay:", currentDay);
    // getRegistrationsForAWeek.js:20 currentDay: Fri Sep 19 2025 00:00:00 GMT+0300 (Eastern European Summer Time)

    // console.log("startOfTheWeek.getDate() :", startOfTheWeek.getDate());
    // getRegistrationsForAWeek.js:21 startOfTheWeek.getDate() : 15

    // console.log("currentDay.toDateString() :", currentDay.toDateString());
    // getRegistrationsForAWeek.js:22 currentDay.toDateString() : Thu Sep 18 2025

    const dayData = userData.find(
      (day) => new Date(day.date).toDateString() === currentDay.toDateString()
    );

    if (param === "steps") {
      const totalSteps = dayData
        ? dayData?.interval.reduce((acc, int) => acc + int.steps, 0)
        : 0;
      weekTotal.push({
        day: currentDay.toLocaleDateString("en-US", { weekday: "short" }),
        "Total steps": totalSteps,
      });
    } else {
      const totalSleptHours = dayData
        ? dayData?.interval?.reduce((acc, int) => {
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
            return acc;
          }, 0)
        : 0;
      weekTotal.push({
        day: currentDay.toLocaleDateString("en-US", { weekday: "short" }),
        "Total hours": totalSleptHours,
      });
    }
  }

  return weekTotal;
}
