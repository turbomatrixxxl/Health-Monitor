// Utils/createEventFromReminder.js
export default function createEventFromReminder(rem, viewStart, viewEnd) {
  if (!rem.active) return [];

  const [hour, minute] = rem.time.split(":").map(Number);
  const [endHour, endMinute] = rem.end
    ? rem.end.split(":").map(Number)
    : [hour + 1, minute];

  const events = [];
  const doneDates = rem.doneDates || [];

  // calculează repeatHours din string, ex: "2 hours" → 2
  let repeatHours = 0;
  if (typeof rem.repeat === "string" && rem.repeat !== "noRepeat") {
    repeatHours = parseInt(rem.repeat, 10);
  }

  // dacă repeatHours < 1 => considerăm că nu se repetă
  if (isNaN(repeatHours) || repeatHours < 1) repeatHours = 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const current = new Date(viewStart);

  while (current <= viewEnd) {
    const day = current.getDay(); // 0=Su,1=Mo,...6=Sa
    const dateStr = current
      .toLocaleDateString("ro-RO", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .split(".")
      .reverse()
      .join("-"); // format YYYY-MM-DD

    // ignoră zilele trecute
    if (current < today) {
      current.setDate(current.getDate() + 1);
      continue;
    }

    const pushEventsForDay = () => {
      const startTime = new Date(current);
      startTime.setHours(hour, minute, 0, 0);

      const endTime = new Date(current);
      endTime.setHours(endHour, endMinute, 0, 0);

      if (repeatHours > 0) {
        // repetă la interval de repeatHours între start și end
        let tempStart = new Date(startTime);
        while (tempStart < endTime) {
          const tempEnd = new Date(tempStart);
          tempEnd.setMinutes(tempEnd.getMinutes() + 1); // durata scurtă, poate fi modificată
          events.push({
            id: `${rem._id}-${+tempStart}`,
            title: rem.text,
            start: new Date(tempStart),
            end: new Date(tempEnd),
          });
          tempStart.setHours(tempStart.getHours() + repeatHours);
        }
      } else {
        // eveniment normal între time și end
        events.push({
          id: `${rem._id}-${+startTime}`,
          title: rem.text,
          start: startTime,
          end: endTime,
        });
      }
    };

    // DAILY
    if (rem.frequency === "daily" && !doneDates.includes(dateStr)) {
      pushEventsForDay();
    }

    // WEEKLY (array de coduri zile)
    if (
      Array.isArray(rem.frequency) &&
      rem.frequency.includes(dayToCode(day))
    ) {
      if (!doneDates.includes(dateStr)) pushEventsForDay();
    }

    // MONTHLY (ex: "15 monthly")
    if (
      typeof rem.frequency === "string" &&
      rem.frequency.includes("monthly")
    ) {
      const dayOfMonth = parseInt(rem.frequency, 10);
      if (current.getDate() === dayOfMonth && !doneDates.includes(dateStr)) {
        pushEventsForDay();
      }
    }

    // FIXED DATE (ex: "2025-09-20")
    if (/^\d{4}-\d{2}-\d{2}$/.test(rem.frequency)) {
      const [y, m, d] = rem.frequency.split("-").map(Number);
      if (
        current.getFullYear() === y &&
        current.getMonth() === m - 1 &&
        current.getDate() === d &&
        !doneDates.includes(dateStr)
      ) {
        pushEventsForDay();
      }
    }

    current.setDate(current.getDate() + 1);
  }

  return events;
}

// helper pentru a converti day numeric -> cod zi (0=Su,..)
function dayToCode(dayNum) {
  const map = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  return map[dayNum];
}
