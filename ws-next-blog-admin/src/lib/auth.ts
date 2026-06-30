import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback_secret_change_me",
);

const COOKIE = process.env.ADMIN_COOKIE_NAME || "admin_session";

export async function signAdminToken(payload: { id: number }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(process.env.JWT_EXPIRES_IN || "7d")
    .sign(SECRET);
}

export async function verifyAdminToken(
  token: string,
): Promise<{ id: number } | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as { id: number };
  } catch {
    return null;
  }
}

export async function getAdminSession(): Promise<{ id: number } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE)?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

export async function setAdminCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearAdminCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE);
}
