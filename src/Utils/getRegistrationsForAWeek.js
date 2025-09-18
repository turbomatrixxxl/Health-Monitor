import calculateIntervalSleeptHours from "./calculateIntervalSleeptHours";

export default function getRegistrationsForAWeek(userData, param) {
  const date = new Date();
  const day = date.getDay(); // 0 = Duminică, 1 = Luni, ..., 6 = Sâmbătă
  const diffToMonday = day === 0 ? -6 : 1 - day;

  const startOfTheWeek = new Date(date);
  startOfTheWeek.setDate(date.getDate() + diffToMonday);
  console.log("date.getDate() :", date.getDate());

  startOfTheWeek.setHours(0, 0, 0, 0);
  console.log("startOfTheWeek :", startOfTheWeek);

  const weekTotal = [];

  for (let index = 0; index < 7; index++) {
    const currentDay = new Date(startOfTheWeek);
    currentDay.setDate(startOfTheWeek.getDate() + index);
    console.log("currentDay:", currentDay);
    console.log("startOfTheWeek.getDate() :", startOfTheWeek.getDate());
    console.log("currentDay.toDateString() :", currentDay.toDateString());

    const dayData = userData.find(
      (day) => new Date(day.date).toDateString() === currentDay.toDateString()
    );

    if (param === "steps") {
      const totalSteps = dayData
        ? dayData?.interval.reduce((acc, int) => acc + int.steps, 0)
        : 0;
      weekTotal.push({
        day: currentDay.toLocaleDateString("en-US", { weekday: "short" }),
        total: totalSteps,
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
        total: totalSleptHours,
      });
    }
  }

  return weekTotal;
}
