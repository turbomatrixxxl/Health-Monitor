// Utils/createEventFromReminder.js
export default function createEventFromReminder(rem, viewStart, viewEnd) {
  if (!rem.active) return [];

  const [hour, minute] = rem.time.split(":").map(Number);
  const [endHour, endMinute] = rem.end
    ? rem.end.split(":").map(Number)
    : [hour + 1, minute];

  const events = [];
  const doneDates = rem.doneDates || [];

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

    if (doneDates.includes(dateStr)) {
      current.setDate(current.getDate() + 1);
      continue; // sărim peste zilele deja făcute
    }

    // DAILY
    if (rem.frequency === "daily") {
      const start = new Date(current);
      start.setHours(hour, minute, 0, 0);
      const end = new Date(current);
      end.setHours(endHour, endMinute, 0, 0);
      events.push({ id: `${rem._id}-${+start}`, title: rem.text, start, end });
    }

    // WEEKLY
    if (Array.isArray(rem.frequency)) {
      const daysMap = { Su: 0, Mo: 1, Tu: 2, We: 3, Th: 4, Fr: 5, Sa: 6 };
      rem.frequency.forEach((dayCode) => {
        if (daysMap[dayCode] === day) {
          const start = new Date(current);
          start.setHours(hour, minute, 0, 0);
          const end = new Date(current);
          end.setHours(endHour, endMinute, 0, 0);
          events.push({
            id: `${rem._id}-${dayCode}-${+start}`,
            title: rem.text,
            start,
            end,
          });
        }
      });
    }

    // MONTHLY
    if (
      typeof rem.frequency === "string" &&
      rem.frequency.includes("monthly")
    ) {
      const dayOfMonth = parseInt(rem.frequency, 10);
      if (current.getDate() === dayOfMonth) {
        const start = new Date(current);
        start.setHours(hour, minute, 0, 0);
        const end = new Date(current);
        end.setHours(endHour, endMinute, 0, 0);
        events.push({
          id: `${rem._id}-m-${+start}`,
          title: rem.text,
          start,
          end,
        });
      }
    }

    // FIXED DATE
    if (/^\d{4}-\d{2}-\d{2}$/.test(rem.frequency)) {
      const [y, m, d] = rem.frequency.split("-").map(Number);
      if (
        current.getFullYear() === y &&
        current.getMonth() === m - 1 &&
        current.getDate() === d
      ) {
        const start = new Date(y, m - 1, d, hour, minute);
        const end = new Date(y, m - 1, d, endHour, endMinute);
        events.push({ id: rem._id, title: rem.text, start, end });
      }
    }

    current.setDate(current.getDate() + 1);
  }

  return events;
}
