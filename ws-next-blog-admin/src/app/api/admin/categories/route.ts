import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import type { RowDataPacket, ResultSetHeader } from "mysql2";
import db from "@/lib/db";

const categorySchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(40, "Name must be at most 40 characters")
    .transform((v) =>
      v
        .trim()
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase()),
    ),
  status: z.coerce
    .number()
    .int()
    .refine((v) => v === 0 || v === 1, "Status must be 0 or 1"),
});

const colMap: Record<string, string> = {
  id: "id",
  name: "name",
  status: "status",
  createdAt: "created_at",
};

// GET /api/admin/categories — list with pagination
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const limit = Math.min(100, Number(searchParams.get("limit") ?? 10));
  const skip = (page - 1) * limit;
  const search = searchParams.get("search")?.trim() ?? "";
  const allowedSort = ["id", "name", "status", "createdAt"];
  const sortBy = allowedSort.includes(searchParams.get("sortBy") ?? "")
    ? (searchParams.get("sortBy") as string)
    : "id";
  const sortDir = searchParams.get("sortDir") === "asc" ? "ASC" : "DESC";
  const col = colMap[sortBy] ?? "id";

  const whereClause = search ? "WHERE name LIKE ?" : "";
  const whereParams: (string | number)[] = search ? [`%${search}%`] : [];

  const [[countRows], [data]] = await Promise.all([
    db.execute<RowDataPacket[]>(
      `SELECT COUNT(*) AS total FROM categories ${whereClause}`,
      whereParams,
    ),
    db.execute<RowDataPacket[]>(
      `SELECT id, name, status, created_at AS createdAt, updated_at AS updatedAt FROM categories ${whereClause} ORDER BY ${col} ${sortDir} LIMIT ${limit} OFFSET ${skip}`,
      whereParams,
    ),
  ]);

  return NextResponse.json({
    data,
    total: Number(countRows[0].total),
    page,
    limit,
  });
}

// POST /api/admin/categories — create
export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = categorySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { status: "422", errors: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { name, status } = parsed.data;

  const [[exists]] = await db.execute<RowDataPacket[]>(
    "SELECT id FROM categories WHERE name = ? LIMIT 1",
    [name],
  );
  if (exists) {
    return NextResponse.json(
      { status: "422", errors: { name: ["Name already exists"] } },
      { status: 422 },
    );
  }

  const [result] = await db.execute<ResultSetHeader>(
    "INSERT INTO categories (name, status, created_at, updated_at) VALUES (?, ?, NOW(), NOW())",
    [name, status],
  );
  const [[category]] = await db.execute<RowDataPacket[]>(
    "SELECT id, name, status, created_at AS createdAt, updated_at AS updatedAt FROM categories WHERE id = ?",
    [result.insertId],
  );

  return NextResponse.json({ status: "200", data: category }, { status: 201 });
}
