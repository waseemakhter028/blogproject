import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "WS Blog – Code Library",
  description: "Browse and search code snippets",
};

export default function WebLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#1a1a2e",
        color: "#e0e0e0",
      }}
    >
      {/* Header */}
      <header
        style={{ background: "#16213e", borderBottom: "1px solid #0f3460" }}
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center">
          <a
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              textDecoration: "none",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="WS Blog"
              style={{ height: 52, width: 52, flexShrink: 0 }}
            />
            <span
              style={{
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "clamp(15px, 3vw, 20px)",
                whiteSpace: "nowrap",
              }}
            >
              WS Blog Code List
            </span>
          </a>
        </div>
      </header>

      {/* Page content */}
      <main style={{ flex: 1, paddingTop: 32 }}>{children}</main>

      {/* Footer */}
      <footer style={{ background: "#16213e", marginTop: 40 }}>
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "20px 24px",
            textAlign: "center",
          }}
        >
          <hr style={{ borderColor: "#0f3460", marginBottom: 16 }} />
          <p style={{ color: "#ffffff", fontSize: 14, margin: 0 }}>
            Copyright &copy; All rights reserved | WS Blog
          </p>
        </div>
      </footer>
    </div>
  );
}
