import { NextRequest, NextResponse } from "next/server";
import type { RowDataPacket } from "mysql2";
import db from "@/lib/db";

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

    const placeholders = subcatIds.map(() => "?").join(", ");
    const [codes] = await db.execute<RowDataPacket[]>(
      `SELECT id, sub_category_id AS subCategoryId, image, title,
              language, status, created_at AS createdAt, updated_at AS updatedAt
       FROM codes WHERE status = 1 AND sub_category_id IN (${placeholders}) ORDER BY id DESC`,
      subcatIds,
    );

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
