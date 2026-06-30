import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";

const subCategorySchema = z.object({
  categoryId: z.coerce
    .number({ invalid_type_error: "Please select a category" })
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
  const sortDir = searchParams.get("sortDir") === "asc" ? "asc" : "desc";

  const where = {
    ...(categoryIdParam ? { categoryId: Number(categoryIdParam) } : {}),
    ...(search ? { name: { contains: search } } : {}),
  };

  const buildOrderBy = () => {
    if (categoryIdParam) return { name: "asc" as const };
    if (sortBy === "categoryName") return { category: { name: sortDir } };
    if (sortBy === "codesCount") return { codes: { _count: sortDir } };
    return { [sortBy]: sortDir };
  };

  const [data, total] = await Promise.all([
    prisma.subCategory.findMany({
      where,
      skip,
      take: limit,
      orderBy: buildOrderBy(),
      include: {
        category: { select: { id: true, name: true } },
        _count: { select: { codes: true } },
      },
    }),
    prisma.subCategory.count({ where }),
  ]);

  return NextResponse.json({ status: "200", data, total });
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

  // Check name uniqueness
  const exists = await prisma.subCategory.findFirst({ where: { name } });
  if (exists) {
    return NextResponse.json(
      { status: "422", errors: { name: ["Name already exists"] } },
      { status: 422 },
    );
  }

  const subCategory = await prisma.subCategory.create({
    data: { categoryId, name, status },
  });

  return NextResponse.json(
    { status: "200", data: subCategory },
    { status: 201 },
  );
}
