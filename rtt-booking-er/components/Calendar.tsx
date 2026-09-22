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

export default function Calendar({ slots }: CalendarProps) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [currentMonth, setCurrentMonth] =
  useState(new Date());

const daysInMonth = new Date(
  currentMonth.getFullYear(),
  currentMonth.getMonth() + 1,
  0
).getDate();

const monthSlots = slots.filter((slot) => {
  const d = new Date(slot.date);

  return (
    d.getMonth() === currentMonth.getMonth() &&
    d.getFullYear() === currentMonth.getFullYear()
  );
});

const selectedSlots = useMemo(() => {
  if (!selectedDay) return [];

  return monthSlots.filter((slot) =>
    slot.date.endsWith(
      `-${String(selectedDay).padStart(2, "0")}`
    )
  );
}, [selectedDay, monthSlots]);

  return (
      <div className="calendar-layout">
      {/* CALENDARIO */}

      <div
        style={{
          background: "white",
          borderRadius: 16,
          padding: 24,
          boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
        }}
      >
        <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  }}
>
  <button
    onClick={() =>
      setCurrentMonth(
        new Date(
          currentMonth.getFullYear(),
          currentMonth.getMonth() - 1,
          1
        )
      )
    }
  >
    ◀
  </button>

  <h2
    style={{
      color: "#2563eb",
      margin: 0,
    }}
  >
    {currentMonth.toLocaleDateString("it-IT", {
      month: "long",
      year: "numeric",
    })}
  </h2>

  <button
    onClick={() =>
      setCurrentMonth(
        new Date(
          currentMonth.getFullYear(),
          currentMonth.getMonth() + 1,
          1
        )
      )
    }
  >
    ▶
  </button>
</div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7,1fr)",
            gap: 8,
          }}
        >
          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1;

            const daySlots = monthSlots.filter(
              (s) =>
                s.date.endsWith(
                  `-${String(day).padStart(2, "0")}`
                )
            );

            const hasSlot = daySlots.length > 0;

            const allBooked =
              hasSlot &&
              daySlots.every((s) => s.booked);

            const selected =
              selectedDay === day;

            return (
              <div
                key={day}
                onClick={() => setSelectedDay(day)}
                style={{
                  cursor: "pointer",
                  border: selected
                    ? "2px solid #2563eb"
                    : "1px solid #dbeafe",
                  borderRadius: 12,
                  padding: 12,
                  minHeight: 70,
                  background: selected
                    ? "#eff6ff"
                    : "#fff",
                }}
              >
                <div>{day}</div>

                {hasSlot && !allBooked && (
                  <div
                    style={{
                      marginTop: 8,
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      background: "#2563eb",
                    }}
                  />
                )}

                {allBooked && (
                  <div
                    style={{
                      marginTop: 8,
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      background: "#ef4444",
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        <div
          style={{
            marginTop: 20,
            display: "flex",
            gap: 20,
          }}
        >
          <div>🔵 Disponibile</div>
          <div>🔴 Occupato</div>
        </div>
      </div>

      {/* DETTAGLIO */}

      <div
        style={{
          background: "white",
          borderRadius: 16,
          padding: 24,
          boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
        }}
      >
        {!selectedDay && (
          <>
            <h3>Dettaglio slot</h3>

            <p>
              Seleziona un giorno dal calendario.
            </p>
          </>
        )}

        {selectedDay && (
          <>
            <h3>
              Giorno {selectedDay}
            </h3>

            {selectedSlots.length === 0 && (
              <p>Nessuno slot disponibile.</p>
            )}

            {selectedSlots.map((slot) => (
              <div
                key={slot.id}
                style={{
                  border: "1px solid #dbeafe",
                  borderRadius: 12,
                  padding: 16,
                  marginTop: 12,
                }}
              >
                <div>
                  📍 {slot.location || "Da definire"}
                </div>

                <div>
                  🕒 {slot.start_time} - {slot.end_time}
                </div>

                <div>
                  📝 {slot.note}
                </div>

                <div
                  style={{
                    marginTop: 12,
                    fontWeight: "bold",
                    color: slot.booked
                      ? "#ef4444"
                      : "#2563eb",
                  }}
                >
                  {slot.booked
                    ? "🔴 Occupato"
                    : "🔵 Disponibile"}
                </div>
                  {!slot.booked && (
                    <BookingForm
                      slotId={slot.id}
                    />
                  )}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}