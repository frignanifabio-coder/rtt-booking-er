export const dynamic = "force-dynamic";

import { supabase } from "@/lib/supabase";
import Calendar from "@/components/Calendar";
import EventMap from "@/components/EventMapLoader";
import Image from "next/image";
import InstallBanner from "@/components/InstallBanner";
import Link from "next/link";
import { getUpcomingEvents } from "@/lib/google-calendar";

export default async function Home() {
  const { data: slots } = await supabase.rpc(
    "get_public_availability"
  );
  const events = await getUpcomingEvents();
  console.log(slots);
  const availableSlots =
  slots?.filter(
    (s: any) => !s.booked
  ).length || 0;

const bookedSlots =
  slots?.filter(
    (s: any) => s.booked
  ).length || 0;

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg,#eef6ff 0%,#f8fbff 100%)",
        padding: "30px 20px",
      }}
    >
      <InstallBanner />
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
        }}
      >
{/* HEADER */}

<div
  style={{
    background: "white",
    borderRadius: 24,
    padding: 32,
    marginBottom: 30,
    boxShadow:
      "0 8px 24px rgba(15,76,129,0.08)",
  }}
>
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 30,
      flexWrap: "wrap",
    }}
  >
    {/* SINISTRA */}

    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 24,
        flexWrap: "wrap",
      }}
    >
      <Image
        src="/logo-fip-er.jpg"
        alt="FIP Emilia Romagna"
        width={180}
        height={70}
        priority
        style={{
          width: "180px",
          height: "auto",
        }}
      />

      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span
            style={{
              fontSize: 32,
            }}
          >
            🏀
          </span>

          <h1
            style={{
              margin: 0,
              color: "#0f4c81",
              fontSize: "clamp(28px,4vw,42px)",
              fontWeight: 800,
            }}
          >
            RTT Booking ER
          </h1>
        </div>

        <p
          style={{
            marginTop: 8,
            marginBottom: 0,
            color: "#64748b",
            fontSize: 16,
          }}
        >
          Richiesta interventi tecnici regionali
        </p>

        <p
          style={{
            marginTop: 4,
            color: "#94a3b8",
            fontSize: 14,
          }}
        >
          Comitato Regionale FIP Emilia-Romagna
        </p>

        <div
          style={{
            display: "flex",
            gap: 12,
            marginTop: 16,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              background: "#dcfce7",
              color: "#166534",
              padding: "8px 14px",
              borderRadius: 999,
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            🟢 {availableSlots} disponibili
          </div>

          <div
            style={{
              background: "#fee2e2",
              color: "#991b1b",
              padding: "8px 14px",
              borderRadius: 999,
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            ✓ {bookedSlots} prenotati
          </div>
        </div>
      </div>
    </div>
  

    {/* ADMIN */}

    <Link
  href="/admin"
  prefetch={false}
>
      <Image
        src="/admin-icon.png"
        alt="ROAD-ER Admin"
        width={90}
        height={90}
        title="Area amministrativa"
        style={{
          borderRadius: 20,
          cursor: "pointer",
          boxShadow:
            "0 6px 16px rgba(15,76,129,.18)",
        }}
      />
    </Link>
    </div>
</div>

        {/* CONTENUTO */}

<Calendar
  slots={slots || []}
  events={events || []}
/>
        {/* FOOTER */}

        <div
          style={{
            marginTop: 40,
            textAlign: "center",
            color: "#64748b",
            fontSize: 14,
          }}
        >
          <p>
            RTT Booking ER · Comitato
            Regionale FIP Emilia-Romagna
          </p>

          <p>
            Per informazioni:
            <br />
            fabio.frignani@fipcrer.it
          </p>
        </div>
      </div>
    </main>
  );
}