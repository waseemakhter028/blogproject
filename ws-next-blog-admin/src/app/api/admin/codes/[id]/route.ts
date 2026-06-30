import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";

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
  const code = await prisma.code.findUnique({
    where: { id: Number(id) },
    include: {
      subCategory: {
        select: {
          id: true,
          name: true,
          category: { select: { id: true, name: true } },
        },
      },
    },
  });
  if (!code)
    return NextResponse.json(
      { status: "404", msg: "Not found" },
      { status: 404 },
    );
  return NextResponse.json({
    status: "200",
    data: { ...code, image: (code.image as Buffer).toString("utf-8") },
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

  const subCat = await prisma.subCategory.findUnique({
    where: { id: subCategoryId },
  });
  if (!subCat) {
    return NextResponse.json(
      {
        status: "422",
        errors: { subCategoryId: ["Selected sub category does not exist"] },
      },
      { status: 422 },
    );
  }

  const updateData: {
    subCategoryId: number;
    title: string;
    description: string;
    language: string;
    status: number;
    image?: Buffer;
  } = { subCategoryId, title, description, language, status };

  if (image) updateData.image = Buffer.from(image, "utf-8");

  const code = await prisma.code.update({
    where: { id: numId },
    data: updateData,
  });
  return NextResponse.json({
    status: "200",
    data: { ...code, image: (code.image as Buffer).toString("utf-8") },
  });
}

// PATCH /api/admin/codes/[id] — toggle status
export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const numId = Number(id);
  const code = await prisma.code.findUnique({ where: { id: numId } });
  if (!code)
    return NextResponse.json(
      { status: "404", msg: "Not found" },
      { status: 404 },
    );
  const updated = await prisma.code.update({
    where: { id: numId },
    data: { status: code.status === 1 ? 0 : 1 },
  });
  return NextResponse.json({ status: "200", data: updated });
}

// DELETE /api/admin/codes/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await prisma.code.delete({ where: { id: Number(id) } });
  return NextResponse.json({ status: "200", msg: "Code deleted." });
}
