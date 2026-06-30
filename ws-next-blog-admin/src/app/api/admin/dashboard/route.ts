import { NextResponse } from "next/server";
import type { RowDataPacket } from "mysql2";
import db from "@/lib/db";

export async function GET() {
  const [[catRows], [subcatRows], [codeRows], [latest]] = await Promise.all([
    db.execute<RowDataPacket[]>("SELECT COUNT(*) AS total FROM categories"),
    db.execute<RowDataPacket[]>("SELECT COUNT(*) AS total FROM sub_categories"),
    db.execute<RowDataPacket[]>("SELECT COUNT(*) AS total FROM codes"),
    db.execute<RowDataPacket[]>(
      "SELECT id, name, created_at FROM categories ORDER BY id DESC LIMIT 8",
    ),
  ]);

  return NextResponse.json({
    cat: Number(catRows[0].total),
    subcat: Number(subcatRows[0].total),
    code: Number(codeRows[0].total),
    latest_cat: latest.map((c) => ({
      id: c.id,
      name: c.name,
      created_at: c.created_at,
    })),
  });
}
