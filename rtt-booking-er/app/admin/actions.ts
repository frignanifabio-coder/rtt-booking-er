"use server";

import { supabaseAdmin } from "@/lib/supabase-admin";

export async function deleteSlot(slotId: string) {
  const { error } = await supabaseAdmin
    .from("availability")
    .delete()
    .eq("id", slotId);

  if (error) {
    throw new Error(error.message);
  }
}