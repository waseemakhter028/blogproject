"use client";

import { useState, useTransition, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  language: string;
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
}: Readonly<{
  categories: Category[];
  selectedSubIds: number[];
  onToggle: (subId: number, catId: number) => void;
  onClear: () => void;
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

/* ─── Pagination ──────────────────────────────────────────────────────── */
function getPageItems(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const items: (number | "…")[] = [1];
  const left = current - 1;
  const right = current + 1;
  if (left > 2) items.push("…");
  for (let i = Math.max(2, left); i <= Math.min(total - 1, right); i++)
    items.push(i);
  if (right < total - 1) items.push("…");
  items.push(total);
  return items;
}

const pageLinkStyle = (active: boolean, disabled: boolean) => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: 36,
  padding: "7px 10px",
  borderRadius: 6,
  border: "1px solid #0f3460",
  background: active ? "#e94560" : "#1a1a2e",
  color: disabled ? "#555" : "#fff",
  textDecoration: "none",
  fontWeight: active ? 700 : 400,
  fontSize: 14,
  pointerEvents: disabled ? ("none" as const) : ("auto" as const),
  cursor: disabled ? "not-allowed" : "pointer",
});

function Pagination({
  currentPage,
  totalPages,
  onNavigate,
}: Readonly<{
  currentPage: number;
  totalPages: number;
  onNavigate: (page: number) => void;
}>) {
  const shortItems = getPageItems(currentPage, totalPages);

  const btnStyle = (
    active: boolean,
    disabled: boolean,
  ): React.CSSProperties => ({
    ...pageLinkStyle(active, disabled),
    border: "1px solid #0f3460",
    outline: "none",
  });

  const prevBtn =
    currentPage > 1 ? (
      <button
        onClick={() => onNavigate(currentPage - 1)}
        style={{ ...btnStyle(false, false), padding: "7px 16px" }}
      >
        ‹ Prev
      </button>
    ) : (
      <span style={{ ...btnStyle(false, true), padding: "7px 16px" }}>
        ‹ Prev
      </span>
    );

  const nextBtn =
    currentPage < totalPages ? (
      <button
        onClick={() => onNavigate(currentPage + 1)}
        style={{ ...btnStyle(false, false), padding: "7px 16px" }}
      >
        Next ›
      </button>
    ) : (
      <span style={{ ...btnStyle(false, true), padding: "7px 16px" }}>
        Next ›
      </span>
    );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        marginTop: 40,
      }}
    >
      {/* Mobile / tablet — ellipsis, hidden at ≥1024px */}
      <div className="pag-mobile">
        {prevBtn}
        {shortItems.map((item, idx) =>
          item === "…" ? (
            <span
              key={`ellipsis-after-${shortItems[idx - 1]}`}
              style={{
                color: "#4d6a8a",
                padding: "0 2px",
                fontSize: 14,
                alignSelf: "center",
              }}
            >
              …
            </span>
          ) : (
            <button
              key={item}
              onClick={() => onNavigate(item)}
              style={btnStyle(item === currentPage, false)}
            >
              {item}
            </button>
          ),
        )}
        {nextBtn}
      </div>
      {/* Desktop — all pages, hidden below 1024px */}
      <div className="pag-desktop">
        {prevBtn}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => onNavigate(p)}
            style={btnStyle(p === currentPage, false)}
          >
            {p}
          </button>
        ))}
        {nextBtn}
      </div>
      <span style={{ color: "#4d6a8a", fontSize: 13, textAlign: "center" }}>
        Page {currentPage} of {totalPages}
      </span>
    </div>
  );
}

/* ─── Main component ──────────────────────────────────────────────────── */
export default function HomePageClient({
  categories,
  codes,
  currentPage,
  totalPages,
}: Readonly<{
  categories: Category[];
  codes: CodeItem[];
  currentPage: number;
  totalPages: number;
}>) {
  const [filteredCodes, setFilteredCodes] = useState<CodeItem[] | null>(null);
  const [loadingFilter, setLoadingFilter] = useState(false);
  const [selectedSubIds, setSelectedSubIds] = useState<number[]>([]);
  const [activeCatId, setActiveCatId] = useState<number | null>(null);
  const [isPaginating, startPageTransition] = useTransition();
  const router = useRouter();
  const navigateCalled = useRef(false);

  const navigate = (page: number) => {
    navigateCalled.current = true;
    startPageTransition(() => {
      router.push(`/?page=${page}`);
    });
  };

  const isFiltered = filteredCodes !== null;
  const displayCodes = filteredCodes ?? codes;

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
      setFilteredCodes(null);
      return;
    }

    setLoadingFilter(true);
    try {
      const res = await fetch("/api/home/filtercodes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subcat_ids: newSubIds }),
      });
      const data = await res.json();
      setFilteredCodes(
        (data.data ?? []).map(
          (c: {
            id: number;
            image: string | null;
            title: string;
            language: string;
          }) => ({
            id: c.id,
            image: c.image,
            title: c.title,
            language: c.language,
          }),
        ),
      );
    } finally {
      setLoadingFilter(false);
    }
  };

  const handleClear = () => {
    setSelectedSubIds([]);
    setActiveCatId(null);
    setFilteredCodes(null);
  };

  function renderContent({
    loadingFilter: loading,
    isPaginating: paginating,
    displayCodes: dc,
    isFiltered: filtered,
    currentPage: cp,
    totalPages: tp,
  }: Readonly<{
    loadingFilter: boolean;
    isPaginating: boolean;
    displayCodes: CodeItem[];
    isFiltered: boolean;
    currentPage: number;
    totalPages: number;
  }>) {
    if (loading || (paginating && navigateCalled.current)) {
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
    if (dc.length === 0) {
      return (
        <div style={{ textAlign: "center", color: "#555", paddingTop: 80 }}>
          <p style={{ fontSize: 18 }}>No codes found.</p>
        </div>
      );
    }
    return (
      <>
        <div className="web-cards-grid">
          {dc.map((code) => (
            <CodeCard key={code.id} code={code} />
          ))}
        </div>
        {!filtered && tp > 1 && (
          <Pagination currentPage={cp} totalPages={tp} onNavigate={navigate} />
        )}
      </>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="web-layout-grid">
        <Sidebar
          categories={categories}
          selectedSubIds={selectedSubIds}
          onToggle={handleToggle}
          onClear={handleClear}
        />

        <div>
          {renderContent({
            loadingFilter,
            isPaginating,
            displayCodes,
            isFiltered,
            currentPage,
            totalPages,
          })}
        </div>
      </div>

      <style>{`
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
        .pag-mobile { display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 6px; }
        .pag-desktop { display: none; flex-wrap: wrap; justify-content: center; align-items: center; gap: 6px; }
        @media (min-width: 1024px) {
          .web-layout-grid { grid-template-columns: 260px 1fr; }
          .web-cards-grid { grid-template-columns: repeat(2, 1fr); }
          .pag-mobile { display: none; }
          .pag-desktop { display: flex; }
        }
        @media (min-width: 1280px) {
          .web-cards-grid { grid-template-columns: repeat(3, 1fr); }
        }
      `}</style>
    </div>
  );
}
