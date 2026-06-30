import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

// GET /api/home/viewcode/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    if (Number.isNaN(Number(id))) {
      return NextResponse.json(
        { status: "404", msg: "Not found" },
        { status: 404 },
      );
    }

    const code = await prisma.code.findFirst({
      where: { id: Number(id), status: 1 },
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
        subCategory: {
          select: {
            id: true,
            name: true,
            category: { select: { id: true, name: true } },
          },
        },
      },
    });

    if (!code) {
      return NextResponse.json(
        { status: "404", msg: "Not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      status: "200",
      data: { ...code, image: (code.image as Buffer).toString("utf-8") },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
