
import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const auth = request.headers.get("authorization");

  if (!auth?.startsWith("Basic ")) {
    return new NextResponse("Authentication required", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="RTT Admin"',
      },
    });
  }

  try {
    const encoded = auth.slice(6);
    const decoded = atob(encoded);
    const separator = decoded.indexOf(":");

    if (separator === -1) {
      throw new Error("Invalid Basic authentication");
    }

    const username = decoded.slice(0, separator);
    const password = decoded.slice(separator + 1);

    if (
      username === "admin" &&
      password === process.env.ADMIN_PASSWORD
    ) {
      return NextResponse.next();
    }
  } catch {
    // Credenziali non valide o malformate
  }

  return new NextResponse("Access denied", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="RTT Admin"',
    },
  });
}

export const config = {
  matcher: ["/admin/:path*"],
};
