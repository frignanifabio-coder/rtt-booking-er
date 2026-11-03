"use client";

import { useState, useTransition } from "react";
import { markAllNotificationsRead } from "@/app/admin/notifications-actions";

type BookingDetails = {
  id: string;
  societa?: string | null;
  categoria?: string | null;
  referente?: string | null;
  availability?: {
    date?: string | null;
    start_time?: string | null;
    end_time?: string | null;
    location?: string | null;
  } | null;
} | null;

type Notification = {
  id: string;
  booking_id: string;
  channel: string;
  subject: string | null;
  recipient: string | null;
  status: string;
  attempts: number;
  error_message: string | null;
  created_at: string;
  read_at: string | null;
  booking?: BookingDetails;
};

export default function NotificationBell({
  notifications,
}: {
  notifications: Notification[];
}) {
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(
    notifications.filter((n) => !n.read_at).length
  );
  const [isPending, startTransition] = useTransition();

  function toggleNotifications() {
    const willOpen = !open;
    setOpen(willOpen);

    if (willOpen && unreadCount > 0) {
      const previousCount = unreadCount;
      setUnreadCount(0);

      startTransition(async () => {
        try {
          await markAllNotificationsRead();
        } catch (error) {
          console.error(error);
          setUnreadCount(previousCount);
        }
      });
    }
  }

  function outlookComposeUrl(notification: Notification) {
    const booking = notification.booking;
    const date = booking?.availability?.date;
    const formattedDate = date
      ? date.split("-").length === 3
        ? date.split("-").reverse().join("/")
        : date
      : "Da concordare";

    const start = booking?.availability?.start_time?.slice(0, 5) ?? "—";
    const end = booking?.availability?.end_time?.slice(0, 5) ?? "—";
    const code = `ROAD-${notification.booking_id.slice(0, 6).toUpperCase()}`;

    const subject = "Conferma ricezione richiesta ROAD-ER";
    const body = [
      "Buongiorno,",
      "",
      "confermiamo di aver ricevuto la vostra richiesta di intervento tecnico tramite il portale ROAD-ER.",
      "",
      `Codice prenotazione: ${code}`,
      `Società: ${booking?.societa || "—"}`,
      `Categoria: ${booking?.categoria || "—"}`,
      `Referente: ${booking?.referente || "—"}`,
      `Data: ${formattedDate}`,
      `Orario: ${start} - ${end}`,
      `Sede: ${booking?.availability?.location || "—"}`,
      "",
      "Grazie per la collaborazione.",
      "",
      "Comitato Regionale FIP Emilia-Romagna",
      "ROAD-ER",
    ].join("\n");

const params =
  `to=${encodeURIComponent(notification.recipient || "")}` +
  `&subject=${encodeURIComponent(subject)}` +
  `&body=${encodeURIComponent(body)}`;

return `https://outlook.office.com/mail/deeplink/compose?${params}`;
  }

  const statusStyles: Record<string, { label: string; bg: string; color: string }> = {
    pending: { label: "In attesa", bg: "#fff4d6", color: "#946200" },
    sent: { label: "Inviata", bg: "#e2efff", color: "#155ca0" },
    delivered: { label: "Consegnata", bg: "#d9f8e9", color: "#08734a" },
    failed: { label: "Errore", bg: "#fee2e2", color: "#b42318" },
  };

  const channels: Record<string, string> = {
    internal: "🔔 Notifica interna",
    admin_email: "📧 Email amministrativa",
    society_email: "✉️ Conferma società",
  };

  return (
    <div style={{ position: "relative", zIndex: 20 }}>
      <button
        type="button"
        onClick={toggleNotifications}
        aria-label="Apri centro notifiche"
        aria-expanded={open}
        style={{
          position: "relative",
          width: 68,
          height: 68,
          borderRadius: 19,
          border: "1px solid #c8e1fb",
          background: open ? "#dceeff" : "linear-gradient(145deg,#fff,#eaf4ff)",
          color: "#0f4c81",
          cursor: "pointer",
          display: "grid",
          placeItems: "center",
          boxShadow: "0 5px 15px rgba(15,76,129,.10)",
        }}
      >
        <span style={{ fontSize: 29 }}>🔔</span>

        {unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: -7,
              right: -7,
              minWidth: 24,
              height: 24,
              padding: "0 5px",
              borderRadius: 999,
              background: "#e53935",
              color: "#fff",
              border: "2px solid white",
              fontSize: 12,
              fontWeight: 900,
              display: "grid",
              placeItems: "center",
            }}
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div
            onClick={() => setOpen(false)}
            style={{ position: "fixed", inset: 0, zIndex: -1 }}
          />

          <section
            style={{
              position: "absolute",
              top: 78,
              right: 0,
              width: "min(440px, calc(100vw - 32px))",
              maxHeight: "min(620px, 75vh)",
              overflowY: "auto",
              background: "#fff",
              border: "1px solid #d8e7f7",
              borderRadius: 20,
              padding: 18,
              boxShadow: "0 18px 50px rgba(15,76,129,.20)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 10,
                marginBottom: 16,
              }}
            >
              <div>
                <strong style={{ color: "#0f4c81", fontSize: 18 }}>
                  🔔 Notifiche
                </strong>
                <div style={{ color: "#71869d", fontSize: 12, marginTop: 3 }}>
                  Storico comunicazioni ROAD-ER
                </div>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Chiudi notifiche"
                style={{
                  border: 0,
                  background: "#eef5fc",
                  color: "#426482",
                  borderRadius: 10,
                  width: 32,
                  height: 32,
                  cursor: "pointer",
                  fontSize: 18,
                }}
              >
                ×
              </button>
            </div>

            {isPending && (
              <p style={{ color: "#71869d", fontSize: 12 }}>
                Aggiornamento notifiche...
              </p>
            )}

            {notifications.length === 0 ? (
              <p style={{ color: "#71869d", fontSize: 14 }}>
                Nessuna notifica presente.
              </p>
            ) : (
              <div style={{ display: "grid", gap: 10 }}>
                {notifications.map((n) => {
                  const status = statusStyles[n.status] ?? {
                    label: n.status,
                    bg: "#f1f5f9",
                    color: "#475569",
                  };

                  return (
                    <article
                      key={n.id}
                      style={{
                        border: "1px solid #e0eaf5",
                        borderRadius: 14,
                        padding: 13,
                        background: "#fbfdff",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <strong style={{ color: "#0f4c81", fontSize: 13 }}>
                          {channels[n.channel] ?? n.channel}
                        </strong>

                        <span
                          style={{
                            background: status.bg,
                            color: status.color,
                            borderRadius: 999,
                            padding: "5px 9px",
                            fontSize: 10,
                            fontWeight: 850,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {status.label}
                        </span>
                      </div>

                      <div
                        style={{
                          color: "#475d74",
                          fontSize: 13,
                          marginTop: 8,
                          overflowWrap: "anywhere",
                        }}
                      >
                        {n.subject || "Comunicazione ROAD-ER"}
                      </div>

                      <div
                        style={{
                          color: "#71869d",
                          fontSize: 11,
                          marginTop: 5,
                          overflowWrap: "anywhere",
                        }}
                      >
                        Destinatario: {n.recipient || "—"}
                      </div>

                      <div style={{ color: "#91a2b5", fontSize: 11, marginTop: 5 }}>
                        {new Date(n.created_at).toLocaleString("it-IT")} · Tentativi: {n.attempts}
                      </div>

                      {n.error_message && (
                        <div
                          style={{
                            marginTop: 9,
                            padding: 9,
                            borderRadius: 9,
                            background: "#fff1f0",
                            color: "#b42318",
                            fontSize: 11,
                            overflowWrap: "anywhere",
                          }}
                        >
                          {n.error_message}
                        </div>
                      )}

                      {n.channel === "society_email" && (
                        <a
                          href={outlookComposeUrl(n)}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 8,
                            marginTop: 12,
                            padding: "10px 13px",
                            borderRadius: 11,
                            background: "linear-gradient(135deg,#1687ed 0%,#0754b8 100%)",
                            color: "#fff",
                            textDecoration: "none",
                            fontSize: 12,
                            fontWeight: 850,
                            boxShadow: "0 5px 12px rgba(9,91,184,.16)",
                          }}
                        >
                          ✉️ Invia con Outlook
                        </a>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
