import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback_secret_change_me",
);
const COOKIE = process.env.ADMIN_COOKIE_NAME || "admin_session";

async function verifyToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, SECRET);
    return true;
  } catch {
    return false;
  }
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/adminpanel") &&
    !pathname.startsWith("/adminpanel/login")
  ) {
    const token = req.cookies.get(COOKIE)?.value;
    const valid = token ? await verifyToken(token) : false;

    if (!valid) {
      return NextResponse.redirect(new URL("/adminpanel/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/adminpanel/:path*"],
};
