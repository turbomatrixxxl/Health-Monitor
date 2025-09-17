import { useState, useMemo, useEffect } from "react";
import { usePrivate } from "../../hooks/usePrivate";
import {
  addEditReminder,
  deleteReminder,
} from "../../redux/private/operationsPrivate";
import { Link } from "react-router-dom";
import createEventFromReminder from "../../Utils/createEventFromReminder";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import AlertForm from "../../components/AlertForm/AlertForm";
import clsx from "clsx";
import styles from "./AlertsPage.module.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

export default function AlertsPage() {
  const { user, privateDispatch } = usePrivate();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    text: "",
    time: "",
    frequency: "daily",
    repeat: "noRepeat",
    end: "23:00",
    type: "alert",
    active: false,
    doneDates: [],
  });

  const reminders = useMemo(
    () => [...(user.reminders || [])],
    [user.reminders]
  );
  const [events, setEvents] = useState([]);

  const handleAddEditReminder = (reminderData) =>
    privateDispatch(addEditReminder(reminderData));

  const handleSetData = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleCloseFormModal = () => {
    setShowForm(false);
    setEditId(null);
    setFormData({
      text: "",
      time: "",
      frequency: "daily",
      repeat: "noRepeat",
      end: "23:00",
      type: "alert",
      active: false,
      doneDates: [],
    });
  };

  const handleSubmitFormReminder = (reminderData) => {
    if (!reminderData.text || !reminderData.time) {
      alert("Please enter a reminder text and time.");
      return;
    }
    handleAddEditReminder({ ...reminderData, id: editId || undefined });
    handleCloseFormModal();
  };

  const handleActiveTrue = (id) =>
    reminders.forEach(
      (r) =>
        r._id === id && handleAddEditReminder({ ...r, id: r._id, active: true })
    );

  const handleActiveFalse = (id) =>
    reminders.forEach(
      (r) =>
        r._id === id &&
        handleAddEditReminder({ ...r, id: r._id, active: false })
    );

  const handleDoneForToday = (id) =>
    reminders.forEach((r) => {
      if (r._id === id) {
        const doneDates = r.doneDates ? [...r.doneDates] : [];
        const now = new Date();

        const nowStr =
          now
            .toLocaleDateString("ro-RO", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })
            .split(".")
            .reverse()
            .join("-") +
          ` ${String(now.getHours()).padStart(2, "0")}:${String(
            now.getMinutes()
          ).padStart(2, "0")}`;

        if (!doneDates.includes(nowStr)) doneDates.push(nowStr);
        handleAddEditReminder({ ...r, id: r._id, doneDates });
      }
    });

  const handleGo = (id) =>
    reminders.forEach((r) => (r._id === id ? handleDoneForToday(id) : null));

  const handleDeleteReminder = (id) => privateDispatch(deleteReminder({ id }));

  // ==== rerender automat la fiecare ora ====
  useEffect(() => {
    const interval = setInterval(() => {
      setEvents((prev) => [...prev]); // forțează rerender calendar
      setFormData((f) => ({ ...f })); // forțează rerender lista reminders
    }, 3600000); // 1 oră = 3600000ms

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.cont}>
      {showForm && (
        <AlertForm
          onClose={handleCloseFormModal}
          handleSubmit={handleSubmitFormReminder}
          data={formData}
          handleSet={handleSetData}
          editId={editId}
        />
      )}

      <div className={styles.leftSideCont}>
        <div className={styles.headerBox}>
          <h1 className={styles.title}>Calendar</h1>
          <button onClick={() => setShowForm(true)} className={styles.addBtn}>
            + Add Reminder
          </button>
        </div>

        <div className={styles.calendarBox}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            className={styles.calendar}
            defaultView="week"
            defaultDate={new Date()}
            onRangeChange={(range) => {
              let viewStart, viewEnd;
              if (Array.isArray(range)) {
                viewStart = range[0];
                viewEnd = range[range.length - 1];
              } else {
                viewStart = range.start;
                viewEnd = range.end;
              }
              const todayLocal = new Date();
              todayLocal.setHours(0, 0, 0, 0);

              const newEvents = reminders
                .filter((r) => r.active)
                .flatMap((r) => createEventFromReminder(r, viewStart, viewEnd))
                .filter((event) => event.start >= todayLocal);
              setEvents(newEvents);
            }}
          />
        </div>
      </div>

      <div className={styles.rightSideCont}>
        <h1 className={clsx(styles.title, styles.rightSideTitle)}>Reminders</h1>
        <ul className={styles.remindersList}>
          {reminders.map((rem) => {
            const now = new Date();

            const nowStr =
              now
                .toLocaleDateString("ro-RO", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })
                .split(".")
                .reverse()
                .join("-") +
              ` ${String(now.getHours()).padStart(2, "0")}:${String(
                now.getMinutes()
              ).padStart(2, "0")}`;

            // verificăm dacă reminderul a fost făcut deja la ultima execuție
            const doneToday = rem.doneDates?.some((d) => {
              return d.split(" ")[0] === nowStr.split(" ")[0];
            });

            return (
              !doneToday && (
                <li key={`alerts-${rem._id}`} className={styles.reminderItem}>
                  {rem.type === "alert" && (
                    <button
                      type="button"
                      className={styles.closeBtn}
                      onClick={() => handleDeleteReminder(rem._id)}
                    >
                      x
                    </button>
                  )}
                  <div className={styles.reminderItemDetailsCont}>
                    <span className={styles.text}>{rem.text} :</span>
                    <div className={styles.timeCont}>
                      <span className={styles.time}>{rem.time}</span>/
                      <span className={styles.repeat}>
                        {Array.isArray(rem.frequency)
                          ? rem.frequency.join(",")
                          : rem.frequency}
                      </span>
                      {rem.repeat !== "noRepeat" && (
                        <span className={styles.repeat}>/{rem.repeat}</span>
                      )}
                    </div>
                  </div>

                  <div className={styles.actions}>
                    <div className={styles.insideActions}>
                      <button
                        className={clsx(
                          rem.active ? styles.stopBtn : styles.startBtn
                        )}
                        onClick={() =>
                          rem.active
                            ? handleActiveFalse(rem._id)
                            : handleActiveTrue(rem._id)
                        }
                      >
                        {rem.active ? "Stop" : "Start"}
                      </button>
                      {rem.link && rem.active && !doneToday && (
                        <Link className={styles.link} to={rem.link}>
                          <button
                            className={styles.goBtn}
                            onClick={() => handleGo(rem._id)}
                          >
                            Go
                          </button>
                        </Link>
                      )}
                    </div>

                    <div className={styles.insideActions}>
                      {rem.active && (
                        <button
                          className={styles.doneBtn}
                          onClick={() => handleDoneForToday(rem._id)}
                        >
                          Done
                        </button>
                      )}
                      <button
                        className={styles.editBtn}
                        onClick={() => {
                          setShowForm(true);
                          setFormData({
                            ...rem,
                            doneDates: rem.doneDates || [],
                          });
                          setEditId(rem._id);
                        }}
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </li>
              )
            );
          })}
        </ul>
      </div>
    </div>
  );
}
