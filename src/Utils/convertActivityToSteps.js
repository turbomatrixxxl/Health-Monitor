// convertActivityToSteps.js

/**
 * Converteste o activitate fizica in echivalent de pasi.
 *
 * @param {string} activity - tipul de activitate (ex: "football", "tennis", "yoga")
 * @param {number} minutes - durata in minute
 * @param {number} age - varsta utilizatorului
 * @param {number} weight - greutatea utilizatorului (kg)
 * @param {number} height - inaltimea utilizatorului (cm)
 * @param {"min"|"max"} [intensity] - nivelul de efort ("min" = moderat, "max" = intens)
 * @returns {number|string} pasi echivalenti sau mesaj de eroare
 */
function convertActivityToSteps(
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

  // MET aproximativ pentru cateva activitati
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

  const met = activityMET[activity.toLowerCase()] || 4; // fallback MET pt sport necunoscut

  // calorii arse/minut
  let caloriesPerMin = 0.0175 * met * weight;

  // aplicare intensitate
  if (intensity === "min") {
    caloriesPerMin *= 0.8; // moderat
  } else if (intensity === "max") {
    caloriesPerMin *= 1.2; // intens
  }

  // total calorii
  const totalCalories = caloriesPerMin * minutes;

  // ajustare in functie de varsta
  const ageFactor = age < 30 ? 1.1 : age < 50 ? 1.0 : 0.9;

  const adjustedCalories = totalCalories * ageFactor;

  // conversie in pasi (1 pas ≈ 0.04 kcal => ~25 pasi/kcal)
  const steps = Math.round(adjustedCalories * 25);

  return steps;
}

export default convertActivityToSteps;

// Exemple de utilizare
// console.log(
//   convertActivityToSteps("snowboarding", 45, 30, 75, 180, "max"),
//   "pasi echivalenti (intens)"
// );
// console.log(
//   convertActivityToSteps("surfing", 60, 28, 70, 175, "min"),
//   "pasi echivalenti (moderat)"
// );
// console.log(convertActivityToSteps("", 30, 25, 70, 175), "=> missing activity");
// console.log(
//   convertActivityToSteps("running", 30, null, 70, 175),
//   "=> missing personal param"
// );
