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

      <div className="calendar-card">
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
            <h3>
              Giorno {selectedDay}
            </h3>

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
                  <div>
                    📍{" "}
                    {slot.location ||
                      "Da definire"}
                  </div>

                  <div>
                    🕒{" "}
                    {slot.start_time} -{" "}
                    {slot.end_time}
                  </div>

                  {slot.note && (
                    <div>
                      📝 {slot.note}
                    </div>
                  )}

                  <div
                    style={{
                      marginTop: 12,
                      fontWeight: 700,
                      color: slot.booked
                        ? "#dc2626"
                        : "#2563eb",
                    }}
                  >
                    {slot.booked
                      ? "🔴 Occupato"
                      : "🟢 Disponibile"}
                  </div>

                  {!slot.booked && (
                    <BookingForm
                      slotId={slot.id}
                    />
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