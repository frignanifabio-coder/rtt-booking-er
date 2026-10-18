import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

export async function POST() {
  const { error } = await supabaseAdmin.from("app_visits").insert({});

  if (error) {
    console.error("Errore registrazione visita:", error.message);
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
