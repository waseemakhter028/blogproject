import { NextRequest, NextResponse } from "next/server";
import type { RowDataPacket } from "mysql2";
import db from "@/lib/db";

// GET /api/home?page=1
// Returns active categories (with subcategories) + paginated active codes
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const perPage = 9;
    const skip = (page - 1) * perPage;

    const [[categories], [subcategories], [countRows], [codes]] =
      await Promise.all([
        db.execute<RowDataPacket[]>(
          "SELECT id, name FROM categories WHERE status = 1 ORDER BY name ASC",
        ),
        db.execute<RowDataPacket[]>(
          "SELECT id, name, category_id FROM sub_categories WHERE status = 1 ORDER BY name ASC",
        ),
        db.execute<RowDataPacket[]>(
          "SELECT COUNT(*) AS total FROM codes WHERE status = 1",
        ),
        db.execute<RowDataPacket[]>(
          `SELECT id, sub_category_id AS subCategoryId, image, title,
                  language, status, created_at AS createdAt, updated_at AS updatedAt
           FROM codes WHERE status = 1 ORDER BY id DESC LIMIT ${perPage} OFFSET ${skip}`,
        ),
      ]);

    // Group subcategories under their category
    const catMap = new Map<
      number,
      {
        id: number;
        name: string;
        SubCategories: { id: number; name: string }[];
      }
    >();
    for (const cat of categories) {
      catMap.set(cat.id, { id: cat.id, name: cat.name, SubCategories: [] });
    }
    for (const sc of subcategories) {
      catMap
        .get(sc.category_id)
        ?.SubCategories.push({ id: sc.id, name: sc.name });
    }

    return NextResponse.json(
      {
        categories: Array.from(catMap.values()),
        codes: {
          data: codes.map((c) => ({
            ...c,
            image: (c.image as Buffer).toString("utf-8"),
          })),
          current_page: page,
          per_page: perPage,
          total: Number(countRows[0].total),
        },
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
        },
      },
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
