import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import type { RowDataPacket, ResultSetHeader } from "mysql2";
import db from "@/lib/db";

const codeUpdateSchema = z.object({
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
  image: z.string().optional(),
});

// GET /api/admin/codes/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const [[row]] = await db.execute<RowDataPacket[]>(
    `SELECT co.id, co.sub_category_id AS subCategoryId, co.image, co.title,
            co.description, co.language, co.status,
            co.created_at AS createdAt, co.updated_at AS updatedAt,
            sc.id AS sc_id, sc.name AS sc_name,
            c.id AS cat_id, c.name AS cat_name
     FROM codes co
     LEFT JOIN sub_categories sc ON sc.id = co.sub_category_id
     LEFT JOIN categories c ON c.id = sc.category_id
     WHERE co.id = ?`,
    [Number(id)],
  );
  if (!row)
    return NextResponse.json(
      { status: "404", msg: "Not found" },
      { status: 404 },
    );
  return NextResponse.json({
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
  });
}

// PUT /api/admin/codes/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const numId = Number(id);
  const body = await req.json();
  const parsed = codeUpdateSchema.safeParse(body);

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

  if (image) {
    await db.execute<ResultSetHeader>(
      "UPDATE codes SET sub_category_id = ?, title = ?, description = ?, language = ?, status = ?, image = ?, updated_at = NOW() WHERE id = ?",
      [
        subCategoryId,
        title,
        description,
        language,
        status,
        Buffer.from(image, "utf-8"),
        numId,
      ],
    );
  } else {
    await db.execute<ResultSetHeader>(
      "UPDATE codes SET sub_category_id = ?, title = ?, description = ?, language = ?, status = ?, updated_at = NOW() WHERE id = ?",
      [subCategoryId, title, description, language, status, numId],
    );
  }
  const [[row]] = await db.execute<RowDataPacket[]>(
    "SELECT id, sub_category_id AS subCategoryId, image, title, description, language, status, created_at AS createdAt, updated_at AS updatedAt FROM codes WHERE id = ?",
    [numId],
  );
  return NextResponse.json({
    status: "200",
    data: { ...row, image: (row.image as Buffer).toString("utf-8") },
  });
}

// PATCH /api/admin/codes/[id] — toggle status
export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const numId = Number(id);
  const [[code]] = await db.execute<RowDataPacket[]>(
    "SELECT id, status FROM codes WHERE id = ?",
    [numId],
  );
  if (!code)
    return NextResponse.json(
      { status: "404", msg: "Not found" },
      { status: 404 },
    );
  const newStatus = code.status === 1 ? 0 : 1;
  await db.execute<ResultSetHeader>(
    "UPDATE codes SET status = ?, updated_at = NOW() WHERE id = ?",
    [newStatus, numId],
  );
  const [[updated]] = await db.execute<RowDataPacket[]>(
    "SELECT id, sub_category_id AS subCategoryId, title, description, language, status, created_at AS createdAt, updated_at AS updatedAt FROM codes WHERE id = ?",
    [numId],
  );
  return NextResponse.json({ status: "200", data: updated });
}

// DELETE /api/admin/codes/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await db.execute<ResultSetHeader>("DELETE FROM codes WHERE id = ?", [
    Number(id),
  ]);
  return NextResponse.json({ status: "200", msg: "Code deleted." });
}
