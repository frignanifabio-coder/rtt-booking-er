
"use server";

import { supabaseAdmin } from "@/lib/supabase-admin";
import { resend } from "@/lib/resend";

const ADMIN_EMAIL = "frignanifabio@gmail.com";
const EMAIL_FROM = "onboarding@resend.dev";

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function updateNotification(
  bookingId: string,
  channel: string,
  values: Record<string, unknown>
) {
  const { error } = await supabaseAdmin
    .from("booking_notifications")
    .update({
      ...values,
      updated_at: new Date().toISOString(),
    })
    .eq("booking_id", bookingId)
    .eq("channel", channel);

  if (error) {
    console.error(
      `Errore aggiornamento notifica ${channel}:`,
      error.message
    );
  }
}

export async function submitBooking(data: any) {
  // 1. Registrazione della prenotazione
  const { data: bookingId, error } = await supabaseAdmin.rpc(
    "book_rtt_slot",
    data
  );

  if (error) {
    throw new Error(error.message);
  }

  if (!bookingId) {
    throw new Error("Prenotazione non restituita dal database.");
  }

  const bookingCode = `ROAD-${bookingId
    .slice(0, 6)
    .toUpperCase()}`;

  const now = new Date().toISOString();

  // 2. Preparazione delle tre notifiche
  const notifications = [
    {
      booking_id: bookingId,
      channel: "internal",
      recipient: "Dashboard amministrativa",
      subject: "Nuova prenotazione ROAD-ER",
      status: "delivered",
      delivered_at: now,
    },
    {
      booking_id: bookingId,
      channel: "admin_email",
      recipient: ADMIN_EMAIL,
      subject: "🏀 Nuova richiesta ROAD-ER",
      status: "pending",
    },
    {
      booking_id: bookingId,
      channel: "society_email",
      recipient: data.p_email,
      subject: "✅ Richiesta ROAD-ER ricevuta",
      status: "pending",
    },
  ];

  const { error: notificationError } = await supabaseAdmin
    .from("booking_notifications")
    .upsert(notifications, {
      onConflict: "booking_id,channel",
    });

  if (notificationError) {
    console.error(
      "Errore registrazione notifiche:",
      notificationError.message
    );
  }

  // 3. Preparazione dei dati delle email
  const societa = escapeHtml(data.p_societa);
  const codiceFip = escapeHtml(data.p_codice_fip);
  const referente = escapeHtml(data.p_referente);
  const email = escapeHtml(data.p_email);
  const telefono = escapeHtml(data.p_telefono);
  const slot = escapeHtml(data.p_slot_id);

  // 4. Invio indipendente delle email
  async function sendNotification(
    channel: "admin_email" | "society_email",
    recipient: string,
    subject: string,
    html: string
  ) {
    try {
      const result = await resend.emails.send({
        from: EMAIL_FROM,
        to: [recipient],
        subject,
        html,
      });

      if (result.error) {
        console.error(
          `Resend ${channel}:`,
          result.error
        );

        await updateNotification(bookingId, channel, {
          status: "failed",
          attempts: 1,
          error_message: JSON.stringify(result.error),
        });

        return;
      }

      await updateNotification(bookingId, channel, {
        status: "sent",
        attempts: 1,
        sent_at: new Date().toISOString(),
        error_message: null,
      });
    } catch (mailError) {
      console.error(`EMAIL ERROR ${channel}:`, mailError);

      await updateNotification(bookingId, channel, {
        status: "failed",
        attempts: 1,
        error_message:
          mailError instanceof Error
            ? mailError.message
            : String(mailError),
      });
    }
  }

  // 5. Email amministrativa al tuo Gmail
  const adminHtml = `
    <h2>Nuova richiesta ROAD-ER</h2>
    <hr />
    <p><strong>Codice:</strong> ${bookingCode}</p>
    <p><strong>Società:</strong> ${societa}</p>
    <p><strong>Codice FIP:</strong> ${codiceFip}</p>
    <p><strong>Referente:</strong> ${referente}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Telefono:</strong> ${telefono}</p>
    <p><strong>Slot:</strong> ${slot}</p>
    <hr />
    <p>Prenotazione registrata correttamente.</p>
  `;

  // 6. Email di conferma alla società
  const societyHtml = `
    <div style="max-width:600px;font-family:Arial,sans-serif;margin:auto;">
      <h1 style="color:#0f4c81;">ROAD-ER</h1>

      <p>Gentile <strong>${referente}</strong>,</p>

      <p>la richiesta è stata registrata correttamente.</p>

      <div style="background:#eff6ff;padding:16px;border-radius:12px;">
        <p><strong>Codice prenotazione:</strong> ${bookingCode}</p>
        <p><strong>Società:</strong> ${societa}</p>
        <p><strong>Telefono:</strong> ${telefono}</p>
        <p><strong>Email:</strong> ${email}</p>
      </div>

      <p style="margin-top:20px;">
        Riceverai eventuali comunicazioni dal Comitato Regionale.
      </p>

      <hr />
      <p style="color:#64748b;">ROAD-ER · FIP Emilia-Romagna</p>
    </div>
  `;

  await Promise.all([
    sendNotification(
      "admin_email",
      ADMIN_EMAIL,
      "🏀 Nuova richiesta ROAD-ER",
      adminHtml
    ),
    sendNotification(
      "society_email",
      data.p_email,
      "✅ Richiesta ROAD-ER ricevuta",
      societyHtml
    ),
  ]);

  // 7. Restituzione dei dati alla pagina di prenotazione
  return {
    bookingId,
    bookingCode,
  };
}
