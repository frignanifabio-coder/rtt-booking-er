"use server";

import { supabaseAdmin } from "@/lib/supabase-admin";

export async function markAllNotificationsRead() {
  const { error } = await supabaseAdmin
    .from("booking_notifications")
    .update({ read_at: new Date().toISOString() })
    .is("read_at", null);

  if (error) {
    console.error("Errore aggiornamento notifiche lette:", error);
    throw new Error("Impossibile aggiornare le notifiche.");
  }

  return { success: true };
}