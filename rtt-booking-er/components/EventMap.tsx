
"use client";

import { useEffect, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export interface RegionalEvent {
  id?: string | null;
  summary?: string | null;
  location?: string | null;
  description?: string | null;
  start?: {
    dateTime?: string | null;
    date?: string | null;
  } | null;
  latitude?: number | null;
  longitude?: number | null;
}

interface EventMapProps {
  events: RegionalEvent[];
}

const REGION_CENTER: [number, number] = [44.5, 11.0];



const eventIcon = L.divIcon({
  className: "road-map-marker",
  html: `
    <img
      src="/fip-marker.png"
      style="
        width: 60px;
        height: 60px;
        object-fit: contain;
        display: block;
        background: transparent;
        border: none;
        box-shadow: none;
      "
    />
  `,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36],
});



type MappedEvent = {
  event: RegionalEvent;
  position: [number, number];
};

function FitMarkers({ points }: { points: MappedEvent[] }) {
  const map = useMap();

  useEffect(() => {
    if (points.length === 0) {
      map.setView(REGION_CENTER, 8);
      return;
    }

    if (points.length === 1) {
      map.setView(points[0].position, 12);
      return;
    }

    map.fitBounds(
      L.latLngBounds(points.map((point) => point.position)),
      { padding: [35, 35], maxZoom: 11 }
    );
  }, [map, points]);

  return null;
}

function formatEventDate(event: RegionalEvent) {
  const value = event.start?.dateTime || event.start?.date;

  if (!value) return null;

  return new Date(value).toLocaleDateString("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatEventTime(event: RegionalEvent) {
  const value = event.start?.dateTime;

  if (!value) return null;

  return new Date(value).toLocaleTimeString("it-IT", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function EventMap({ events }: EventMapProps) {
  const points = useMemo<MappedEvent[]>(
    () =>
      events.flatMap((event) => {
        if (
          typeof event.latitude !== "number" ||
          typeof event.longitude !== "number" ||
          !Number.isFinite(event.latitude) ||
          !Number.isFinite(event.longitude)
        ) {
          return [];
        }

        return [{
          event,
          position: [event.latitude, event.longitude] as [number, number],
        }];
      }),
    [events]
  );

  return (
    <section
      style={{
        marginTop: 24,
        padding: 24,
        borderRadius: 24,
        background: "white",
        boxShadow: "0 12px 35px rgba(15, 76, 129, 0.08)",
        border: "1px solid #dbeafe",
      }}
    >
      <div style={{ marginBottom: 18 }}>
        <div
          style={{
            color: "#2563eb",
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: ".08em",
            textTransform: "uppercase",
          }}
        >
          🏀 MAPPA EVENTI
        </div>
      </div>

      <div
        style={{
          height: 440,
          overflow: "hidden",
          borderRadius: 18,
          border: "1px solid #dbeafe",
        }}
      >
        <MapContainer
          center={REGION_CENTER}
          zoom={8}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {points.map(({ event, position }, index) => (
            <Marker
              key={`${event.id || event.summary || "evento"}-${index}`}
              position={position}
              icon={eventIcon}
            >
              <Popup>
                <div style={{ minWidth: 180 }}>
                  <strong>{event.summary || "Evento regionale"}</strong>

                  {formatEventDate(event) && (
                    <div>📅 {formatEventDate(event)}</div>
                  )}

                  {formatEventTime(event) && (
                    <div>🕒 {formatEventTime(event)}</div>
                  )}

                  {event.location && (
                    <div style={{ marginTop: 6 }}>
                      📍 {event.location}
                    </div>
                  )}

                  {event.description && (
                    <p style={{ marginBottom: 8 }}>
                      {event.description}
                    </p>
                  )}

                  {event.location && (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Apri in Google Maps ↗
                    </a>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}

          <FitMarkers points={points} />
        </MapContainer>
      </div>
    </section>
  );
}
