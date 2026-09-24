"use server";

import { resend } from "@/lib/resend";

export async function sendTestEmail() {

  const { data, error } =
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "frignanifabio@gmail.com",
      subject: "Test RTT Booking ER",
      html: `
        <h1>Email di test</h1>
        <p>Se stai leggendo questa mail, Resend funziona.</p>
      `,
    });

  console.log(data);
  console.log(error);
}