import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  const [cat, subcat, code, latest_cat] = await Promise.all([
    prisma.category.count(),
    prisma.subCategory.count(),
    prisma.code.count(),
    prisma.category.findMany({
      orderBy: { id: "desc" },
      take: 8,
      select: { id: true, name: true, createdAt: true },
    }),
  ]);

  return NextResponse.json({
    cat,
    subcat,
    code,
    latest_cat: latest_cat.map((c) => ({
      id: c.id,
      name: c.name,
      created_at: c.createdAt,
    })),
  });
}
