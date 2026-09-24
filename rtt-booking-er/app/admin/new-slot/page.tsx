export const dynamic = "force-dynamic";

import NewSlotForm from "@/components/NewSlotForm";
import Link from "next/link";

export default function NewSlotPage() {
  return (
    <div
      style={{
        maxWidth: 700,
        margin: "40px auto",
        padding: 20,
      }}
    >
      <h1
        style={{
          color: "#2563eb",
          marginBottom: 20,
        }}
      >
        Nuovo Slot RTT
      </h1>

      <NewSlotForm />
    </div>
  );
}

<Link href="/admin">
  <button
    style={{
      marginBottom: 20,
      padding: "10px 16px",
      borderRadius: 8,
      border: "none",
      background: "#2563eb",
      color: "white",
      cursor: "pointer",
    }}
  >
    ← Torna alla Dashboard Admin
  </button>
</Link>