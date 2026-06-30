import { NextRequest, NextResponse } from "next/server";
import { createHash } from "node:crypto";
import type { RowDataPacket } from "mysql2";
import db from "@/lib/db";
import { signAdminToken, setAdminCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ status: "401", msg: "All fields required." });
  }

  const passwordMd5 = createHash("md5").update(password).digest("hex");

  const [[admin]] = await db.execute<RowDataPacket[]>(
    "SELECT id FROM super_admins WHERE email = ? AND password = ? LIMIT 1",
    [email, passwordMd5],
  );

  if (!admin) {
    return NextResponse.json({
      status: "401",
      msg: "Invalid e-mail or password.",
    });
  }

  const token = await signAdminToken({ id: admin.id });
  await setAdminCookie(token);

  return NextResponse.json({ status: "200", msg: "Signing in ..." });
}
