export const dynamic = "force-dynamic";

import { supabaseAdmin } from "@/lib/supabase-admin";
import Link from "next/link";
import Image from "next/image";
import DeleteSlotButton from "@/components/DeleteSlotButton";

const panel: React.CSSProperties = {
  background: "rgba(255,255,255,.94)",
  border: "1px solid #e3edf9",
  borderRadius: 22,
  boxShadow: "0 10px 28px rgba(15,76,129,.07)",
};

const actionLink: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", justifyContent: "center",
  gap: 9, padding: "11px 15px", borderRadius: 13, textDecoration: "none",
  fontWeight: 800, fontSize: 14, transition: "transform .18s ease, box-shadow .18s ease",
};

function dateIt(value?: string | null) {
  if (!value) return "—";
  const parts = value.split("-");
  return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : value;
}

function timeIt(value?: string | null) {
  return value ? value.slice(0, 5) : "—";
}

function StatCard({ label, value, icon, tone, detail }: { label: string; value: number; icon: string; tone: string; detail: string }) {
  return (
    <article style={{ ...panel, padding: 22, minWidth: 0, position: "relative", overflow: "hidden", display: "flex", alignItems: "center", gap: 16, background: `linear-gradient(135deg,#fff 0%,${tone} 145%)` }}>
      <div aria-hidden="true" style={{ width: 58, height: 58, borderRadius: 19, display: "grid", placeItems: "center", background: "rgba(255,255,255,.88)", border: `1px solid ${tone}`, boxShadow: "0 5px 14px rgba(15,76,129,.08)", fontSize: 26, flexShrink: 0 }}>{icon}</div>
      <div style={{ minWidth: 0 }}>
        <div style={{ color: "#55708f", fontSize: 13, fontWeight: 800, marginBottom: 5 }}>{label}</div>
        <div style={{ color: "#104b82", fontSize: 34, fontWeight: 900, letterSpacing: "-.8px", lineHeight: 1.05 }}>{value}</div>
        <div style={{ color: "#6b829b", fontSize: 12, marginTop: 7 }}>{detail}</div>
      </div>
      <div aria-hidden="true" style={{ position: "absolute", right: -12, bottom: -28, fontSize: 82, opacity: .07, transform: "rotate(-12deg)", pointerEvents: "none" }}>{icon}</div>
    </article>
  );
}

export default async function AdminPage() {
  const [bookingsResult, slotsResult, visitsResult] = await Promise.all([
    supabaseAdmin.from("bookings").select("*, availability (date, start_time, end_time, location)").order("created_at", { ascending: false }),
    supabaseAdmin.from("availability").select("*").order("date", { ascending: true }),
    supabaseAdmin.rpc("get_visit_stats"),
  ]);

  if (bookingsResult.error || slotsResult.error) {
    throw new Error("Impossibile caricare la dashboard amministrativa.");
  }

  const allBookings = bookingsResult.data ?? [];
  const allSlots = slotsResult.data ?? [];
  const activeBookings = allBookings.filter((booking) => booking.status !== "cancelled");
  const bookedSlotIds = new Set(activeBookings.map((booking) => booking.availability_id));
  const freeSlots = allSlots.filter((slot) => !bookedSlotIds.has(slot.id));
  const occupiedSlots = allSlots.length - freeSlots.length;
  const visitStats = Array.isArray(visitsResult.data) ? visitsResult.data[0] : visitsResult.data;
  const visitsToday = Number(visitStats?.visits_today ?? 0);
  const visitsTotal = Number(visitStats?.visits_total ?? 0);

  return (
    <main style={{ minHeight: "100vh", background: "radial-gradient(ellipse at 10% 0%,#dceeff 0%,transparent 38%),linear-gradient(180deg,#eef6ff 0%,#f8fbff 65%,#edf6ff 100%)", padding: "30px 20px 60px", color: "#173b61" }}>
      <div style={{ maxWidth: 1480, margin: "0 auto" }}>
        {/* Header allineato alla Home, con contatori e ritorno all'app */}
        <header style={{ ...panel, padding: "28px 30px", marginBottom: 30, borderRadius: 26 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 24, flex: "1 1 520px", minWidth: 0, flexWrap: "wrap" }}>
              <Image src="/logo-fip-er.jpg" alt="FIP Emilia-Romagna" width={180} height={70} priority unoptimized style={{ width: 180, height: "auto", objectFit: "contain" }} />
              <div style={{ minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <span aria-hidden="true" style={{ fontSize: 34 }}>🏀</span>
                  <h1 style={{ margin: 0, color: "#0f4c81", fontSize: "clamp(27px,3.5vw,42px)", lineHeight: 1.12, fontWeight: 900, letterSpacing: "-.8px" }}>RTT Booking ER</h1>
                </div>
                <p style={{ margin: "9px 0 0", color: "#647b95", fontSize: 16 }}>Richiesta interventi tecnici regionali</p>
                <p style={{ margin: "4px 0 0", color: "#91a2b5", fontSize: 13 }}>Comitato Regionale FIP Emilia-Romagna · Area riservata</p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "stretch", gap: 10, flexWrap: "wrap", marginLeft: "auto" }}>
              <div style={{ minWidth: 112, padding: "12px 15px", borderRadius: 17, background: "linear-gradient(145deg,#f0f8ff,#dceeff)", border: "1px solid #c5e2ff", boxShadow: "0 5px 14px rgba(30,111,190,.07)" }}>
                <div style={{ color: "#285e91", fontSize: 12, fontWeight: 800, whiteSpace: "nowrap" }}>▦ Visite oggi</div>
                <div style={{ color: "#0f4c81", fontSize: 27, lineHeight: 1.2, fontWeight: 900, marginTop: 5 }}>{visitsToday.toLocaleString("it-IT")}</div>
                <div style={{ height: 4, borderRadius: 999, background: "#c4e2ff", marginTop: 8, overflow: "hidden" }}><div style={{ width: "68%", height: "100%", background: "linear-gradient(90deg,#1d91f2,#0f4c81)", borderRadius: 999 }} /></div>
              </div>
              <div style={{ minWidth: 120, padding: "12px 15px", borderRadius: 17, background: "linear-gradient(145deg,#f0f8ff,#dceeff)", border: "1px solid #c5e2ff", boxShadow: "0 5px 14px rgba(30,111,190,.07)" }}>
                <div style={{ color: "#285e91", fontSize: 12, fontWeight: 800, whiteSpace: "nowrap" }}>▥ Visite totali</div>
                <div style={{ color: "#0f4c81", fontSize: 27, lineHeight: 1.2, fontWeight: 900, marginTop: 5 }}>{visitsTotal.toLocaleString("it-IT")}</div>
                <div style={{ height: 4, borderRadius: 999, background: "#c4e2ff", marginTop: 8, overflow: "hidden" }}><div style={{ width: "85%", height: "100%", background: "linear-gradient(90deg,#1d91f2,#0f4c81)", borderRadius: 999 }} /></div>
              </div>
              <Link href="/" style={{ ...actionLink, alignSelf: "stretch", padding: "14px 19px", color: "white", background: "linear-gradient(135deg,#1687ed 0%,#0754b8 100%)", border: "1px solid #60b5ff", boxShadow: "0 8px 20px rgba(9,91,184,.22)", fontSize: 15, whiteSpace: "nowrap" }}>
                <span aria-hidden="true" style={{ fontSize: 19 }}>⌂</span> Torna all’app <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </header>

        <section style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: "clamp(24px,3vw,30px)", color: "#0f4c81", letterSpacing: "-.4px" }}>Panoramica</h2>
            <p style={{ margin: "7px 0 0", color: "#647b95", fontSize: 16 }}>Prenotazioni e disponibilità degli interventi regionali</p>
          </div>
          <Link href="/admin/new-slot" style={{ ...actionLink, color: "white", background: "linear-gradient(135deg,#1687ed 0%,#0754b8 100%)", padding: "15px 22px", boxShadow: "0 8px 18px rgba(9,91,184,.18)" }}><span aria-hidden="true">＋</span> Nuovo slot</Link>
        </section>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,245px),1fr))", gap: 16, marginBottom: 28 }}>
          <StatCard label="Prenotazioni" value={allBookings.length} icon="👥" tone="#cce8ff" detail="Totali ricevute" />
          <StatCard label="Slot totali" value={allSlots.length} icon="▦" tone="#e0d7ff" detail="Presenti in calendario" />
          <StatCard label="Slot prenotati" value={occupiedSlots} icon="◷" tone="#ffe0ad" detail="Occupati da una richiesta" />
          <StatCard label="Slot liberi" value={freeSlots.length} icon="✓" tone="#c7f5e7" detail="Ancora disponibili" />
        </section>

        <section style={{ ...panel, padding: 24, marginBottom: 26 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
            <h2 style={{ margin: 0, color: "#0f4c81", fontSize: 23 }}>▤ Prenotazioni ricevute</h2>
            <span style={{ borderRadius: 999, padding: "7px 13px", background: "#e7f2ff", color: "#155ca0", fontWeight: 850, fontSize: 13 }}>{allBookings.length} totali</span>
          </div>
          {allBookings.length === 0 ? <p style={{ color: "#647b95" }}>Non ci sono ancora prenotazioni.</p> : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,310px),1fr))", gap: 16 }}>
              {allBookings.map((booking) => {
                const code = `ROAD-${String(booking.id).slice(0, 6).toUpperCase()}`;
                const cancelled = booking.status === "cancelled";
                return (
                  <article key={booking.id} style={{ border: "1px solid #dbe7f3", borderRadius: 18, padding: 20, background: "linear-gradient(160deg,#fff 0%,#fbfdff 100%)", boxShadow: "0 4px 14px rgba(15,76,129,.04)", display: "flex", flexDirection: "column", gap: 11 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                      <span style={{ fontSize: 12, fontWeight: 850, color: "#647b95", letterSpacing: .4 }}>{code}</span>
                      <span style={{ fontSize: 12, fontWeight: 800, borderRadius: 999, padding: "6px 10px", background: cancelled ? "#f1f5f9" : "#fff2d5", color: cancelled ? "#64748b" : "#945b00" }}>{cancelled ? "Annullata" : "Richiesta ricevuta"}</span>
                    </div>
                    <h3 style={{ margin: 0, fontSize: 20, color: "#0f4c81", overflowWrap: "anywhere" }}>{booking.societa || "Società non indicata"}</h3>
                    <div style={{ color: "#475d74", fontSize: 14, lineHeight: 1.9 }}>
                      <div>👤 {booking.referente || "—"}</div>
                      <div>🏀 {booking.categoria || "—"}</div>
                      <div>📅 {dateIt(booking.availability?.date)}</div>
                      <div>🕒 {timeIt(booking.availability?.start_time)} – {timeIt(booking.availability?.end_time)}</div>
                      <div>📍 {booking.availability?.location || "—"}</div>
                    </div>
                    <div style={{ display: "flex", gap: 9, flexWrap: "wrap", marginTop: "auto", paddingTop: 8 }}>
                      <Link href={`/admin/booking/${booking.id}`} style={{ ...actionLink, background: "#e2efff", color: "#155ca0" }}>👁️ Dettaglio</Link>
                      <Link href={`/admin/booking/${booking.id}/edit`} style={{ ...actionLink, background: "#fff0d5", color: "#8b5700" }}>✏️ Modifica</Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <section style={{ ...panel, padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap", marginBottom: 20 }}>
            <h2 style={{ margin: 0, color: "#0f4c81", fontSize: 23 }}>▦ Slot disponibili</h2>
            <span style={{ borderRadius: 999, padding: "7px 13px", background: "#d9f8e9", color: "#08734a", fontWeight: 850, fontSize: 13 }}>{freeSlots.length} liberi</span>
          </div>
          {freeSlots.length === 0 ? <p style={{ color: "#647b95" }}>Non ci sono slot liberi al momento.</p> : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,280px),1fr))", gap: 14 }}>
              {freeSlots.map((slot) => (
                <article key={slot.id} style={{ border: "1px solid #dbe7f3", borderRadius: 17, padding: 18, background: "linear-gradient(145deg,#fff 0%,#f5fbff 100%)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
                    <strong style={{ color: "#0f4c81", fontSize: 18 }}>📅 {dateIt(slot.date)}</strong>
                    <span style={{ background: "#d9f8e9", color: "#08734a", borderRadius: 999, padding: "5px 10px", fontSize: 12, fontWeight: 850 }}>Disponibile</span>
                  </div>
                  <div style={{ color: "#475d74", lineHeight: 1.9, marginBottom: 14 }}>
                    <div>🕒 {timeIt(slot.start_time)} – {timeIt(slot.end_time)}</div>
                    <div>📍 {slot.location || "—"}</div>
                  </div>
                  <DeleteSlotButton slotId={slot.id} />
                </article>
              ))}
            </div>
          )}
        </section>
        <footer style={{ textAlign: "center", marginTop: 32, color: "#71869d", fontSize: 13 }}>RTT Booking ER · Comitato Regionale FIP Emilia-Romagna</footer>
      </div>
    </main>
  );
}
