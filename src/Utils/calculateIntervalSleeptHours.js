export default function calculateIntervalSleeptHours(
  fromHour,
  fromMinute,
  fromAmPm,
  toHour,
  toMinute,
  toAmPm
) {
  // normalize input (string -> number, trim)
  const fH = Number(String(fromHour).trim());
  //   console.log("fH :", fH);

  const fM = Number(String(fromMinute).trim());
  const tH = Number(String(toHour).trim());
  const tM = Number(String(toMinute).trim());
  const fAP = String(fromAmPm || "")
    .trim()
    .toUpperCase();
  //   console.log("fAP :", fAP);

  const tAP = String(toAmPm || "")
    .trim()
    .toUpperCase();

  // validate
  if ([fH, fM, tH, tM].some(Number.isNaN)) return 0;

  // convert to 24h using modulo pentru a trata 12 AM / 12 PM corect:
  // 12 AM -> 0, 12 PM -> 12
  let fromH24 = fH % 12;
  if (fAP === "PM") fromH24 += 12;

  let toH24 = tH % 12;
  if (tAP === "PM") toH24 += 12;

  const fromTotalMin = fromH24 * 60 + fM;
  const toTotalMin = toH24 * 60 + tM;

  let minutesSlept = toTotalMin - fromTotalMin;
  if (minutesSlept < 0) minutesSlept += 24 * 60; // overnight

  const hours = minutesSlept / 60;
  // return Number cu o zecimală
  return parseFloat(hours.toFixed(1));
}
