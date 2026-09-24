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

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateBooking(
  formData: FormData
) {
  const bookingId =
    formData.get("bookingId") as string;

  const { error } = await supabaseAdmin
    .from("bookings")
    .update({
      societa: formData.get("societa"),
      referente: formData.get("referente"),
      email: formData.get("email"),
      telefono: formData.get("telefono"),
      categoria: formData.get("categoria"),
      annata: formData.get("annata"),
      focus_tecnico:
        formData.get("focus_tecnico"),
      note: formData.get("note"),
    })
    .eq("id", bookingId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin");
  revalidatePath(
    `/admin/booking/${bookingId}`
  );

  redirect(
    `/admin/booking/${bookingId}`
  );
}

export async function cancelBooking(
  formData: FormData
) {
  const bookingId =
    formData.get("bookingId") as string;

  const { error } =
    await supabaseAdmin
      .from("bookings")
      .update({
        status: "cancelled",
      })
      .eq("id", bookingId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin");
  redirect("/admin");
}