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

// GET /api/admin/categories/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const [[category]] = await db.execute<RowDataPacket[]>(
    "SELECT id, name, status, created_at AS createdAt, updated_at AS updatedAt FROM categories WHERE id = ?",
    [Number(id)],
  );
  if (!category)
    return NextResponse.json(
      { status: "404", msg: "Not found" },
      { status: 404 },
    );
  return NextResponse.json({ status: "200", data: category });
}

// PUT /api/admin/categories/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const numId = Number(id);
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
    "SELECT id FROM categories WHERE name = ? AND id != ? LIMIT 1",
    [name, numId],
  );
  if (exists) {
    return NextResponse.json(
      { status: "422", errors: { name: ["Name already exists"] } },
      { status: 422 },
    );
  }

  await db.execute<ResultSetHeader>(
    "UPDATE categories SET name = ?, status = ?, updated_at = NOW() WHERE id = ?",
    [name, status, numId],
  );
  const [[category]] = await db.execute<RowDataPacket[]>(
    "SELECT id, name, status, created_at AS createdAt, updated_at AS updatedAt FROM categories WHERE id = ?",
    [numId],
  );
  return NextResponse.json({ status: "200", data: category });
}

// PATCH /api/admin/categories/[id] — toggle status
export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const numId = Number(id);
  const [[category]] = await db.execute<RowDataPacket[]>(
    "SELECT id, status FROM categories WHERE id = ?",
    [numId],
  );
  if (!category)
    return NextResponse.json(
      { status: "404", msg: "Not found" },
      { status: 404 },
    );
  const newStatus = category.status === 1 ? 0 : 1;
  await db.execute<ResultSetHeader>(
    "UPDATE categories SET status = ?, updated_at = NOW() WHERE id = ?",
    [newStatus, numId],
  );
  const [[updated]] = await db.execute<RowDataPacket[]>(
    "SELECT id, name, status, created_at AS createdAt, updated_at AS updatedAt FROM categories WHERE id = ?",
    [numId],
  );
  return NextResponse.json({ status: "200", data: updated });
}

// DELETE /api/admin/categories/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const numId = Number(id);

  const [[{ subCatCount }]] = await db.execute<RowDataPacket[]>(
    "SELECT COUNT(*) AS subCatCount FROM sub_categories WHERE category_id = ?",
    [numId],
  );
  const count = Number(subCatCount);
  if (count > 0) {
    return NextResponse.json(
      {
        status: "409",
        msg: `Please delete the ${count} sub categor${count === 1 ? "y" : "ies"} associated with this category before deleting it.`,
      },
      { status: 409 },
    );
  }

  await db.execute<ResultSetHeader>("DELETE FROM categories WHERE id = ?", [
    numId,
  ]);
  return NextResponse.json({ status: "200", msg: "Category deleted." });
}
