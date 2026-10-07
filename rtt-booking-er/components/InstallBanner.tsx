"use client";

import { useEffect, useState } from "react";

export default function InstallBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed =
      localStorage.getItem(
        "road_install_dismissed"
      );

    const standalone =
      window.matchMedia(
        "(display-mode: standalone)"
      ).matches;

    const iosStandalone =
      (window.navigator as any).standalone;

    if (
      !dismissed &&
      !standalone &&
      !iosStandalone
    ) {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  const isIOS =
    /iphone|ipad|ipod/i.test(
      navigator.userAgent
    );

  return (
    <div
      style={{
        background:
          "linear-gradient(135deg,#0f4c81,#2563eb)",
        color: "white",
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        boxShadow:
          "0 8px 24px rgba(37,99,235,.2)",
      }}
    >
      <h3
        style={{
          marginTop: 0,
          marginBottom: 10,
        }}
      >
        📱 Installa ROAD-ER
      </h3>

      <p
        style={{
          marginBottom: 16,
          lineHeight: 1.5,
        }}
      >
        Accedi rapidamente alle
        richieste RTT direttamente
        dal tuo dispositivo.
      </p>

      <div
        style={{
          background:
            "rgba(255,255,255,.15)",
          padding: 12,
          borderRadius: 12,
          marginBottom: 16,
        }}
      >
        {isIOS ? (
          <>
            1️⃣ Premi <strong>Condividi</strong>
            <br />
            2️⃣ Seleziona
            <strong>
              {" "}
              Aggiungi a schermata Home
            </strong>
            <br />
            3️⃣ Conferma
          </>
        ) : (
          <>
            1️⃣ Apri il menu ⋮
            <br />
            2️⃣ Premi
            <strong>
              {" "}
              Installa App
            </strong>
            <br />
            3️⃣ Conferma
          </>
        )}
      </div>

      <button
        onClick={() => {
          localStorage.setItem(
            "road_install_dismissed",
            "true"
          );

          setVisible(false);
        }}
        style={{
          background: "white",
          color: "#0f4c81",
          border: "none",
          borderRadius: 10,
          padding: "10px 18px",
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        Ho capito
      </button>
    </div>
  );
}