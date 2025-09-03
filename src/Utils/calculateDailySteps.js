export default function calculateDailySteps(
  age,
  currentWeight,
  desiredWeight,
  height
) {
  // Basal metabolic factor depending on age (younger -> higher activity need)
  let ageFactor;
  if (age < 30) ageFactor = 1.2;
  else if (age < 50) ageFactor = 1.1;
  else ageFactor = 1.0;

  // Maintenance steps baseline (based on height and weight balance)
  let baseSteps = 6000 + (height - 150) * 20;

  // Difference between current and desired weight
  let weightDiff = desiredWeight - currentWeight;

  let adjustment;
  if (weightDiff === 0) {
    // Maintain weight
    adjustment = 0;
  } else if (weightDiff < 0) {
    // Lose weight → increase steps
    adjustment = Math.abs(weightDiff) * 200;
  } else {
    // Gain weight → fewer steps needed
    adjustment = -weightDiff * 150;
  }

  // Final calculation with age factor
  let dailySteps = Math.round((baseSteps + adjustment) * ageFactor);

  // Ensure a healthy minimum and maximum
  if (dailySteps < 4000) dailySteps = 4000;
  if (dailySteps > 15000) dailySteps = 15000;

  return dailySteps;
}
