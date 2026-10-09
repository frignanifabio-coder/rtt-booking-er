"use client";

import dynamic from "next/dynamic";

const EventMap = dynamic(() => import("./EventMap"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        marginTop: 24,
        padding: 24,
        background: "white",
        borderRadius: 24,
        color: "#0f4c81",
      }}
    >
      Caricamento della mappa regionale...
    </div>
  ),
});

export default EventMap;
