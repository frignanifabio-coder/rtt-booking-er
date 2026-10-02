"use server";

import { supabaseAdmin } from "@/lib/supabase-admin";
import { resend } from "@/lib/resend";

export async function submitBooking(data: any) {

const {
  data: bookingId,
  error,
} = await supabaseAdmin.rpc(
  "book_rtt_slot",
  data
);

  if (error) {
    throw new Error(error.message);
  }
  const bookingCode =
  `ROAD-${bookingId
    .slice(0, 6)
    .toUpperCase()}`;

  try {

  await resend.emails.send({
    from: "onboarding@resend.dev",

    to: [
      "fabio.frignani@fipcrer.it",
    ],

    subject: "🏀 Nuova richiesta ROAD-ER",

    html: `
      <h2>Nuova richiesta ROAD-ER</h2>

      <hr />

      <p><strong>Società:</strong> ${data.p_societa}</p>

      <p><strong>Codice FIP:</strong> ${data.p_codice_fip}</p>

      <p><strong>Referente:</strong> ${data.p_referente}</p>

      <p><strong>Email:</strong> ${data.p_email}</p>

      <p><strong>Telefono:</strong> ${data.p_telefono}</p>

      <p><strong>Slot:</strong> ${data.p_slot_id}</p>

      <hr />

      <p>
        Prenotazione registrata correttamente.
      </p>
    `,
  });

  await resend.emails.send({
    from: "onboarding@resend.dev",

    to: data.p_email,

    subject: "✅ Richiesta ROAD-ER ricevuta",

    html: `
      <div
        style="
          max-width:600px;
          font-family:Arial,sans-serif;
          margin:auto;
        "
      >
        <h1 style="color:#0f4c81;">
          ROAD-ER
        </h1>

        <p>
          Gentile
          <strong>${data.p_referente}</strong>,
        </p>

        <p>
          la richiesta è stata registrata
          correttamente.
        </p>

        <div
          style="
            background:#eff6ff;
            padding:16px;
            border-radius:12px;
          "
        >
          <p>
            <strong>Società:</strong>
            ${data.p_societa}
          </p>

          <p>
            <strong>Telefono:</strong>
            ${data.p_telefono}
          </p>

          <p>
            <strong>Email:</strong>
            ${data.p_email}
          </p>
        </div>

        <p style="margin-top:20px;">
          Riceverai eventuali comunicazioni
          dal Comitato Regionale.
        </p>

        <hr />

        <p style="color:#64748b;">
          ROAD-ER · FIP Emilia-Romagna
        </p>
      </div>
    `,
  });

} catch (mailError) {

  console.error(
    "EMAIL ERROR:",
    JSON.stringify(mailError, null, 2)
  );
}

return {
  bookingId,
  bookingCode,
};

}