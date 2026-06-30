import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

// GET /api/home?page=1
// Returns active categories (with subcategories) + paginated active codes
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const perPage = 9;
    const skip = (page - 1) * perPage;

    const [categories, codes, total] = await Promise.all([
      prisma.category.findMany({
        where: { status: 1 },
        orderBy: { name: "asc" },
        select: {
          id: true,
          name: true,
          subCategories: {
            where: { status: 1 },
            orderBy: { name: "asc" },
            select: { id: true, name: true },
          },
        },
      }),
      prisma.code.findMany({
        where: { status: 1 },
        orderBy: { id: "desc" },
        skip,
        take: perPage,
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
      }),
      prisma.code.count({ where: { status: 1 } }),
    ]);

    // Reshape categories to match React app's expected shape
    const categoryData = categories.map((c) => ({
      id: c.id,
      name: c.name,
      SubCategories: c.subCategories,
    }));

    const codesData = codes.map((c) => ({
      ...c,
      image: (c.image as Buffer).toString("utf-8"),
    }));

    return NextResponse.json({
      categories: categoryData,
      codes: {
        data: codesData,
        current_page: page,
        per_page: perPage,
        total,
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
