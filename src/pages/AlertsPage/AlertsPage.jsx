import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import createEventFromReminder from "../../Utils/createEventFromReminder";

import "react-big-calendar/lib/css/react-big-calendar.css";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";

import AlertForm from "../../components/AlertForm/AlertForm";

import clsx from "clsx";

import styles from "./AlertsPage.module.css";

const localizer = momentLocalizer(moment);

export default function AlertsPage() {
  const [events, setEvents] = useState([]);

  const [reminders, setReminders] = useState([
    {
      id: 1,
      text: "Take breakfast",
      time: "08:00",
      frequency: "daily",
      repeat: "noRepeat",
      end: "10:00",
      type: "meal",
      active: false,
      done: false,
    },
    {
      id: 2,
      text: "Take lunch",
      time: "12:00",
      frequency: "daily",
      repeat: "noRepeat",
      end: "14:00",
      type: "meal",
      active: false,
      done: false,
    },
    {
      id: 3,
      text: "Take dinner",
      time: "05:00",
      frequency: "daily",
      repeat: "noRepeat",
      end: "19:00",
      type: "meal",
      active: false,
      done: false,
    },
    {
      id: 4,
      text: "Go to sleep",
      time: "22:00",
      frequency: "daily",
      repeat: "noRepeat",
      end: "00:00",
      type: "sleep",
      active: false,
      done: false,
    },
    {
      id: 5,
      text: "Wake up",
      time: "06:00",
      frequency: "daily",
      repeat: "noRepeat",
      end: "07:00",
      type: "sleep",
      active: false,
      done: false,
    },
    {
      id: 6,
      text: "Do physical activities",
      time: "09:00",
      frequency: "Mo,We,Fri",
      repeat: "noRepeat",
      end: "23:00",
      type: "alert",
      active: false,
      done: false,
    },
    {
      id: 7,
      text: "Record Breakfast meal",
      time: "10:00",
      frequency: "daily",
      repeat: "noRepeat",
      end: "23:00",
      type: "meal",
      active: false,
      done: false,
      link: "/diary",
    },
    {
      id: 8,
      text: "Record Lunch meal",
      time: "13:00",
      frequency: "daily",
      repeat: "noRepeat",
      end: "23:00",
      type: "meal",
      active: false,
      done: false,
      link: "/diary",
    },
    {
      id: 9,
      text: "Record Dinner meal",
      time: "19:00",
      frequency: "daily",
      repeat: "noRepeat",
      end: "23:00",
      type: "meal",
      active: false,
      done: false,
      link: "/diary",
    },
    {
      id: 10,
      text: "Record Sleep period",
      time: "19:00",
      frequency: "daily",
      repeat: "noRepeat",
      end: "23:00",
      type: "sleep",
      active: false,
      done: false,
      link: "/sleep",
    },
    {
      id: 11,
      text: "Record Health metrics",
      time: "08:00",
      frequency: "15 monthly",
      repeat: "noRepeat",
      end: "23:00",
      type: "alert",
      active: false,
      done: false,
      link: "/metrix",
    },
    {
      id: 12,
      text: "Record Exercise period",
      time: "18:00",
      frequency: "daily",
      repeat: "noRepeat",
      end: "23:00",
      type: "exercise",
      active: false,
      done: false,
      link: "/physical",
    },
    {
      id: 13,
      text: "Drink water",
      time: "06:00",
      frequency: "daily",
      repeat: "2 hours",
      end: "23:00",
      type: "alert",
      active: false,
      done: false,
    },
  ]);

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
    done: false,
  });

  useEffect(() => {
    console.log("events :", events);
    console.log("editId :", editId);
    console.log("formData :", formData);
  }, [events, editId, formData]);

  const handleGo = (id) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, done: true } : r))
    );
  };

  useEffect(() => {
    const newEvents = reminders
      .filter((r) => r.active)
      .flatMap((r) => createEventFromReminder(r));
    setEvents(newEvents);
  }, [reminders]);

  const handleDone = (id) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, done: true } : r))
    );
  };

  const handleActiveTrue = (id) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, active: true } : r))
    );
  };

  const handleActiveFalse = (id) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, active: false } : r))
    );
  };

  function handleCloseFormModal() {
    setShowForm(false);

    setFormData({
      text: "",
      time: "",
      frequency: "daily",
      repeat: "noRepeat",
      end: "23:00",
      type: "alert",
      active: false,
      done: false,
    });

    setEditId(null);
  }

  const handleSubmitFormReminder = (e) => {
    e.preventDefault(); // prevenim refresh

    if (!formData.text || !formData.time) {
      alert("Please enter a reminder text and time.");
      return;
    }
    setReminders((prev) => {
      if (formData.id) {
        // Edit
        return prev.map((r) => (r.id === formData.id ? { ...formData } : r));
      }
      // Add
      return [...prev, { ...formData, id: Date.now() }];
    });

    setFormData({
      text: "",
      time: "",
      frequency: "daily",
      repeat: "noRepeat",
      end: "23:00",
      type: "alert",
      active: false,
      done: false,
    });

    setEditId(null);

    setShowForm(false);
  };

  const handleSetData = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

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
          <button
            onClick={() => {
              setShowForm(true);
            }}
            className={styles.addBtn}
          >
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
            defaultDate={new Date()} // data curentă
            min={new Date()}
          />
        </div>
      </div>

      {/* Reminders section */}
      <div className={styles.rightSideCont}>
        <h1 className={clsx(styles.title, styles.rightSideTitle)}>Reminders</h1>
        <ul className={styles.remindersList}>
          {reminders.map((rem) => (
            <li key={`alerts-${rem.id}`} className={styles.reminderItem}>
              <div className={styles.reminderItemDetailsCont}>
                <span className={styles.text}>{rem.text} :</span>
                <div className={styles.timeCont}>
                  <span className={styles.time}>{rem.time}</span>/
                  <span className={styles.repeat}>{rem.frequency}</span>
                  {rem.repeat !== "noRepeat" && (
                    <span className={styles.repeat}>/{rem.repeat}</span>
                  )}
                </div>
              </div>
              <div className={styles.actions}>
                {rem.active ? (
                  <button
                    className={styles.stopBtn}
                    onClick={() => handleActiveFalse(rem.id)}
                  >
                    Stop
                  </button>
                ) : (
                  <button
                    className={styles.startBtn}
                    onClick={() => handleActiveTrue(rem.id)}
                  >
                    Start
                  </button>
                )}

                {rem.link && rem.active && !rem.done && (
                  <Link className={styles.link} to={rem.link}>
                    <button
                      className={styles.goBtn}
                      onClick={() => handleGo(rem.id)}
                    >
                      Go
                    </button>
                  </Link>
                )}

                {rem.active && !rem.done && (
                  <button
                    className={styles.doneBtn}
                    onClick={() => handleDone(rem.id)}
                  >
                    Done
                  </button>
                )}

                {rem.active && rem.done && (
                  <span className={styles.doneLabel}>✓ Done</span>
                )}

                <button
                  className={styles.editBtn}
                  onClick={() => {
                    setShowForm(true);
                    setFormData({ ...rem });
                    setEditId(rem.id);
                  }}
                >
                  Edit
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
