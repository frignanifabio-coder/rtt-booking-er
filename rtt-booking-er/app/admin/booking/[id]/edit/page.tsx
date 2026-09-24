import { supabaseAdmin } from "@/lib/supabase-admin";
import { updateBooking } from "@/app/admin/actions";


export default async function EditBookingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {

  const { id } = await params;

  const { data: booking } =
    await supabaseAdmin
      .from("bookings")
      .select("*")
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
        maxWidth: 800,
        margin: "40px auto",
        padding: 20,
      }}
    >
      <h1>Modifica prenotazione</h1>

      <form action={updateBooking}>
        <input
  type="hidden"
  name="bookingId"
  value={booking.id}
/>

<div
  style={{
    marginBottom: 20,
  }}
>
  <label
    style={{
      display: "block",
      fontWeight: 600,
      marginBottom: 6,
    }}
  >
    Società
  </label>

  <input
    name="societa"
    defaultValue={booking.societa}
    style={{
      width: "100%",
      padding: 10,
      border: "1px solid #d1d5db",
      borderRadius: 8,
    }}
  />
</div>

        <br /><br />

        <div
  style={{
    marginBottom: 20,
  }}
>
  <label
    style={{
      display: "block",
      fontWeight: 600,
      marginBottom: 6,
    }}
  >
    Referente
  </label>

  <input
    name="referente"
    defaultValue={booking.referente}
    style={{
      width: "100%",
      padding: 10,
      border: "1px solid #d1d5db",
      borderRadius: 8,
    }}
  />
</div>

        <br /><br />

        <div
  style={{
    marginBottom: 20,
  }}
>
  <label
    style={{
      display: "block",
      fontWeight: 600,
      marginBottom: 6,
    }}
  >
    Email
  </label>

  <input
    name="email"
    defaultValue={booking.email}
    style={{
      width: "100%",
      padding: 10,
      border: "1px solid #d1d5db",
      borderRadius: 8,
    }}
  />
</div>

        <br /><br />

        <div
  style={{
    marginBottom: 20,
  }}
>
  <label
    style={{
      display: "block",
      fontWeight: 600,
      marginBottom: 6,
    }}
  >
    Telefono
  </label>

  <input
    name="telefono"
    defaultValue={booking.telefono}
    style={{
      width: "100%",
      padding: 10,
      border: "1px solid #d1d5db",
      borderRadius: 8,
    }}
  />
</div>

        <br /><br />

        <div
  style={{
    marginBottom: 20,
  }}
>
  <label
    style={{
      display: "block",
      fontWeight: 600,
      marginBottom: 6,
    }}
  >
    Categoria
  </label>

  <input
    name="categoria"
    defaultValue={booking.categoria}
    style={{
      width: "100%",
      padding: 10,
      border: "1px solid #d1d5db",
      borderRadius: 8,
    }}
  />
</div>

        <br /><br />

        <div
  style={{
    marginBottom: 20,
  }}
>
  <label
    style={{
      display: "block",
      fontWeight: 600,
      marginBottom: 6,
    }}
  >
    Annata
  </label>

  <input
    name="annata"
    defaultValue={booking.annata}
    style={{
      width: "100%",
      padding: 10,
      border: "1px solid #d1d5db",
      borderRadius: 8,
    }}
  />
</div>

        <br /><br />

        <div style={{ marginBottom: 20 }}>
  <label
    style={{
      display: "block",
      fontWeight: 600,
      marginBottom: 6,
    }}
  >
    Focus tecnico
  </label>

  <textarea
    name="focus_tecnico"
    defaultValue={booking.focus_tecnico}
    rows={4}
    style={{
      width: "100%",
      padding: 10,
      border: "1px solid #d1d5db",
      borderRadius: 8,
    }}
  />
</div>

        <br /><br />

       <div style={{ marginBottom: 20 }}>
  <label
    style={{
      display: "block",
      fontWeight: 600,
      marginBottom: 6,
    }}
  >
    Note
  </label>

  <textarea
    name="note"
    defaultValue={booking.note}
    rows={4}
    style={{
      width: "100%",
      padding: 10,
      border: "1px solid #d1d5db",
      borderRadius: 8,
    }}
  />
</div>

        <br /><br />

        <button type="submit">
          💾 Salva modifiche
        </button>

      </form>
    </div>
  );
}