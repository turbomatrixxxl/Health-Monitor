// Funcție helper pentru a genera date pentru calendar
export default function createEventFromReminder(rem) {
  if (!rem.active) return []; // doar active

  const [hour, minute] = rem.time.split(":").map(Number);
  const [endHour, endMinute] = rem.end
    ? rem.end.split(":").map(Number)
    : [hour + 1, minute];

  const today = new Date();
  const events = [];

  switch (rem.frequency) {
    case "daily":
      {
        const start = new Date(today);
        start.setHours(hour, minute, 0, 0);
        const end = new Date(today);
        end.setHours(endHour, endMinute, 0, 0);
        events.push({ id: rem.id, title: rem.text, start, end });
      }
      break;

    case "weekly":
      {
        const daysMap = { Mo: 1, Tu: 2, We: 3, Th: 4, Fr: 5, Sa: 6, Su: 0 };
        const days = rem.frequency.split(",");
        days.forEach((day) => {
          const start = new Date(today);
          start.setDate(
            today.getDate() + ((7 + daysMap[day] - today.getDay()) % 7)
          );
          start.setHours(hour, minute, 0, 0);
          const end = new Date(start);
          end.setHours(endHour, endMinute, 0, 0);
          events.push({ id: `${rem.id}-${day}`, title: rem.text, start, end });
        });
      }
      break;

    default:
      // monthly
      if (rem.frequency.includes("monthly")) {
        const dayOfMonth = parseInt(rem.frequency);
        const start = new Date(
          today.getFullYear(),
          today.getMonth(),
          dayOfMonth,
          hour,
          minute
        );
        const end = new Date(
          today.getFullYear(),
          today.getMonth(),
          dayOfMonth,
          endHour,
          endMinute
        );
        events.push({ id: rem.id, title: rem.text, start, end });
      } else if (/^\d{4}-\d{2}-\d{2}$/.test(rem.frequency)) {
        const [y, m, d] = rem.frequency.split("-").map(Number);
        const start = new Date(y, m - 1, d, hour, minute);
        const end = new Date(y, m - 1, d, endHour, endMinute);
        events.push({ id: rem.id, title: rem.text, start, end });
      }
      break;
  }

  return events;
}
