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

// GET /api/admin/subcategories/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const [[row]] = await db.execute<RowDataPacket[]>(
    `SELECT sc.id, sc.name, sc.category_id AS categoryId, sc.status,
            sc.created_at AS createdAt, sc.updated_at AS updatedAt,
            c.id AS cat_id, c.name AS cat_name
     FROM sub_categories sc
     LEFT JOIN categories c ON c.id = sc.category_id
     WHERE sc.id = ?`,
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
      name: row.name,
      categoryId: row.categoryId,
      status: row.status,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      category: { id: row.cat_id, name: row.cat_name },
    },
  });
}

// PUT /api/admin/subcategories/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const numId = Number(id);
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

  // Check name uniqueness excluding self
  const [[exists]] = await db.execute<RowDataPacket[]>(
    "SELECT id FROM sub_categories WHERE name = ? AND id != ? LIMIT 1",
    [name, numId],
  );
  if (exists) {
    return NextResponse.json(
      { status: "422", errors: { name: ["Name already exists"] } },
      { status: 422 },
    );
  }

  await db.execute<ResultSetHeader>(
    "UPDATE sub_categories SET name = ?, category_id = ?, status = ?, updated_at = NOW() WHERE id = ?",
    [name, categoryId, status, numId],
  );
  const [[subCategory]] = await db.execute<RowDataPacket[]>(
    "SELECT id, name, category_id AS categoryId, status, created_at AS createdAt, updated_at AS updatedAt FROM sub_categories WHERE id = ?",
    [numId],
  );
  return NextResponse.json({ status: "200", data: subCategory });
}

// PATCH /api/admin/subcategories/[id] — toggle status
export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const numId = Number(id);
  const [[subCategory]] = await db.execute<RowDataPacket[]>(
    "SELECT id, status FROM sub_categories WHERE id = ?",
    [numId],
  );
  if (!subCategory)
    return NextResponse.json(
      { status: "404", msg: "Not found" },
      { status: 404 },
    );
  const newStatus = subCategory.status === 1 ? 0 : 1;
  await db.execute<ResultSetHeader>(
    "UPDATE sub_categories SET status = ?, updated_at = NOW() WHERE id = ?",
    [newStatus, numId],
  );
  const [[updated]] = await db.execute<RowDataPacket[]>(
    "SELECT id, name, category_id AS categoryId, status, created_at AS createdAt, updated_at AS updatedAt FROM sub_categories WHERE id = ?",
    [numId],
  );
  return NextResponse.json({ status: "200", data: updated });
}

// DELETE /api/admin/subcategories/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const numId = Number(id);

  const [[{ codeCount }]] = await db.execute<RowDataPacket[]>(
    "SELECT COUNT(*) AS codeCount FROM codes WHERE sub_category_id = ?",
    [numId],
  );
  const count = Number(codeCount);
  if (count > 0) {
    return NextResponse.json(
      {
        status: "409",
        msg: `Please delete the ${count} code${count === 1 ? "" : "s"} associated with this sub category before deleting it.`,
      },
      { status: 409 },
    );
  }

  await db.execute<ResultSetHeader>("DELETE FROM sub_categories WHERE id = ?", [
    numId,
  ]);
  return NextResponse.json({ status: "200", msg: "Sub category deleted." });
}
