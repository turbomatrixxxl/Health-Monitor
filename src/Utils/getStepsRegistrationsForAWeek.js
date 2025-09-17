export default function getStepsRegistrationsForAWeek(user) {
  const date = new Date();
  const day = date.getDay(); // 0 = Duminică, 1 = Luni, ..., 6 = Sâmbătă

  // Dacă vrem luni ca început de săptămână
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() + diffToMonday);
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  console.log("Start of week:", startOfWeek);
  console.log("End of week:", endOfWeek);

  const weeklySteps = user.steps.filter((step) => {
    const stepsDate = new Date(step.date);
    return stepsDate >= startOfWeek && stepsDate <= endOfWeek;
  });

  return weeklySteps;
}
