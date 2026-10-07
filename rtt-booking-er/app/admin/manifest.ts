import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ROAD-ER Admin",
    short_name: "ROAD Admin",
    description: "Gestione ROAD-ER",
    start_url: "/admin",
    display: "standalone",
    background_color: "#0f172a",
    theme_color: "#0f172a",

    icons: [
      {
        src: "/admin-icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/admin-icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}