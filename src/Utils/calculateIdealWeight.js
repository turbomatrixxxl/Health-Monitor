// calculateIdealWeight.js
export default function calculateIdealWeight(age, height) {
  if (!age || !height || height <= 0) {
    return "Invalid input";
  }

  const heightM = height / 100;

  // Maxim sănătos (IMC = 24.9)
  const maxWeight = 24.9 * (heightM * heightM);

  return Number(maxWeight.toFixed(1));
}
