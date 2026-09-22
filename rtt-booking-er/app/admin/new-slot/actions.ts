"use server";

import { supabaseAdmin } from "@/lib/supabase-admin";

export async function createSlot(
  formData: FormData
) {
  const { error } =
    await supabaseAdmin
      .from("availability")
      .insert({
        date: formData.get("date"),
        start_time:
          formData.get("start_time"),
        end_time:
          formData.get("end_time"),
        location:
          formData.get("location"),
        note: formData.get("note"),
        max_societa: Number(
          formData.get("max_societa")
        ),
      });

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return {
    success: true,
  };
}