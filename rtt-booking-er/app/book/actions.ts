"use server";

import { supabaseAdmin } from "@/lib/supabase-admin";
import { resend } from "@/lib/resend";

export async function submitBooking(data: any) {

  const { error } =
    await supabaseAdmin.rpc(
      "book_rtt_slot",
      data
    );

  if (error) {
    throw new Error(error.message);
  }

  await resend.emails.send({
    from: "onboarding@resend.dev",

    to: [
      "fabio.frignani@fipcrer.it",
      "frignanifabio@gmail.com",
    ],

    subject: "Nuova richiesta RTT",

    html: `
      <h2>Nuova richiesta RTT</h2>

      <p><strong>Società:</strong> ${data.p_societa}</p>
      <p><strong>Referente:</strong> ${data.p_referente}</p>
      <p><strong>Email:</strong> ${data.p_email}</p>
      <p><strong>Telefono:</strong> ${data.p_telefono}</p>
    `,
  });

  await resend.emails.send({
    from: "onboarding@resend.dev",

    to: data.p_email,

    subject: "Richiesta RTT ricevuta",

    html: `
      <h2>Richiesta ricevuta</h2>

      <p>
        Gentile ${data.p_referente},
      </p>

      <p>
        La richiesta è stata registrata correttamente.
      </p>

      <p>
        RTT Booking ER
      </p>
    `,
  });

  return true;
}