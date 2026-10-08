"use client";

import { useMemo, useState } from "react";
import BookingForm from "@/components/BookingForm";

interface Slot {
  id: string;
  date: string;
  start_time?: string;
  end_time?: string;
  location?: string;
  note?: string;
  booked: boolean;
}

interface CalendarProps {
  slots: Slot[];
  events: any[];
}

const weekDays = [
  "Lun",
  "Mar",
  "Mer",
  "Gio",
  "Ven",
  "Sab",
  "Dom",
];

export default function Calendar({
  slots,
  events,
}: CalendarProps) {
  const [selectedDay, setSelectedDay] =
    useState<number | null>(null);

  const [currentMonth, setCurrentMonth] =
    useState(new Date());

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const daysInMonth = new Date(
    year,
    month + 1,
    0
  ).getDate();

  const firstDay =
    (new Date(year, month, 1).getDay() + 6) % 7;

const monthSlots = slots.filter((slot) => {
  const d = new Date(slot.date);

  return (
    d.getMonth() === month &&
    d.getFullYear() === year
  );
});

const monthEvents = events.filter((event) => {
  const date =
    event.start?.dateTime ||
    event.start?.date;

  if (!date) return false;

  const d = new Date(date);

  return (
    d.getMonth() === month &&
    d.getFullYear() === year
  );
});

  const selectedSlots = useMemo(() => {
    if (!selectedDay) return [];

    return monthSlots.filter((slot) =>
      slot.date.endsWith(
        `-${String(selectedDay).padStart(
          2,
          "0"
        )}`
      )
    );
  }, [selectedDay, monthSlots]);

  const selectedEvents = useMemo(() => {
  if (!selectedDay) return [];

  return monthEvents.filter((event) => {
    const date =
      event.start?.dateTime ||
      event.start?.date;

    if (!date) return false;

    return (
      new Date(date).getDate() ===
      selectedDay
    );
  });
}, [selectedDay, monthEvents]);

const selectedEvent = selectedEvents[0];

const eventDate =
  selectedEvent?.start?.dateTime ||
  selectedEvent?.start?.date;
  
  const cells = [];

  for (let i = 0; i < firstDay; i++) {
    cells.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(day);
  }

  return (
    <div className="calendar-layout">
      {/* CALENDARIO */}

      <div className="calendar-card">
        <div className="calendar-header">
          <button
            className="month-btn"
            onClick={() =>
              setCurrentMonth(
                new Date(
                  year,
                  month - 1,
                  1
                )
              )
            }
          >
            ◀
          </button>

          <h2 className="calendar-title">
            {currentMonth.toLocaleDateString(
              "it-IT",
              {
                month: "long",
                year: "numeric",
              }
            )}
          </h2>

          <button
            className="month-btn"
            onClick={() =>
              setCurrentMonth(
                new Date(
                  year,
                  month + 1,
                  1
                )
              )
            }
          >
            ▶
          </button>
        </div>

        <div className="week-header">
          {weekDays.map((d) => (
            <div
              key={d}
              className="weekday"
            >
              {d}
            </div>
          ))}
        </div>

        <div className="calendar-grid">
          {cells.map((day, index) => {
if (!day) {
  return (
    <div
      key={`empty-${year}-${month}-${index}`}
      className="empty-day"
    />
  );
}

            const daySlots =
              monthSlots.filter((s) =>
                s.date.endsWith(
                  `-${String(day).padStart(
                    2,
                    "0"
                  )}`
                )
              );

const dayEvents =
  monthEvents.filter((event) => {
    const date =
      event.start?.dateTime ||
      event.start?.date;

    if (!date) return false;

    return (
      new Date(date).getDate() === day
    );
  });

            const hasSlot =
              daySlots.length > 0;

            const allBooked =
              hasSlot &&
              daySlots.every(
                (s) => s.booked
              );

            const selected =
              selectedDay === day;

            return (
              <div
                key={`${year}-${month}-${day}`}
onClick={() => {
  setSelectedDay(null);

  setTimeout(() => {
    setSelectedDay(day);
  }, 50);
}}
                className={`day-cell ${
                selected
                ? "selected"
                : allBooked
                ? "occupied"
                : hasSlot
                ? "available-day"
                : ""
                }`}
              >
                <div
  style={{
    display: "flex",
    flexDirection: "column",
    width: "100%",
  }}
>
  <span>{day}</span>

  {dayEvents.length > 0 && (
    <div
      style={{
        marginTop: 6,
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      {dayEvents
        .slice(0, 2)
        .map(
          (
            event: any,
            index: number
          ) => (
            <div
              key={index}
              title={event.summary}
style={{
  background: "#dbeafe",
  color: "#1e40af",
  borderRadius: 999,
  padding: "2px 6px",
  fontSize: 9,
  fontWeight: 700,

  width: "100%",
  maxWidth: "100%",

  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",

  marginTop: 4,
}}
            >
              📌{event.summary.substring(0, 18)}
            </div>
          )
        )}
    </div>
  )}
</div>

                {hasSlot && !allBooked && (
                  <div className="dot available" />
                )}

                {allBooked && (
                  <div className="dot booked" />
                )}
              </div>
            );
          })}
        </div>

        <div className="legend">
          <div>
            <span className="dot available" />
            Disponibile
          </div>

          <div>
            <span className="dot booked" />
            Occupato
          </div>
        </div>
      </div>

      {/* DETTAGLIO */}

      <div className="calendar-card detail-panel">
        {!selectedDay && (
          <>
            <h3>Dettaglio slot</h3>

            <p>
              Seleziona un giorno dal
              calendario.
            </p>
          </>
        )}

        {selectedDay && (
          <>
<div
  style={{
    marginBottom: 24,
    padding: 20,
    borderRadius: 20,
    background:
      "linear-gradient(135deg,#eff6ff,#dbeafe)",
    border: "1px solid #bfdbfe",
  }}
>
{selectedSlots.length > 0 && (
  <>
    <div
      style={{
        fontSize: 13,
        fontWeight: 800,
        color: "#2563eb",
        textTransform: "uppercase",
        letterSpacing: ".08em",
        marginBottom: 12,
      }}
    >
      R.O.A.D.
    </div>

    <h2
  style={{
    margin: 0,
    color: "#0f4c81",
    fontSize: 24,
    fontWeight: 800,
  }}
>
  📅{" "}
  {selectedSlots[0] &&
    new Date(selectedSlots[0].date).toLocaleDateString(
      "it-IT",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    )}
</h2>

    <div
      style={{
        marginTop: 18,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        fontSize: 14,
      }}
    >
      <div>✅ 1. Data selezionata</div>

      <div
        style={{
          color: "#2563eb",
          fontWeight: 700,
        }}
      >
        ➜ 2. Compila la richiesta
      </div>

      <div
        style={{
          color: "#64748b",
        }}
      >
        3. Conferma automatica
      </div>
    </div>
  </>
)}

</div>
{selectedSlots.length === 0 &&
 selectedEvents.length === 0 && (
  <p>
    Nessuno slot disponibile.
  </p>
)}

{selectedEvents.length > 0 && (
<div
  style={{
    marginBottom: 24,
    padding: 20,
    borderRadius: 20,
    background:
      "linear-gradient(135deg,#eff6ff,#dbeafe)",
    border: "1px solid #bfdbfe",
  }}
>
  <div
    style={{
      fontSize: 13,
      fontWeight: 800,
      color: "#2563eb",
      textTransform: "uppercase",
      letterSpacing: ".08em",
      marginBottom: 12,
    }}
  >
    EVENTO REGIONALE
  </div>

  <h2
    style={{
      margin: 0,
      color: "#0f4c81",
      fontSize: 24,
      fontWeight: 800,
    }}
  >
    📅{" "}
    {new Date(eventDate).toLocaleDateString(
      "it-IT",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    )}
  </h2>
</div>
)}

{selectedEvents.map((event, index) => (
  <div
    key={index}
    style={{
      marginBottom: 20,
      padding: 18,
      borderRadius: 18,
      background:
        "linear-gradient(135deg,#eef2ff,#dbeafe)",
      border: "1px solid #93c5fd",
    }}
  >
    <div
      style={{
        fontWeight: 800,
        fontSize: 18,
        color: "#1e40af",
        marginBottom: 10,
      }}
    >
      🏀 Attività Regionale FIP ER
    </div>

    <div
      style={{
        fontWeight: 700,
        marginBottom: 8,
      }}
    >
      <h2
  style={{
    margin: 0,
    fontSize: 24,
    fontWeight: 800,
    color: "#1e3a8a",
  }}
>
  {event.summary}
</h2>
    </div>

    {event.description && (
      <div
        style={{
          color: "#334155",
          lineHeight: 1.6,
          whiteSpace: "pre-wrap",
        }}
      >
        {event.description}
      </div>
    )}
  </div>
))}

            {selectedSlots.map(
              (slot) => (
                <div
                  key={slot.id}
                  className="slot-card"
                >

{slot.note && (
  <div
    style={{
      marginBottom: 16,
      padding: 16,
      borderRadius: 16,
      background:
        "linear-gradient(135deg,#fff7ed,#ffedd5)",
      border: "1px solid #fdba74",
    }}
  >
    <div
      style={{
        fontWeight: 700,
        color: "#c2410c",
        marginBottom: 6,
      }}
    >
      ℹ️ Informazioni per la prenotazione
    </div>

    <div
      style={{
        color: "#7c2d12",
        lineHeight: 1.5,
      }}
    >
      {slot.note}
    </div>
  </div>
)}

{slot.booked ? (
  <div
    style={{
      marginTop: 20,
      padding: 20,
      borderRadius: 18,
      background:
        "linear-gradient(135deg,#fff1f2,#ffe4e6)",
      border: "1px solid #fecdd3",
    }}
  >
    <div
      style={{
        fontWeight: 800,
        color: "#be123c",
        fontSize: 18,
        marginBottom: 8,
      }}
    >
      🔒 Slot già prenotato
    </div>

    <div
      style={{
        color: "#881337",
        fontSize: 14,
      }}
    >
      Questo intervento RTT è già stato assegnato.
    </div>

    <div
      style={{
        marginTop: 12,
        fontSize: 13,
        color: "#9f1239",
      }}
    >
      Seleziona un'altra data disponibile nel calendario.
    </div>
  </div>
) : (
  <>
    <div
      style={{
        marginTop: 16,
        padding: 18,
        borderRadius: 18,
        background:
          "linear-gradient(135deg,#eff6ff,#dbeafe)",
        border: "1px solid #93c5fd",
      }}
    >
      <div
        style={{
          fontWeight: 800,
          color: "#0f4c81",
          marginBottom: 10,
          fontSize: 16,
        }}
      >
        🏀 Richiedi l'intervento RTT
      </div>

      <div
        style={{
          color: "#334155",
          lineHeight: 1.6,
        }}
      >
        Compila il modulo sottostante per
        richiedere l'intervento tecnico
        regionale.
      </div>
    </div>

    <BookingForm
      slotId={slot.id}
    />
  </>
)}

                </div>
              )
            )}
          </>
        )}
      </div>
    </div>
  );
}