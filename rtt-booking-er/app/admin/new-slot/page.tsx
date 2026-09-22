import NewSlotForm from "@/components/NewSlotForm";

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