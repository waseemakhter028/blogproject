import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/db";

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
    const sortDir: Prisma.SortOrder =
      searchParams.get("sortDir") === "asc" ? "asc" : "desc";

    const where = search ? { title: { contains: search } } : {};

    const buildOrderBy = (): Prisma.CodeOrderByWithRelationInput => {
      if (sortBy === "subCategoryName")
        return { subCategory: { name: sortDir } };
      if (sortBy === "categoryName")
        return { subCategory: { category: { name: sortDir } } };
      return { [sortBy]: sortDir };
    };

    const [data, total] = await Promise.all([
      prisma.code.findMany({
        where,
        skip,
        take: limit,
        orderBy: buildOrderBy(),
        include: {
          subCategory: {
            select: {
              id: true,
              name: true,
              category: { select: { id: true, name: true } },
            },
          },
        },
      }),
      prisma.code.count({ where }),
    ]);

    const serializedData = data.map((c) => ({
      ...c,
      image: (c.image as Buffer).toString("utf-8"),
    }));

    return NextResponse.json({ status: "200", data: serializedData, total });
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

  const code = await prisma.code.create({
    data: {
      subCategoryId,
      title,
      description,
      language,
      status,
      image: Buffer.from(image, "utf-8"),
    },
  });

  return NextResponse.json(
    { status: "200", data: { ...code, image } },
    { status: 201 },
  );
}
