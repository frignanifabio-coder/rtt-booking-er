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
                onClick={() =>
                  setSelectedDay(day)
                }
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
                <span>{day}</span>

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
    marginBottom: 20,
    paddingBottom: 14,
    borderBottom: "1px solid #e2e8f0",
  }}
>
  <div
    style={{
      fontSize: 13,
      fontWeight: 700,
      color: "#64748b",
      textTransform: "uppercase",
      letterSpacing: ".08em",
    }}
  >
    R.O.A.D
  </div>

  <h2
    style={{
      margin: "8px 0 0 0",
      color: "#0f4c81",
      fontSize: 28,
      fontWeight: 800,
    }}
  >
    📅 {selectedDay}
  </h2>
</div>

            {selectedSlots.length ===
              0 && (
              <p>
                Nessuno slot disponibile.
              </p>
            )}

            {selectedSlots.map(
              (slot) => (
                <div
                  key={slot.id}
                  className="slot-card"
                >
                  <div
  style={{
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
    fontWeight: 600,
  }}
>
  📍 {slot.location || "Da definire"}
</div>

<div
  style={{
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  }}
>
  🕒 {slot.start_time} - {slot.end_time}
</div>

{slot.note && (
  <div
    style={{
      marginBottom: 10,
    }}
  >
    📝 {slot.note}
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
        📅 Intervento selezionato
      </div>

      <div>
        Data: {slot.date}
      </div>

      <div>
        Orario: {slot.start_time} - {slot.end_time}
      </div>

      <div>
        Luogo: {slot.location || "Da definire"}
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