import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";

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
  const subCategory = await prisma.subCategory.findUnique({
    where: { id: Number(id) },
    include: { category: { select: { id: true, name: true } } },
  });
  if (!subCategory)
    return NextResponse.json(
      { status: "404", msg: "Not found" },
      { status: 404 },
    );
  return NextResponse.json({ status: "200", data: subCategory });
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
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });
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
  const exists = await prisma.subCategory.findFirst({
    where: { name, NOT: { id: numId } },
  });
  if (exists) {
    return NextResponse.json(
      { status: "422", errors: { name: ["Name already exists"] } },
      { status: 422 },
    );
  }

  const subCategory = await prisma.subCategory.update({
    where: { id: numId },
    data: { categoryId, name, status },
  });
  return NextResponse.json({ status: "200", data: subCategory });
}

// PATCH /api/admin/subcategories/[id] — toggle status
export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const numId = Number(id);
  const subCategory = await prisma.subCategory.findUnique({
    where: { id: numId },
  });
  if (!subCategory)
    return NextResponse.json(
      { status: "404", msg: "Not found" },
      { status: 404 },
    );
  const updated = await prisma.subCategory.update({
    where: { id: numId },
    data: { status: subCategory.status === 1 ? 0 : 1 },
  });
  return NextResponse.json({ status: "200", data: updated });
}

// DELETE /api/admin/subcategories/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const numId = Number(id);

  const codeCount = await prisma.code.count({
    where: { subCategoryId: numId },
  });

  if (codeCount > 0) {
    return NextResponse.json(
      {
        status: "409",
        msg: `Please delete the ${codeCount} code${codeCount === 1 ? "" : "s"} associated with this sub category before deleting it.`,
      },
      { status: 409 },
    );
  }

  await prisma.subCategory.delete({ where: { id: numId } });
  return NextResponse.json({ status: "200", msg: "Sub category deleted." });
}
