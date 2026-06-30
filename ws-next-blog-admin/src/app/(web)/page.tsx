import db from "@/lib/db";
import type { RowDataPacket } from "mysql2";
import HomePageClient from "./HomePageClient";

const PER_PAGE = 6;

export default async function HomePage({
  searchParams,
}: Readonly<{
  searchParams: Promise<{ page?: string }>;
}>) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam ?? 1));
  const skip = (page - 1) * PER_PAGE;

  const [[categories], [subcategories], [countRows], [codes]] =
    await Promise.all([
      db.execute<RowDataPacket[]>(
        "SELECT id, name FROM categories WHERE status = 1 ORDER BY name ASC",
      ),
      db.execute<RowDataPacket[]>(
        "SELECT id, name, category_id FROM sub_categories WHERE status = 1 ORDER BY name ASC",
      ),
      db.execute<RowDataPacket[]>(
        "SELECT COUNT(*) AS total FROM codes WHERE status = 1",
      ),
      db.execute<RowDataPacket[]>(
        `SELECT id, image, title, language
         FROM codes WHERE status = 1 ORDER BY id DESC LIMIT ${PER_PAGE} OFFSET ${skip}`,
      ),
    ]);

  const catMap = new Map<
    number,
    { id: number; name: string; SubCategories: { id: number; name: string }[] }
  >();
  for (const cat of categories)
    catMap.set(cat.id, { id: cat.id, name: cat.name, SubCategories: [] });
  for (const sc of subcategories)
    catMap
      .get(sc.category_id)
      ?.SubCategories.push({ id: sc.id, name: sc.name });

  const total = Number(countRows[0].total);
  const totalPages = Math.ceil(total / PER_PAGE);

  return (
    <HomePageClient
      categories={Array.from(catMap.values())}
      codes={codes.map((c) => ({
        id: c.id as number,
        image: c.image ? (c.image as Buffer).toString("utf-8") : null,
        title: c.title as string,
        language: c.language as string,
      }))}
      currentPage={Math.min(page, Math.max(1, totalPages))}
      totalPages={totalPages}
    />
  );
}
