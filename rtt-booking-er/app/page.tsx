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
        background: "#eef6ff",
        padding: 40,
      }}
    >
      <h1
        style={{
          color: "#0f4c81",
          marginBottom: 30,
        }}
      >
        RTT Booking ER
      </h1>

      <Calendar slots={slots || []} />
    </main>
  );
}