"use client";

import { useState } from "react";
import { supabaseClient } from "@/lib/supabase-client";
import { submitBooking } from "@/app/book/actions";

interface BookingFormProps {
  slotId: string;
}

export default function BookingForm({
  slotId,
}: BookingFormProps) {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
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

  await submitBooking({
    p_availability_id: slotId,

    p_societa:
      formData.get("societa"),

    p_codice_fip:
      formData.get("codice_fip"),

    p_referente:
      formData.get("referente"),

    p_telefono:
      formData.get("telefono"),

    p_email:
      formData.get("email"),

    p_comune:
      formData.get("comune"),

    p_palestra:
      formData.get("palestra"),

    p_categoria:
      formData.get("categoria"),

    p_annata:
      formData.get("annata"),

    p_tipo_intervento:
      formData.get("tipo_intervento"),

    p_focus_tecnico:
      formData.get("focus_tecnico"),

    p_note:
      formData.get("note"),
  });

  setMessage(
    "✅ Richiesta inviata correttamente"
  );

} catch (error: any) {

  setMessage(
    `Errore: ${error.message}`
  );

}

  setLoading(false);
}}
      style={{
        marginTop: 18,
        borderTop: "1px solid #e5e7eb",
        paddingTop: 18,
      }}
    >
      <h4
        style={{
          marginBottom: 12,
          color: "#0f4c81",
        }}
      >
        Richiesta intervento RTT
      </h4>

      <input
        name="societa"
        placeholder="Società *"
        required
        style={inputStyle}
      />

      <input
        name="codice_fip"
        placeholder="Codice FIP"
        style={inputStyle}
      />

      <input
        name="referente"
        placeholder="Referente *"
        required
        style={inputStyle}
      />

      <input
        name="telefono"
        placeholder="Telefono *"
        required
        style={inputStyle}
      />

      <input
        name="email"
        type="email"
        placeholder="Email *"
        required
        style={inputStyle}
      />

      <input
        name="comune"
        placeholder="Comune"
        style={inputStyle}
      />

      <input
        name="palestra"
        placeholder="Palestra / indirizzo"
        style={inputStyle}
      />

      <select
        name="categoria"
        defaultValue=""
        style={inputStyle}
      >
        <option value="" disabled>
          Seleziona categoria
        </option>

        <option value="Minibasket">
          Minibasket
        </option>

        <option value="U13">
          U13
        </option>

        <option value="U14">
          U14
        </option>

        <option value="U15">
          U15
        </option>

        <option value="U17">
          U17
        </option>

        <option value="U19">
          U19
        </option>

        <option value="Senior">
          Senior
        </option>

        <option value="Altro">
          Altro
        </option>
      </select>

      <input
        name="annata"
        placeholder="Annata"
        style={inputStyle}
      />

      <select
        name="tipo_intervento"
        defaultValue=""
        style={inputStyle}
      >
        <option value="" disabled>
          Tipo intervento richiesto
        </option>

        <option value="Allenamento squadra">
          Allenamento squadra
        </option>

        <option value="Allenamento individuale">
          Allenamento individuale
        </option>

        <option value="Supporto allenatore">
          Supporto allenatore
        </option>

        <option value="Clinic">
          Clinic
        </option>

        <option value="Osservazione atleta">
          Osservazione atleta
        </option>

        <option value="Altro">
          Altro
        </option>
      </select>

      <textarea
        name="focus_tecnico"
        placeholder="Focus tecnico richiesto"
        style={{
          ...inputStyle,
          minHeight: 100,
          resize: "vertical",
        }}
      />

      <textarea
        name="note"
        placeholder="Note aggiuntive"
        style={{
          ...inputStyle,
          minHeight: 90,
          resize: "vertical",
        }}
      />

      <label
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 8,
          fontSize: 13,
          color: "#475569",
          marginTop: 8,
          marginBottom: 14,
        }}
      >
        <input
          type="checkbox"
          required
          style={{
            marginTop: 2,
          }}
        />

        <span>
          Confermo di aver inserito dati corretti e
          accetto il trattamento dei dati necessari
          alla gestione della richiesta.
        </span>
      </label>

      <button
        type="submit"
        style={{
          width: "100%",
          background: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: 10,
          padding: 13,
          cursor: "pointer",
          fontWeight: 700,
          fontSize: 15,
        }}
      >
        {loading
          ? "Invio..."
          : "Invia richiesta"}
      </button>
{message && (
  <div
    style={{
      marginTop: 12,
      marginBottom: 12,
      color: "#2563eb",
      fontWeight: 600,
    }}
  >
    {message}
  </div>
)}
      <div
        style={{
          marginTop: 10,
          fontSize: 12,
          color: "#94a3b8",
          textAlign: "center",
        }}
      >
        Slot ID: {slotId}
      </div>
    </form>
  );
}

const inputStyle = {
  width: "100%",
  padding: 11,
  marginTop: 8,
  marginBottom: 8,
  borderRadius: 9,
  border: "1px solid #cbd5e1",
  background: "#ffffff",
  color: "#0f172a",
  fontSize: 14,
};