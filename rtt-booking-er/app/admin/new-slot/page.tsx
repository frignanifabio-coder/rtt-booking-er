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
    <Link
      href="/admin"
        style={{
        display: "inline-block",
        marginBottom: 20,
        color: "#2563eb",
        textDecoration: "none",
        fontWeight: 600,
        }}
      >
      ← Dashboard Admin
    </Link>
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
