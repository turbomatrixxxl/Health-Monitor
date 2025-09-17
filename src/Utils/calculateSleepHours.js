export default function calculateSleepHours(age, activityLevel = "moderate") {
  let sleepRange;

  if (age < 14) {
    sleepRange = [9, 11];
  } else if (age <= 17) {
    sleepRange = [8, 10];
  } else if (age <= 64) {
    sleepRange = [7, 9];
  } else {
    sleepRange = [7, 8];
  }

  if (activityLevel === "high") {
    sleepRange = [sleepRange[0] + 0.5, sleepRange[1] + 1];
  }

  const min = sleepRange[0];
  const max = sleepRange[1];

  const medium = (max + min) / 2;

  return medium;
}
