"use client";

import { useRouter } from "next/navigation";
import { deleteSlot } from "../app/admin/actions";

interface Props {
  slotId: string;
}

export default function DeleteSlotButton({
  slotId,
}: Props) {
  const router = useRouter();

  async function handleDelete() {
    const ok = confirm(
      "Eliminare definitivamente questo slot?"
    );

    if (!ok) return;

    try {
      await deleteSlot(slotId);

      router.refresh();

    } catch (err) {
      console.error(err);

      alert(
        "Errore durante l'eliminazione"
      );
    }
  }

  return (
    <button
      onClick={handleDelete}
      style={{
        background: "#dc2626",
        color: "white",
        border: "none",
        borderRadius: 8,
        padding: "8px 12px",
        cursor: "pointer",
        marginTop: 8,
      }}
    >
      Elimina
    </button>
  );
}