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

// GET /api/admin/categories — list with pagination
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const limit = Math.min(100, Number(searchParams.get("limit") ?? 10));
  const skip = (page - 1) * limit;
  const search = searchParams.get("search")?.trim() ?? "";
  const allowedSort = ["id", "name", "status", "createdAt"];
  const sortBy = allowedSort.includes(searchParams.get("sortBy") ?? "")
    ? (searchParams.get("sortBy") as string)
    : "id";
  const sortDir = searchParams.get("sortDir") === "asc" ? "asc" : "desc";

  const where = search ? { name: { contains: search } } : {};

  const [data, total] = await Promise.all([
    prisma.category.findMany({
      where,
      orderBy: { [sortBy]: sortDir },
      skip,
      take: limit,
    }),
    prisma.category.count({ where }),
  ]);

  return NextResponse.json({ data, total, page, limit });
}

// POST /api/admin/categories — create
export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = categorySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { status: "422", errors: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { name, status } = parsed.data;

  const exists = await prisma.category.findFirst({ where: { name } });
  if (exists) {
    return NextResponse.json(
      { status: "422", errors: { name: ["Name already exists"] } },
      { status: 422 },
    );
  }

  const category = await prisma.category.create({ data: { name, status } });
  return NextResponse.json({ status: "200", data: category }, { status: 201 });
}
