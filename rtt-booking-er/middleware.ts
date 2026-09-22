import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const auth = request.headers.get("authorization");

  if (!auth) {
    return new NextResponse("Authentication required", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="RTT Admin"',
      },
    });
  }

  const [, encoded] = auth.split(" ");

  const decoded = Buffer.from(
    encoded,
    "base64"
  ).toString();

  const [username, password] =
    decoded.split(":");

  if (
    username === "admin" &&
    password === process.env.ADMIN_PASSWORD
  ) {
    return NextResponse.next();
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