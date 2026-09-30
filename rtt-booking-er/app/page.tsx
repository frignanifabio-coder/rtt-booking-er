export const dynamic = "force-dynamic";

import { supabase } from "@/lib/supabase";
import Calendar from "@/components/Calendar";

export default async function Home() {
  const { data: slots } = await supabase.rpc(
    "get_public_availability"
  );

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg,#eef6ff 0%,#f8fbff 100%)",
        padding: "30px 20px",
      }}
    >
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
              alignItems: "center",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                fontSize: 48,
              }}
            >
              🏀
            </div>

            <div>
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
                Comitato Regionale FIP
                Emilia-Romagna
              </p>
            </div>
          </div>
        </div>

        {/* CONTENUTO */}

        <Calendar slots={slots || []} />

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