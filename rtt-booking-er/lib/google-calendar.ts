import { google } from "googleapis";

export async function getUpcomingEvents() {
  try {
    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_CLIENT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      scopes: [
        "https://www.googleapis.com/auth/calendar.readonly",
      ],
    });

    const calendar = google.calendar({
      version: "v3",
      auth,
    });
console.log("CALENDAR ID =", process.env.GOOGLE_CALENDAR_ID);
console.log("CLIENT EMAIL =", process.env.GOOGLE_CLIENT_EMAIL);
    const response = await calendar.events.list({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
    });
console.log(
  "EVENTI GOOGLE:",
  response.data.items?.length
);
    return response.data.items || [];
  } catch (error) {
    console.error("GOOGLE CALENDAR ERROR:", error);
    return [];
  }
}