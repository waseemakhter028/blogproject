import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";

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
  const category = await prisma.category.findUnique({
    where: { id: Number(id) },
  });
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
  const body = await req.json();
  const parsed = categorySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { status: "422", errors: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { name, status } = parsed.data;

  const exists = await prisma.category.findFirst({
    where: { name, NOT: { id: Number(id) } },
  });
  if (exists) {
    return NextResponse.json(
      { status: "422", errors: { name: ["Name already exists"] } },
      { status: 422 },
    );
  }

  const category = await prisma.category.update({
    where: { id: Number(id) },
    data: { name, status },
  });
  return NextResponse.json({ status: "200", data: category });
}

// PATCH /api/admin/categories/[id] — toggle status
export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const numId = Number(id);
  const category = await prisma.category.findUnique({ where: { id: numId } });
  if (!category)
    return NextResponse.json(
      { status: "404", msg: "Not found" },
      { status: 404 },
    );
  const updated = await prisma.category.update({
    where: { id: numId },
    data: { status: category.status === 1 ? 0 : 1 },
  });
  return NextResponse.json({ status: "200", data: updated });
}

// DELETE /api/admin/categories/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const numId = Number(id);

  const subCatCount = await prisma.subCategory.count({
    where: { categoryId: numId },
  });

  if (subCatCount > 0) {
    return NextResponse.json(
      {
        status: "409",
        msg: `Please delete the ${subCatCount} sub categor${subCatCount === 1 ? "y" : "ies"} associated with this category before deleting it.`,
      },
      { status: 409 },
    );
  }

  await prisma.category.delete({ where: { id: numId } });
  return NextResponse.json({ status: "200", msg: "Category deleted." });
}
