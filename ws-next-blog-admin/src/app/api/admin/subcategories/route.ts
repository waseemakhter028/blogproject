import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import type { RowDataPacket, ResultSetHeader } from "mysql2";
import db from "@/lib/db";

const subCategorySchema = z.object({
  categoryId: z.coerce
    .number({ error: "Please select a category" })
    .int()
    .positive("Please select a category"),
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

const scColMap: Record<string, string> = {
  id: "sc.id",
  name: "sc.name",
  status: "sc.status",
  createdAt: "sc.created_at",
  categoryName: "cat_name",
  codesCount: "codesCount",
};

const scBaseSelect = `
  SELECT
    sc.id, sc.name, sc.category_id AS categoryId, sc.status,
    sc.created_at AS createdAt, sc.updated_at AS updatedAt,
    c.id AS cat_id, c.name AS cat_name,
    (SELECT COUNT(*) FROM codes WHERE sub_category_id = sc.id) AS codesCount
  FROM sub_categories sc
  LEFT JOIN categories c ON c.id = sc.category_id
`;

// GET /api/admin/subcategories?page=&limit=&categoryId=
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const limit = Math.min(
    100,
    Math.max(1, Number(searchParams.get("limit") ?? 10)),
  );
  const skip = (page - 1) * limit;
  const categoryIdParam = searchParams.get("categoryId");
  const search = searchParams.get("search")?.trim() ?? "";
  const allowedSort = [
    "id",
    "name",
    "status",
    "createdAt",
    "categoryName",
    "codesCount",
  ];
  const sortBy = allowedSort.includes(searchParams.get("sortBy") ?? "")
    ? (searchParams.get("sortBy") as string)
    : "id";
  const sortDir = searchParams.get("sortDir") === "asc" ? "ASC" : "DESC";

  const conditions: string[] = [];
  const whereParams: (string | number)[] = [];
  if (categoryIdParam) {
    conditions.push("sc.category_id = ?");
    whereParams.push(Number(categoryIdParam));
  }
  if (search) {
    conditions.push("sc.name LIKE ?");
    whereParams.push(`%${search}%`);
  }
  const whereClause = conditions.length
    ? `WHERE ${conditions.join(" AND ")}`
    : "";

  const orderCol = categoryIdParam ? "sc.name" : (scColMap[sortBy] ?? "sc.id");
  const orderDir = categoryIdParam ? "ASC" : sortDir;

  const [[countRows], [rows]] = await Promise.all([
    db.execute<RowDataPacket[]>(
      `SELECT COUNT(*) AS total FROM sub_categories sc ${whereClause}`,
      whereParams,
    ),
    db.execute<RowDataPacket[]>(
      `${scBaseSelect} ${whereClause} ORDER BY ${orderCol} ${orderDir} LIMIT ${limit} OFFSET ${skip}`,
      whereParams,
    ),
  ]);

  const data = rows.map((row) => ({
    id: row.id,
    name: row.name,
    categoryId: row.categoryId,
    status: row.status,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    category: { id: row.cat_id, name: row.cat_name },
    _count: { codes: Number(row.codesCount) },
  }));

  return NextResponse.json({
    status: "200",
    data,
    total: Number(countRows[0].total),
  });
}

// POST /api/admin/subcategories
export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = subCategorySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        status: "422",
        errors: parsed.error.flatten((i) => i.message).fieldErrors,
      },
      { status: 422 },
    );
  }

  const { categoryId, name, status } = parsed.data;

  // Check category exists
  const [[category]] = await db.execute<RowDataPacket[]>(
    "SELECT id FROM categories WHERE id = ? LIMIT 1",
    [categoryId],
  );
  if (!category) {
    return NextResponse.json(
      {
        status: "422",
        errors: { categoryId: ["Selected category does not exist"] },
      },
      { status: 422 },
    );
  }

  // Check name uniqueness
  const [[exists]] = await db.execute<RowDataPacket[]>(
    "SELECT id FROM sub_categories WHERE name = ? LIMIT 1",
    [name],
  );
  if (exists) {
    return NextResponse.json(
      { status: "422", errors: { name: ["Name already exists"] } },
      { status: 422 },
    );
  }

  const [result] = await db.execute<ResultSetHeader>(
    "INSERT INTO sub_categories (name, category_id, status, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())",
    [name, categoryId, status],
  );
  const [[subCategory]] = await db.execute<RowDataPacket[]>(
    "SELECT id, name, category_id AS categoryId, status, created_at AS createdAt, updated_at AS updatedAt FROM sub_categories WHERE id = ?",
    [result.insertId],
  );

  return NextResponse.json(
    { status: "200", data: subCategory },
    { status: 201 },
  );
}
