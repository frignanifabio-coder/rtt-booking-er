
import { google } from "googleapis";
import { supabaseAdmin } from "@/lib/supabase-admin";

type CalendarEvent = {
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
};

const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));



async function geocodeAddress(address: string) {
  const parts = address
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  const venueName = parts[0] || "";
  const streetOrLocality = parts[1] || "";
  const cityPart =
    parts.find((part) => /\b\d{5}\b/.test(part)) || "";
  const city = cityPart.replace(/^\d{5}\s*/, "");
  const country = "Italia";

  // Non cerchiamo soltanto il comune:
  // vogliamo identificare la struttura sportiva.
  const queries = [
    address,
    [venueName, city, country].filter(Boolean).join(", "),
    [venueName, streetOrLocality, city, country]
      .filter(Boolean)
      .join(", "),
    [streetOrLocality, city, country]
      .filter(Boolean)
      .join(", "),
  ].filter((query, index, all) =>
    query.length > 0 && all.indexOf(query) === index
  );

  for (let i = 0; i < queries.length; i++) {
    try {
      if (i > 0) await delay(1200);

      const url = new URL(
        "https://nominatim.openstreetmap.org/search"
      );

      url.searchParams.set("q", queries[i]);
      url.searchParams.set("format", "jsonv2");
      url.searchParams.set("limit", "5");
      url.searchParams.set("countrycodes", "it");
      url.searchParams.set("addressdetails", "1");

      const response = await fetch(url.toString(), {
        headers: {
          "User-Agent": "ROAD-ER/5.0",
        },
        signal: AbortSignal.timeout(8000),
        cache: "no-store",
      });

      if (!response.ok) {
        console.error(
          "Errore geocodifica:",
          response.status,
          "Query:",
          queries[i]
        );
        continue;
      }

      const results = (await response.json()) as {
        lat: string;
        lon: string;
        display_name: string;
        type?: string;
        class?: string;
        name?: string;
      }[];

      if (!results.length) {
        console.log("NESSUN RISULTATO:", queries[i]);
        continue;
      }

      const normalizedVenue = venueName
        .toLowerCase()
        .replace(/[^a-z0-9à-ÿ ]/gi, " ")
        .replace(/\s+/g, " ")
        .trim();

      const meaningfulWords = normalizedVenue
        .split(" ")
        .filter((word) => word.length >= 4);

      const candidates = results.map((result) => {
        const normalizedResult = (
          `${result.name || ""} ${result.display_name}`
        )
          .toLowerCase()
          .replace(/[^a-z0-9à-ÿ ]/gi, " ")
          .replace(/\s+/g, " ");

        const matchingWords = meaningfulWords.filter(
          (word) => normalizedResult.includes(word)
        );

        return {
          result,
          matchingWords,
          score:
            meaningfulWords.length > 0
              ? matchingWords.length / meaningfulWords.length
              : 0,
        };
      });

      // Accettiamo un risultato soltanto se contiene
      // almeno una parte significativa del nome della sede.
      const best = candidates
        .filter((candidate) => candidate.score >= 0.5)
        .sort((a, b) => b.score - a.score)[0];

      if (!best) {
        console.log(
          "RISULTATI NON ABBASTANZA PRECISI:",
          queries[i],
          results.map((result) => result.display_name)
        );
        continue;
      }

      const result = best.result;

      console.log(
        "SEDE TROVATA:",
        address,
        "=>",
        result.display_name
      );

      return {
        latitude: Number(result.lat),
        longitude: Number(result.lon),
        display_name: result.display_name,
      };
    } catch (error) {
      console.error(
        "GEOCODING ERROR:",
        queries[i],
        error
      );
    }
  }

  console.log("SEDE NON IDENTIFICATA:", address);
  return null;
}



async function getCoordinates(address: string) {
  // Prima cerchiamo l'indirizzo nella cache Supabase.
  const { data: cached, error } = await supabaseAdmin
    .from("event_locations")
    .select("latitude, longitude, display_name")
    .eq("address", address)
    .maybeSingle();

  if (error) {
    console.error("Errore lettura cache geografica:", error);
    return null;
  }

  if (cached) {
    return {
      latitude: Number(cached.latitude),
      longitude: Number(cached.longitude),
      display_name: cached.display_name,
    };
  }

  // Indirizzo non presente: cerchiamo le coordinate.
  const result = await geocodeAddress(address);

  if (!result) return null;

  const { error: saveError } = await supabaseAdmin
    .from("event_locations")
    .upsert(
      {
        address,
        latitude: result.latitude,
        longitude: result.longitude,
        display_name: result.display_name,
        geocoded_at: new Date().toISOString(),
      },
      { onConflict: "address" }
    );

  if (saveError) {
    console.error("Errore salvataggio coordinate:", saveError);
  }

  return result;
}

export async function getUpcomingEvents(): Promise<CalendarEvent[]> {
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

    const response = await calendar.events.list({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
    });

    const events = (response.data.items || []) as CalendarEvent[];
    const coordinateCache = new Map<
      string,
      Awaited<ReturnType<typeof getCoordinates>>
    >();

    let lastGeocodingRequest = 0;

    for (const event of events) {
      const address = event.location?.trim();

      if (!address) continue;

      if (!coordinateCache.has(address)) {
        // Nominatim: non superare una richiesta al secondo.
        const elapsed = Date.now() - lastGeocodingRequest;

        if (lastGeocodingRequest > 0 && elapsed < 1100) {
          await delay(1100 - elapsed);
        }

        lastGeocodingRequest = Date.now();

        coordinateCache.set(
          address,
          await getCoordinates(address)
        );
      }

      const coordinates = coordinateCache.get(address);

      if (coordinates) {
        event.latitude = coordinates.latitude;
        event.longitude = coordinates.longitude;
      }
    }

    console.log(
      "EVENTI GOOGLE:",
      events.length,
      "EVENTI CON COORDINATE:",
      events.filter(
        (event) =>
          typeof event.latitude === "number" &&
          typeof event.longitude === "number"
      ).length
    );

    return events;
  } catch (error) {
    console.error("GOOGLE CALENDAR ERROR:", error);
    return [];
  }
}
