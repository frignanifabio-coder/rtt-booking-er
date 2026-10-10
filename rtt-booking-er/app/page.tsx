export const dynamic = "force-dynamic";

import { supabase } from "@/lib/supabase";
import Calendar from "@/components/Calendar";
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
      {/* HEADER ISTITUZIONALE */}
      <header className="site-header">
        <div className="site-branding">
          <Image
            src="/admin-icon.png"
            alt="Logo ROAD-ER"
            width={96}
            height={96}
            priority
            unoptimized
            className="road-er-logo"
          />

          <span className="brand-divider" aria-hidden="true" />

          <Image
            src="/logo-fip-er.jpg"
            alt="FIP Emilia-Romagna"
            width={150}
            height={70}
            priority
            unoptimized
            className="fip-logo"
          />
        </div>

        <div className="site-heading">
          <h1>🏀 RTT Booking ER</h1>
          <p className="site-subtitle">Richiesta interventi tecnici regionali</p>
          <p className="site-committee">Comitato Regionale FIP Emilia-Romagna</p>
        </div>

        <div className="availability-summary" aria-label="Riepilogo disponibilità">
          <div className="availability-pill availability-pill-free">
            <span className="availability-indicator" aria-hidden="true" />
            <span>{availableSlots} disponibili</span>
          </div>
          <div className="availability-pill availability-pill-booked">
            <span className="availability-indicator" aria-hidden="true" />
            <span>{bookedSlots} prenotati</span>
          </div>
        </div>
      </header>

        {/* CONTENUTO */}

<Calendar
  slots={slots || []}
  events={events || []}
/>
        {/* FOOTER */}
        <footer className="site-footer">
          <div className="footer-contact">
            <p>RTT Booking ER · Comitato Regionale FIP Emilia-Romagna</p>
            <p>
              Per informazioni: <a href="mailto:fabio.frignani@fipcrer.it">fabio.frignani@fipcrer.it</a>
            </p>
          </div>

          <Link href="/admin" prefetch={false} className="footer-admin-link">
            <Image
              src="/admin-icon.png"
              alt=""
              width={28}
              height={28}
              aria-hidden="true"
            />
            <span>Area Admin</span>
          </Link>
        </footer>
      </div>
    </main>
  );
}