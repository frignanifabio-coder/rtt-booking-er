export const dynamic = "force-dynamic";

import { supabaseAdmin } from "@/lib/supabase-admin";
import Link from "next/link";

export default async function BookingDetailPage({
  params,
}: {
  params: { id: string };
}) {

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
      .eq("id", params.id)
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

      <div
        style={{
          background: "white",
          borderRadius: 12,
          padding: 20,
          boxShadow:
            "0 2px 10px rgba(0,0,0,.08)",
        }}
      >
        <p>
          <strong>Società:</strong>{" "}
          {booking.societa}
        </p>

        <p>
          <strong>Referente:</strong>{" "}
          {booking.referente}
        </p>

        <p>
          <strong>Email:</strong>{" "}
          {booking.email}
        </p>

        <p>
          <strong>Telefono:</strong>{" "}
          {booking.telefono}
        </p>

        <p>
          <strong>Categoria:</strong>{" "}
          {booking.categoria}
        </p>

        <p>
          <strong>Annata:</strong>{" "}
          {booking.annata}
        </p>

        <p>
          <strong>Intervento:</strong>{" "}
          {booking.tipo_intervento}
        </p>

        <p>
          <strong>Focus:</strong>{" "}
          {booking.focus_tecnico}
        </p>

        <p>
          <strong>Note:</strong>{" "}
          {booking.note}
        </p>

        <hr />

        <p>
          <strong>Data:</strong>{" "}
          {booking.availability?.date}
        </p>

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
          <Link
            href={`/admin/booking/${booking.id}/edit`}
          >
            <button>
              ✏️ Modifica
            </button>
          </Link>

          <Link href="/admin">
            <button>
              ← Torna Admin
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}