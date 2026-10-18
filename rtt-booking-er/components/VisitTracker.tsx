"use client";

import { useEffect, useRef } from "react";

/** Registra ogni caricamento completo della homepage, non visitatori unici. */
export default function VisitTracker() {
  const sent = useRef(false);

  useEffect(() => {
    // Evita il doppio invio del solo ciclo aggiuntivo di React Strict Mode in sviluppo.
    if (sent.current) return;
    sent.current = true;

    fetch("/api/visits", { method: "POST", keepalive: true }).catch(() => {
      // Il tracciamento è accessorio: non deve interrompere la navigazione.
    });
  }, []);

  return null;
}
