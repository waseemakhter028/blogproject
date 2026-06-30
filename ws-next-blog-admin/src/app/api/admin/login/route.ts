import { NextRequest, NextResponse } from "next/server";
import { createHash } from "node:crypto";
import prisma from "@/lib/db";
import { signAdminToken, setAdminCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ status: "401", msg: "All fields required." });
  }

  const passwordMd5 = createHash("md5").update(password).digest("hex");

  const admin = await prisma.superadmin.findFirst({
    where: { email, password: passwordMd5 },
    select: { id: true },
  });

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
