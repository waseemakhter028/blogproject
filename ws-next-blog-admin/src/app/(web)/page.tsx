"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import WebLoader from "@/components/web/WebLoader";

/* ─── Types ──────────────────────────────────────────────────────────── */
interface SubCategory {
  id: number;
  name: string;
}
interface Category {
  id: number;
  name: string;
  SubCategories: SubCategory[];
}
interface CodeItem {
  id: number;
  title: string;
  image: string | null;
  description: string;
  language: string;
}
interface Pages {
  current_page: number;
  per_page: number;
  total: number;
}

/* ─── Helpers ──────────────────────────────────────────────────────────── */
const imgSrc = (img: string | null) => {
  if (!img) return null;
  return img.startsWith("data:") ? img : `data:image/jpeg;base64,${img}`;
};

/* ─── Card ──────────────────────────────────────────────────────────── */
function CodeCard({ code }: Readonly<{ code: CodeItem }>) {
  const src = imgSrc(code.image);
  return (
    <div
      style={{
        background: "#16213e",
        border: "1px solid #0f3460",
        borderRadius: 10,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={code.title}
          style={{ width: "100%", height: 180, objectFit: "cover" }}
        />
      ) : (
        <div
          style={{
            width: "100%",
            height: 180,
            background: "#0f3460",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ color: "#555", fontSize: 13 }}>No image</span>
        </div>
      )}
      <div
        style={{
          padding: "14px 16px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <p
          style={{
            color: "#e0e0e0",
            fontWeight: 600,
            fontSize: 15,
            marginBottom: 12,
            lineHeight: 1.4,
          }}
        >
          {code.title}
        </p>
        <Link
          href={`/viewcode/${code.id}`}
          style={{
            display: "inline-block",
            background: "#e94560",
            color: "#fff",
            padding: "7px 20px",
            borderRadius: 6,
            textDecoration: "none",
            fontWeight: 600,
            fontSize: 14,
            alignSelf: "flex-start",
          }}
        >
          View
        </Link>
      </div>
    </div>
  );
}

/* ─── Sidebar ──────────────────────────────────────────────────────────── */
function Sidebar({
  categories,
  selectedSubIds,
  onToggle,
  onClear,
  loadingFilter,
}: Readonly<{
  categories: Category[];
  selectedSubIds: number[];
  onToggle: (subId: number, catId: number) => void;
  onClear: () => void;
  loadingFilter: boolean;
}>) {
  const [openCat, setOpenCat] = useState<number | null>(null);

  return (
    <aside
      style={{
        background: "#16213e",
        border: "1px solid #1e3a5f",
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
      }}
    >
      <div
        style={{
          background: "linear-gradient(135deg, #0f3460 0%, #16213e 100%)",
          padding: "14px 18px",
          borderBottom: "1px solid #1e3a5f",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            color: "#fff",
            fontWeight: 700,
            fontSize: 13,
            letterSpacing: 1,
            textTransform: "uppercase",
          }}
        >
          Browse By Category
        </span>
      </div>

      <div style={{ padding: 12 }}>
        {selectedSubIds.length > 0 && (
          <button
            onClick={onClear}
            style={{
              width: "100%",
              marginBottom: 10,
              padding: "8px 0",
              background: "linear-gradient(135deg, #e94560, #c73652)",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              fontWeight: 700,
              fontSize: 13,
              letterSpacing: 0.5,
              boxShadow: "0 2px 8px rgba(233,69,96,0.35)",
            }}
          >
            ✕ Clear Filter
          </button>
        )}

        {categories.map((cat) => {
          const isOpen = openCat === cat.id;
          const selectedCount = cat.SubCategories.filter((s) =>
            selectedSubIds.includes(s.id),
          ).length;
          return (
            <div key={cat.id} style={{ marginBottom: 6 }}>
              <button
                onClick={() => setOpenCat(isOpen ? null : cat.id)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  background: isOpen ? "#0f3460" : "transparent",
                  color: isOpen ? "#fff" : "#cbd5e1",
                  border: `1px solid ${isOpen ? "#1e4d8c" : "#1e3a5f"}`,
                  padding: "9px 14px",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: 13,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>{cat.name}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {selectedCount > 0 && (
                    <span
                      style={{
                        background: "#e94560",
                        color: "#fff",
                        borderRadius: 20,
                        fontSize: 10,
                        fontWeight: 700,
                        padding: "1px 7px",
                        lineHeight: 1.6,
                      }}
                    >
                      {selectedCount}
                    </span>
                  )}
                  <span style={{ color: "#64748b", fontSize: 11 }}>
                    {isOpen ? "▲" : "▼"}
                  </span>
                </div>
              </button>

              {isOpen && (
                <div
                  style={{
                    background: "#111827",
                    border: "1px solid #1e3a5f",
                    borderTop: "none",
                    borderRadius: "0 0 8px 8px",
                    padding: "8px 14px 10px",
                  }}
                >
                  {cat.SubCategories.map((sub) => {
                    const checked = selectedSubIds.includes(sub.id);
                    return (
                      <label
                        key={sub.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          cursor: "pointer",
                          padding: "5px 0",
                          fontSize: 13,
                          color: checked ? "#e94560" : "#94a3b8",
                          fontWeight: checked ? 600 : 400,
                          borderBottom: "1px solid #1a2744",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => onToggle(sub.id, cat.id)}
                          style={{
                            accentColor: "#e94560",
                            width: 14,
                            height: 14,
                            flexShrink: 0,
                          }}
                        />
                        {sub.name}
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}

/* ─── Page ──────────────────────────────────────────────────────────── */
export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [codes, setCodes] = useState<CodeItem[]>([]);
  const [pages, setPages] = useState<Pages>({
    current_page: 1,
    per_page: 9,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(false);
  const [loadingFilter, setLoadingFilter] = useState(false);
  const [selectedSubIds, setSelectedSubIds] = useState<number[]>([]);
  const [activeCatId, setActiveCatId] = useState<number | null>(null);
  const [filtered, setFiltered] = useState(false);

  const getData = useCallback(async (pageNum = 1) => {
    window.scrollTo(0, 0);
    setContentLoading(true);
    try {
      const res = await fetch(`/api/home?page=${pageNum}`);
      const data = await res.json();
      setCategories(data.categories ?? []);
      setCodes(data.codes?.data ?? []);
      setPages(data.codes ?? { current_page: 1, per_page: 9, total: 0 });
    } finally {
      setLoading(false);
      setContentLoading(false);
    }
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  const handleToggle = async (subId: number, catId: number) => {
    let newSubIds: number[];
    if (activeCatId === catId) {
      newSubIds = selectedSubIds.includes(subId)
        ? selectedSubIds.filter((id) => id !== subId)
        : [...selectedSubIds, subId];
    } else {
      setActiveCatId(catId);
      newSubIds = [subId];
    }
    setSelectedSubIds(newSubIds);

    if (newSubIds.length === 0) {
      setFiltered(false);
      getData();
      return;
    }

    setLoadingFilter(true);
    setFiltered(true);
    try {
      const res = await fetch("/api/home/filtercodes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subcat_ids: newSubIds }),
      });
      const data = await res.json();
      setCodes(data.data ?? []);
      setPages({ current_page: 1, per_page: 8, total: data.data?.length ?? 0 });
    } finally {
      setLoadingFilter(false);
    }
  };

  const handleClear = () => {
    setSelectedSubIds([]);
    setActiveCatId(null);
    setFiltered(false);
    getData();
  };

  const totalPages = Math.ceil(pages.total / pages.per_page);

  const renderMainContent = () => {
    if (contentLoading || loadingFilter) {
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 320,
          }}
        >
          <WebLoader minHeight={320} />
        </div>
      );
    }
    if (codes.length === 0) {
      return (
        <div style={{ textAlign: "center", color: "#555", paddingTop: 80 }}>
          <p style={{ fontSize: 18 }}>No codes found.</p>
        </div>
      );
    }
    return (
      <>
        <div className="web-cards-grid">
          {codes.map((code) => (
            <CodeCard key={code.id} code={code} />
          ))}
        </div>
        {!filtered && totalPages > 1 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "center",
              gap: 6,
              marginTop: 40,
            }}
          >
            <button
              disabled={pages.current_page <= 1}
              onClick={() => getData(pages.current_page - 1)}
              style={{
                padding: "7px 16px",
                borderRadius: 6,
                border: "1px solid #0f3460",
                background: pages.current_page <= 1 ? "#1a1a2e" : "#0f3460",
                color: pages.current_page <= 1 ? "#555" : "#fff",
                cursor: pages.current_page <= 1 ? "not-allowed" : "pointer",
                fontSize: 14,
              }}
            >
              ‹ Prev
            </button>

            {(() => {
              const cur = pages.current_page;
              const total = totalPages;
              const pages_to_show: (number | "…")[] = [];

              if (total <= 7) {
                for (let i = 1; i <= total; i++) pages_to_show.push(i);
              } else {
                pages_to_show.push(1);
                if (cur > 3) pages_to_show.push("…");
                for (
                  let i = Math.max(2, cur - 1);
                  i <= Math.min(total - 1, cur + 1);
                  i++
                ) {
                  pages_to_show.push(i);
                }
                if (cur < total - 2) pages_to_show.push("…");
                pages_to_show.push(total);
              }

              return pages_to_show.map((p, idx) =>
                p === "…" ? (
                  <span
                    key={`ellipsis-${idx}`}
                    style={{ color: "#555", padding: "0 4px", fontSize: 14 }}
                  >
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => getData(p as number)}
                    style={{
                      minWidth: 36,
                      padding: "7px 10px",
                      borderRadius: 6,
                      border: "1px solid #0f3460",
                      background: p === cur ? "#e94560" : "#1a1a2e",
                      color: "#fff",
                      cursor: "pointer",
                      fontWeight: p === cur ? 700 : 400,
                      fontSize: 14,
                    }}
                  >
                    {p}
                  </button>
                ),
              );
            })()}

            <button
              disabled={pages.current_page >= totalPages}
              onClick={() => getData(pages.current_page + 1)}
              style={{
                padding: "7px 16px",
                borderRadius: 6,
                border: "1px solid #0f3460",
                background:
                  pages.current_page >= totalPages ? "#1a1a2e" : "#0f3460",
                color: pages.current_page >= totalPages ? "#555" : "#fff",
                cursor:
                  pages.current_page >= totalPages ? "not-allowed" : "pointer",
                fontSize: 14,
              }}
            >
              Next ›
            </button>

            <span
              style={{
                color: "#4d6a8a",
                fontSize: 13,
                width: "100%",
                textAlign: "center",
                marginTop: 4,
              }}
            >
              Page {pages.current_page} of {totalPages}
            </span>
          </div>
        )}
      </>
    );
  };

  if (loading) {
    return <WebLoader minHeight="60vh" />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="web-layout-grid">
        <Sidebar
          categories={categories}
          selectedSubIds={selectedSubIds}
          onToggle={handleToggle}
          onClear={handleClear}
          loadingFilter={loadingFilter}
        />
        <div>{renderMainContent()}</div>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:.4} 50%{opacity:.7} }
        .web-layout-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }
        .web-cards-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }
        @media (min-width: 640px) {
          .web-cards-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (min-width: 1024px) {
          .web-layout-grid { grid-template-columns: 260px 1fr; }
          .web-cards-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (min-width: 1280px) {
          .web-cards-grid { grid-template-columns: repeat(3, 1fr); }
        }
      `}</style>
    </div>
  );
}
