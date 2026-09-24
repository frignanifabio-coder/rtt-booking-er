import { supabaseAdmin } from "@/lib/supabase-admin";
import Link from "next/link";
import { cancelBooking } from "@/app/admin/actions";

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {

  const { id } = await params;

  const { data: booking } =
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
      .eq("id", id)
      .single();

  if (!booking) {
    return (
      <div style={{ padding: 40 }}>
        Prenotazione non trovata
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "40px auto",
        padding: 20,
      }}
    >
      <h1>Dettaglio prenotazione</h1>

      <p><strong>Società:</strong> {booking.societa}</p>
      <p><strong>Referente:</strong> {booking.referente}</p>
      <p><strong>Email:</strong> {booking.email}</p>
      <p><strong>Telefono:</strong> {booking.telefono}</p>
      <p><strong>Categoria:</strong> {booking.categoria}</p>
      <p><strong>Annata:</strong> {booking.annata}</p>
      <p><strong>Intervento:</strong> {booking.tipo_intervento}</p>
      <p><strong>Focus:</strong> {booking.focus_tecnico}</p>
      <p><strong>Note:</strong> {booking.note}</p>

      <hr />

      <p><strong>Data:</strong> {booking.availability?.date}</p>

      <p>
        <strong>Orario:</strong>{" "}
        {booking.availability?.start_time}
        {" - "}
        {booking.availability?.end_time}
      </p>

      <p>
        <strong>Luogo:</strong>{" "}
        {booking.availability?.location}
      </p>

      <div
        style={{
          display: "flex",
          gap: 12,
          marginTop: 20,
        }}
      >
        <Link href={`/admin/booking/${booking.id}/edit`}>
          <button>✏️ Modifica</button>
        </Link>
        <form action={cancelBooking}>
  <input
    type="hidden"
    name="bookingId"
    value={booking.id}
  />

<button
  type="submit"
  style={{
    background: "#dc2626",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: 10,
    cursor: "pointer",
  }}
>
  ❌ Annulla prenotazione
</button>
</form>

        <Link href="/admin">
          <button>← Torna Admin</button>
        </Link>
      </div>
    </div>
  );
}