/**
 * Calculate nominal heart rate and blood pressure with age- and weight-adjusted limits
 * @param {number} age - age in years
 * @param {number} weight - weight in kg
 * @returns {object} - { heartRate, heartRateMin, heartRateMax, systolic, systolicMin, systolicMax, diastolic, diastolicMin, diastolicMax }
 */
export default function calculateBPAndPulse(age, weight) {
  if (!age) {
    return 0;
  }

  // Puls nominal: 70 ± 10, ajustat cu varsta
  const heartRate = Math.round(70 + (age - 30) * 0.3);
  const heartRateMin = Math.round(heartRate - 10);
  const heartRateMax = Math.round(heartRate + 10);

  // Tensiune arterială nominală: sistolic 110 ± 10, diastolic 70 ± 5, ajustate cu vârsta
  const systolic = Math.round(110 + age * 0.5);
  const systolicMin = Math.round(systolic - 10);
  const systolicMax = Math.round(systolic + 10);

  const diastolic = Math.round(70 + age * 0.2);
  const diastolicMin = Math.round(diastolic - 5);
  const diastolicMax = Math.round(diastolic + 5);

  // Ajustare ușoară în funcție de greutate
  let hr = heartRate,
    hrMin = heartRateMin,
    hrMax = heartRateMax;
  let sys = systolic,
    sysMin = systolicMin,
    sysMax = systolicMax;
  let dia = diastolic,
    diaMin = diastolicMin,
    diaMax = diastolicMax;

  if (weight) {
    if (weight > 80) {
      hr += 2;
      hrMin += 2;
      hrMax += 2;
      sys += 3;
      sysMin += 3;
      sysMax += 3;
      dia += 2;
      diaMin += 2;
      diaMax += 2;
    } else if (weight < 60) {
      hr -= 2;
      hrMin -= 2;
      hrMax -= 2;
      sys -= 3;
      sysMin -= 3;
      sysMax -= 3;
      dia -= 2;
      diaMin -= 2;
      diaMax -= 2;
    }
  }

  return {
    heartRate: hr,
    heartRateMin: hrMin,
    heartRateMax: hrMax,
    systolic: sys,
    systolicMin: sysMin,
    systolicMax: sysMax,
    diastolic: dia,
    diastolicMin: diaMin,
    diastolicMax: diaMax,
  };
}

const noAge = calculateBPAndPulse();
console.log("noAge :", noAge);
