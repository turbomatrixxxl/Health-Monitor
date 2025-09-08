/**
 * Calculeaza activitatea fizica minima zilnica in minute
 * pentru mentinerea sanatatii si atingerea obiectivului.
 *
 * @param {number} age - varsta utilizatorului (ani)
 * @param {number} height - inaltimea utilizatorului (cm)
 * @param {number} weight - greutatea actuala (kg)
 * @param {number} desiredWeight - greutatea dorita (kg)
 * @returns {number} activitate minima zilnica in minute
 */
export default function calculateMinimumDailyActivity(
  age,
  height,
  weight,
  desiredWeight
) {
  if (!age || !height || !weight || !desiredWeight) return 0;

  const heightM = height / 100;
  const bmiCurrent = weight / (heightM * heightM);
  const bmiDesired = desiredWeight / (heightM * heightM);

  // Activitate de baza pentru sanatate
  let baseActivity = 30; // 30 min/zi minim

  // Ajustare dupa varsta
  if (age < 30) baseActivity *= 1;
  else if (age < 50) baseActivity *= 1.1;
  else baseActivity *= 1.2;

  // Ajustare dupa obiectiv si diferenta BMI
  const bmiDiff = bmiCurrent - bmiDesired;

  let goalFactor = 1; // mentinere
  if (bmiDiff > 0.5) {
    // trebuie sa slabeasca
    goalFactor = 1 + Math.min(bmiDiff / 5, 1); // creste activitatea pana la 100% in functie de diferenta
  } else if (bmiDiff < -0.5) {
    // trebuie sa se ingrase
    goalFactor = 0.8; // mai putina activitate
  }

  const dailyActivityMinutes = baseActivity * goalFactor;

  return Math.round(dailyActivityMinutes);
}

// Exemple
// console.log(calculateMinimumDailyActivity(25, 175, 70, 65)); // slabire
// console.log(calculateMinimumDailyActivity(35, 180, 80, 80)); // mentinere
// console.log(calculateMinimumDailyActivity(50, 165, 60, 65)); // ingrasare
// console.log(calculateMinimumDailyActivity(null, 165, 60, 65)); // lipseste age => 0
