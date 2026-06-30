import { NextResponse } from "next/server";
import { clearAdminCookie } from "@/lib/auth";

export async function POST() {
  await clearAdminCookie();
  return NextResponse.json({ status: "200", msg: "Logged out." });
}
