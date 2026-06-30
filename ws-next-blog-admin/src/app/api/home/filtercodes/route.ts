import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

// POST /api/home/filtercodes
// Body: { subcat_ids: number[] }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const subcatIds: number[] = Array.isArray(body.subcat_ids)
      ? body.subcat_ids.map(Number).filter(Boolean)
      : [];

    if (subcatIds.length === 0) {
      return NextResponse.json({ data: [] });
    }

    const codes = await prisma.code.findMany({
      where: { status: 1, subCategoryId: { in: subcatIds } },
      orderBy: { id: "desc" },
      select: {
        id: true,
        title: true,
        image: true,
        description: true,
        language: true,
        status: true,
        subCategoryId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      data: codes.map((c) => ({
        ...c,
        image: (c.image as Buffer).toString("utf-8"),
      })),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
