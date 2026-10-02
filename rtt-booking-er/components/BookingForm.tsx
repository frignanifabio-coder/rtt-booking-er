"use client";

import { useState } from "react";
import { submitBooking } from "@/app/book/actions";

interface BookingFormProps {
  slotId: string;
}

export default function BookingForm({
  slotId,
}: BookingFormProps) {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [bookingCode, setBookingCode] = useState("");
  return (
    <form
onSubmit={async (e) => {
  e.preventDefault();

  const form = e.currentTarget;

  setLoading(true);
  setMessage("");

  const formData = new FormData(form);

try {

  const result = await submitBooking({
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

setBookingCode(result.bookingCode);
form.reset();

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
    marginBottom: 6,
    color: "#0f4c81",
    fontSize: 22,
  }}
>
  Richiesta intervento RTT
</h4>

<p
  style={{
    marginTop: 0,
    marginBottom: 20,
    color: "#64748b",
    fontSize: 14,
  }}
>
  Compila i dati della società per
  confermare la prenotazione.
</p>
<div
  style={{
    marginTop: 12,
    marginBottom: 10,
    fontWeight: 700,
    color: "#0f4c81",
    fontSize: 14,
  }}
>
  DATI SOCIETÀ
</div>
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
  type="tel"
  placeholder="Telefono *"
  required
  minLength={9}
  maxLength={15}
  pattern="[0-9]{9,15}"
  title="Inserisci un numero di telefono valido"
  onInput={(e) => {
    e.currentTarget.value = e.currentTarget.value.replace(/\D/g, "");
  }}
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
<div
  style={{
    marginTop: 16,
    marginBottom: 10,
    fontWeight: 700,
    color: "#0f4c81",
    fontSize: 14,
  }}
>
  INTERVENTO RICHIESTO
</div>
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
<div
  style={{
    marginTop: 16,
    marginBottom: 10,
    fontWeight: 700,
    color: "#0f4c81",
    fontSize: 14,
  }}
>
  NOTE TECNICHE
</div>
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
{bookingCode && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,.55)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
    }}
  >
    <div
      style={{
        background: "white",
        borderRadius: 20,
        padding: 30,
        maxWidth: 500,
        width: "90%",
        textAlign: "center",
        boxShadow:
          "0 20px 60px rgba(0,0,0,.25)",
      }}
    >
      <div
        style={{
          fontSize: 32,
          marginBottom: 12,
        }}
      >
        ✅
      </div>

      <h2
        style={{
          color: "#0f4c81",
          marginBottom: 20,
        }}
      >
        Richiesta registrata
      </h2>

      <p>
        Codice prenotazione
      </p>

      <div
        style={{
          fontSize: 28,
          fontWeight: 800,
          color: "#2563eb",
          margin: "16px 0",
        }}
      >
        {bookingCode}
      </div>

      <p
        style={{
          color: "#64748b",
          marginBottom: 24,
        }}
      >
        Conserva questo codice per
        eventuali comunicazioni con il
        Comitato Regionale.
      </p>

      <button
        onClick={() =>
          window.location.reload()
        }
        style={{
          background: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: 12,
          padding: "12px 24px",
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        Ho preso nota
      </button>
    </div>
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