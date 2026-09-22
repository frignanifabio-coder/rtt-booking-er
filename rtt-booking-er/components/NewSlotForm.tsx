"use client";

import { useState } from "react";
import { createSlot } from "@/app/admin/new-slot/actions";

export default function NewSlotForm() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();

        setLoading(true);
        setMessage("");

  const formData = new FormData(
    e.currentTarget
  );

  try {
    await createSlot(formData);

    setMessage(
      "✅ Slot creato correttamente"
    );

  } catch (err) {
    console.error(err);

    setMessage(
      "❌ Errore durante il salvataggio"
    );
  }

  setLoading(false);
}}
    >
      <input
        type="date"
        name="date"
        required
        style={inputStyle}
      />

      <input
        type="time"
        name="start_time"
        required
        style={inputStyle}
      />

      <input
        type="time"
        name="end_time"
        required
        style={inputStyle}
      />

      <input
        name="location"
        placeholder="Comune / Località"
        style={inputStyle}
      />

      <textarea
        name="note"
        placeholder="Note"
        style={{
          ...inputStyle,
          minHeight: 120,
        }}
      />

      <input
        type="number"
        name="max_societa"
        defaultValue={1}
        min={1}
        style={inputStyle}
      />

      {message && (
        <div
          style={{
            marginBottom: 12,
            fontWeight: 600,
          }}
        >
          {message}
        </div>
      )}

      <button
        type="submit"
        style={{
          width: "100%",
          padding: 14,
          background: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: 10,
          cursor: "pointer",
          fontWeight: 700,
        }}
      >
        {loading
          ? "Salvataggio..."
          : "Salva Slot"}
      </button>
    </form>
  );
}

const inputStyle = {
  width: "100%",
  padding: 12,
  marginBottom: 12,
  borderRadius: 8,
  border: "1px solid #cbd5e1",
};