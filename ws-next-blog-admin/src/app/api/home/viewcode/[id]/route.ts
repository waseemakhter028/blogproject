import { NextRequest, NextResponse } from "next/server";
import type { RowDataPacket } from "mysql2";
import db from "@/lib/db";

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

    const [[row]] = await db.execute<RowDataPacket[]>(
      `SELECT co.id, co.sub_category_id AS subCategoryId, co.image, co.title,
              co.description, co.language, co.status,
              co.created_at AS createdAt, co.updated_at AS updatedAt,
              sc.id AS sc_id, sc.name AS sc_name,
              c.id AS cat_id, c.name AS cat_name
       FROM codes co
       LEFT JOIN sub_categories sc ON sc.id = co.sub_category_id
       LEFT JOIN categories c ON c.id = sc.category_id
       WHERE co.id = ? AND co.status = 1`,
      [Number(id)],
    );

    if (!row) {
      return NextResponse.json(
        { status: "404", msg: "Not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        status: "200",
        data: {
          id: row.id,
          subCategoryId: row.subCategoryId,
          image: (row.image as Buffer).toString("utf-8"),
          title: row.title,
          description: row.description,
          language: row.language,
          status: row.status,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
          subCategory: {
            id: row.sc_id,
            name: row.sc_name,
            category: { id: row.cat_id, name: row.cat_name },
          },
        },
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        },
      },
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
