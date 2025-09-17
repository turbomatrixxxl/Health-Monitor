export default function convertActivityToSteps(
  activity,
  minutes,
  age,
  weight,
  height,
  intensity
) {
  if (!activity) {
    return "please input your exercise type";
  }

  if (!age || !weight || !height) {
    return 0;
  }

  const minutesNum = Number(minutes) || 0;

  const activityMET = {
    football: 8,
    tennis: 7.3,
    basketball: 6.5,
    gym: 5,
    fitness: 6,
    cycling: 6,
    running: 9.8,
    jogging: 7,
    swimming: 8,
    hockey: 7,
    rugby: 8,
    volley: 5,
    yoga: 3,
    walking: 3.5,
    dancing: 5.5,
    skiing: 7,
    snowboarding: 6.8,
    surfing: 5,
    boxing: 7.8,
    climbing: 8,
  };

  const met = activityMET[activity.toLowerCase()] || 4;

  let caloriesPerMin = 0.0175 * met * weight;

  if (intensity === "min") {
    caloriesPerMin *= 0.8;
  } else if (intensity === "max") {
    caloriesPerMin *= 1.2;
  }

  const totalCalories = caloriesPerMin * minutesNum;

  const ageFactor = age < 30 ? 1.1 : age < 50 ? 1.0 : 0.9;

  const adjustedCalories = totalCalories * ageFactor;

  const steps = Math.round(adjustedCalories * 25);

  return steps;
}
