import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import type { RowDataPacket, ResultSetHeader } from "mysql2";
import db from "@/lib/db";

const codeSchema = z.object({
  subCategoryId: z.coerce
    .number({ error: "Please select a sub category" })
    .int()
    .positive("Please select a sub category"),
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be at most 200 characters")
    .transform((v) => v.trim()),
  description: z
    .string()
    .min(1, "Description is required")
    .transform((v) => v.trim()),
  language: z
    .string()
    .min(1, "Language is required")
    .max(50, "Language must be at most 50 characters")
    .transform((v) => v.trim()),
  status: z.coerce
    .number()
    .int()
    .refine((v) => v === 0 || v === 1, "Status must be 0 or 1"),
  image: z.string().min(1, "Image is required"),
});

const codeColMap: Record<string, string> = {
  id: "co.id",
  title: "co.title",
  language: "co.language",
  status: "co.status",
  createdAt: "co.created_at",
  subCategoryName: "sc_name",
  categoryName: "cat_name",
};

const codeBaseSelect = `
  SELECT
    co.id, co.sub_category_id AS subCategoryId, co.image, co.title,
    co.description, co.language, co.status,
    co.created_at AS createdAt, co.updated_at AS updatedAt,
    sc.id AS sc_id, sc.name AS sc_name,
    c.id AS cat_id, c.name AS cat_name
  FROM codes co
  LEFT JOIN sub_categories sc ON sc.id = co.sub_category_id
  LEFT JOIN categories c ON c.id = sc.category_id
`;

// GET /api/admin/codes?page=&limit=
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const limit = Math.min(
      100,
      Math.max(1, Number(searchParams.get("limit") ?? 10)),
    );
    const skip = (page - 1) * limit;
    const search = searchParams.get("search")?.trim() ?? "";
    const allowedSort = [
      "id",
      "title",
      "language",
      "status",
      "createdAt",
      "subCategoryName",
      "categoryName",
    ];
    const sortBy = allowedSort.includes(searchParams.get("sortBy") ?? "")
      ? (searchParams.get("sortBy") as string)
      : "id";
    const sortDir = searchParams.get("sortDir") === "asc" ? "ASC" : "DESC";

    const col = codeColMap[sortBy] ?? "co.id";

    const whereClause = search ? "WHERE co.title LIKE ?" : "";
    const whereParams: (string | number)[] = search ? [`%${search}%`] : [];

    const [[countRows], [rows]] = await Promise.all([
      db.execute<RowDataPacket[]>(
        `SELECT COUNT(*) AS total FROM codes co ${whereClause}`,
        whereParams,
      ),
      db.execute<RowDataPacket[]>(
        `${codeBaseSelect} ${whereClause} ORDER BY ${col} ${sortDir} LIMIT ${limit} OFFSET ${skip}`,
        whereParams,
      ),
    ]);

    const data = rows.map((row) => ({
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
    }));

    return NextResponse.json({
      status: "200",
      data,
      total: Number(countRows[0].total),
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ status: "500", msg: message }, { status: 500 });
  }
}

// POST /api/admin/codes
export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = codeSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        status: "422",
        errors: parsed.error.flatten((i) => i.message).fieldErrors,
      },
      { status: 422 },
    );
  }

  const { subCategoryId, title, description, language, status, image } =
    parsed.data;

  const [[subCat]] = await db.execute<RowDataPacket[]>(
    "SELECT id FROM sub_categories WHERE id = ? LIMIT 1",
    [subCategoryId],
  );
  if (!subCat) {
    return NextResponse.json(
      {
        status: "422",
        errors: { subCategoryId: ["Selected sub category does not exist"] },
      },
      { status: 422 },
    );
  }

  const [result] = await db.execute<ResultSetHeader>(
    "INSERT INTO codes (sub_category_id, title, description, language, status, image, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())",
    [
      subCategoryId,
      title,
      description,
      language,
      status,
      Buffer.from(image, "utf-8"),
    ],
  );
  const [[code]] = await db.execute<RowDataPacket[]>(
    "SELECT id, sub_category_id AS subCategoryId, title, description, language, status, created_at AS createdAt, updated_at AS updatedAt FROM codes WHERE id = ?",
    [result.insertId],
  );

  return NextResponse.json(
    { status: "200", data: { ...code, image } },
    { status: 201 },
  );
}
