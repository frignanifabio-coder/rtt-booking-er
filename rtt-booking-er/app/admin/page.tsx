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

const freeSlots =
  slots?.filter(
    (slot) =>
      !bookings?.find(
        (b) =>
          b.availability_id === slot.id &&
          b.status !== "cancelled"
      )
  ) || [];
  
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
<div style={{ marginBottom: 30 }}>
  <Link href="/admin/new-slot">
    <button
      style={{
        background: "#383c46",
        color: "white",
        border: "none",
        borderRadius: 14,
        padding: "16px 26px",
        fontWeight: 700,
        cursor: "pointer",
        boxShadow:
          "0 6px 18px rgba(47, 50, 53, 0.41)",
      }}
    >
      + Nuovo Slot
    </button>
  </Link>
</div>

<div
  style={{
    display: "flex",
    gap: 16,
    marginBottom: 20,
    flexWrap: "wrap",
  }}
>


<div
  style={{
    ...cardStyle,
    background: "#2563eb",
    color: "white",
  }}
>


  <div style={{ fontSize: 34, fontWeight: 800 }}>
    {bookings?.length || 0}
  </div>

  <div>Prenotazioni</div>
</div>

<div
  style={{
    ...cardStyle,
    background: "#7c3aed",
    color: "white",
  }}
>
  <div style={{ fontSize: 34, fontWeight: 800 }}>
    {slots?.length || 0}
  </div>

  <div>Slot Totali</div>
</div>

<div
  style={{
    ...cardStyle,
    background: "#f59e0b",
    color: "white",
  }}
>
  <div style={{ fontSize: 34, fontWeight: 800 }}>
    {bookings?.length || 0}
  </div>

  <div>Da Gestire</div>
</div>

<div
  style={{
    ...cardStyle,
    background: "#16a34a",
    color: "white",
  }}
>
  <div style={{ fontSize: 34, fontWeight: 800 }}>
    {(slots?.length || 0) -
      (bookings?.length || 0)}
  </div>

  <div>Slot Liberi</div>
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
<div
  style={{
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fill,minmax(320px,1fr))",
    gap: 16,
    marginTop: 20,
  }}
>
  {bookings?.map((booking) => {

    const bookingCode =
      `ROAD-${booking.id
        .slice(0, 6)
        .toUpperCase()}`;

    return (
      <div
        key={booking.id}
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: 18,
          padding: 18,
          boxShadow:
            "0 4px 14px rgba(0,0,0,.06)",
        }}
      >
        <div
          style={{
            fontSize: 12,
            color: "#64748b",
            marginBottom: 8,
            fontWeight: 700,
          }}
        >
          {bookingCode}
        </div>

        <div
          style={{
            fontSize: 20,
            fontWeight: 800,
            color: "#0f4c81",
            marginBottom: 8,
          }}
        >
          {booking.societa}
        </div>

        <div
          style={{
            color: "#475569",
            marginBottom: 4,
          }}
        >
          👤 {booking.referente}
        </div>

        <div
          style={{
            color: "#475569",
            marginBottom: 4,
          }}
        >
          🏀 {booking.categoria || "-"}
        </div>

        <div
          style={{
            color: "#475569",
            marginBottom: 12,
          }}
        >
          📅 {booking.availability
            ? booking.availability.date
                .split("-")
                .reverse()
                .join("/")
            : "-"}
              <div
  style={{
    color: "#475569",
    marginBottom: 4,
  }}
>
  ⏰ {booking.availability?.start_time}
  {" → "}
  {booking.availability?.end_time}
</div>

<div
  style={{
    color: "#475569",
    marginBottom: 12,
  }}
>
  📍 {booking.availability?.location || "-"}
</div>

        </div>

        <div
          style={{
            display: "inline-block",
            background: "#fef3c7",
            color: "#92400e",
            padding: "6px 12px",
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          🟡 Richiesta ricevuta
        </div>

        <div
          style={{
            marginTop: 16,
          }}
        >
<Link
  href={`/admin/booking/${booking.id}`}
  style={{
    background: "#2563eb",
    color: "white",
    borderRadius: 10,
    padding: "10px 14px",
    textDecoration: "none",
    fontWeight: 600,
    display: "inline-block",
  }}
>
  👁️ Dettaglio
</Link>
<Link
  href={`/admin/booking/${booking.id}/edit`}
  style={{
    background: "#f59e0b",
    color: "white",
    borderRadius: 10,
    padding: "10px 14px",
    textDecoration: "none",
    fontWeight: 600,
    display: "inline-block",
  }}
>
  ✏️ Modifica
</Link>

        </div>
      </div>
    );
  })}
</div>
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

  {freeSlots.map((slot) => {

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