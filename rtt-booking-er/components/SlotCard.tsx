type Slot = {
  id: string;
  date: string;
  booked: boolean;
};

interface CalendarProps {
  slots: Slot[];
}

export default function Calendar({ slots }: CalendarProps) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: 16,
        padding: 24,
        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
      }}
    >
      <h2
        style={{
          color: "#2563eb",
          marginBottom: 20,
        }}
      >
        Calendario RTT
      </h2>

      <p>
        Slot caricati: <strong>{slots.length}</strong>
      </p>

      <div
        style={{
          display: "flex",
          gap: 12,
          marginTop: 20,
        }}
      >
        <div>🔵 Disponibile</div>
        <div>🔴 Occupato</div>
      </div>
    </div>
  );
}