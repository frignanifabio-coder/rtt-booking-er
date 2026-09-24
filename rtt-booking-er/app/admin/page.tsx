export const dynamic = "force-dynamic";

import { supabaseAdmin } from "@/lib/supabase-admin";
import Link from "next/link";
import DeleteSlotButton from "@/components/DeleteSlotButton";

export default async function AdminPage() {

  const { data: bookings } =
  await supabaseAdmin
    .from("bookings")
    .select(`
      *,
      availability (
        date,
        start_time,
        end_time,
        location
      )
    `)
    .order("created_at", {
      ascending: false,
    });
  const { data: slots } =
  await supabaseAdmin
    .from("availability")
    .select("*")
    .order("date", {
      ascending: true,
    });
  console.log("BOOKINGS:", bookings);
  console.log(
  JSON.stringify(bookings, null, 2)
);
  
  return (
    <div
      style={{
        maxWidth: 1400,
        margin: "40px auto",
        padding: 20,
      }}
    >
      <h1
        style={{
          color: "#2563eb",
          marginBottom: 20,
        }}
      >
        RTT Booking ER - Admin
      </h1>
      <div
  style={{
    marginBottom: 20,
  }}
>
<Link href="/admin/new-slot">
  <button
    style={{
      background: "#2563eb",
      color: "white",
      border: "none",
      borderRadius: 12,
      padding: "12px 20px",
      fontWeight: 600,
      cursor: "pointer",
      minWidth: 140,
      minHeight: 50,
    }}
  >
    ➕ Nuovo Slot
  </button>
</Link>

<div
  style={{
    display: "flex",
    gap: 16,
    marginBottom: 20,
    flexWrap: "wrap",
  }}
>
  <div style={cardStyle}>
    Prenotazioni
    <br />
    <strong>{bookings?.length || 0}</strong>
  </div>

  <div style={cardStyle}>
    Slot totali
    <br />
    <strong>{slots?.length || 0}</strong>
  </div>

  <div style={cardStyle}>
    Slot prenotati
    <br />
    <strong>{bookings?.length || 0}</strong>
  </div>

  <div style={cardStyle}>
    Slot liberi
    <br />
    <strong>
      {(slots?.length || 0) -
        (bookings?.length || 0)}
    </strong>
  </div>
</div>

</div>

      <div
        style={{
          background: "white",
          borderRadius: 12,
          padding: 20,
          boxShadow:
            "0 2px 10px rgba(0,0,0,.08)",
        }}
      >
        <h2>Prenotazioni ricevute</h2>
        <div
  style={{
    overflowX: "auto",
    marginTop: 20,
  }}
>
  <table
    style={{
      width: "100%",
      borderCollapse: "collapse",
    }}
  >
    <thead>
      <tr
        style={{
          background: "#eff6ff",
        }}
      >
        <th style={thStyle}>Data</th>
        <th style={thStyle}>Società</th>
        <th style={thStyle}>Categoria</th>
        <th style={thStyle}>Referente</th>
        <th style={thStyle}>Stato</th>
      </tr>
    </thead>

    <tbody>
      {bookings?.map((booking) => (
        <tr key={booking.id}>
          <td style={tdStyle}>
  {booking.availability
    ? booking.availability.date
        .split("-")
        .reverse()
        .join("/")
    : "-"}
</td>
          <td style={tdStyle}>
            {booking.societa}
          </td>

          <td style={tdStyle}>
            {booking.categoria}
          </td>

          <td style={tdStyle}>
            {booking.referente}
          </td>

          <td style={tdStyle}>
            <span
              style={{
              background: "#fef3c7",
              color: "#92400e",
              padding: "4px 8px",
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 600,
              }}
            >
             {booking.status}
            </span>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

        <p>
          Totale: {bookings?.length || 0}
        </p>

        
      </div>
<div
  style={{
    marginTop: 30,
    background: "white",
    borderRadius: 12,
    padding: 20,
    boxShadow:
      "0 2px 10px rgba(0,0,0,.08)",
  }}
>
  <h2>Slot disponibili</h2>

  {slots?.map((slot) => {

    const booked =
  bookings?.find(
    (b) =>
      b.availability_id === slot.id &&
      b.status !== "cancelled"
  );

    return (
      <div
        key={slot.id}
        style={{
          border:
            "1px solid #e5e7eb",
          borderRadius: 10,
          padding: 12,
          marginTop: 10,
        }}
      >
        <strong>
          {slot.date}
        </strong>

        {" - "}

        {slot.start_time}
        {" → "}
        {slot.end_time}

        <br />

        {slot.location}

        <br />

        {booked ? (
  <div
    style={{
      color: "#dc2626",
      fontWeight: 700,
      marginTop: 6,
    }}
  >
    🔴 Prenotato da {booked.societa}

    <div
      style={{
        display: "flex",
        gap: 8,
        marginTop: 8,
      }}
    >
      <Link href={`/admin/booking/${booked.id}`}>
        <button>
          👁️ Dettaglio
        </button>
      </Link>

      <Link href={`/admin/booking/${booked.id}/edit`}>
        <button>
          ✏️ Modifica
        </button>
      </Link>
    </div>
  </div>
) : (
  <>
    <div
      style={{
        color: "#16a34a",
        fontWeight: 700,
        marginTop: 6,
      }}
    >
      🟢 Disponibile
    </div>

    <DeleteSlotButton
      slotId={slot.id}
    />
  </>
)}
      </div>
    );
  })}
</div>
</div>
  );
};
  const cardStyle = {
  background: "white",
  borderRadius: 12,
  padding: 16,
  minWidth: 180,
  boxShadow: "0 2px 10px rgba(0,0,0,.08)",
}
const thStyle = {
  textAlign: "left" as const,
  padding: 12,
  borderBottom: "2px solid #dbeafe",
};

const tdStyle = {
  padding: 12,
  borderBottom: "1px solid #e5e7eb",
};