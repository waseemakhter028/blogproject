"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { nightOwl } from "react-syntax-highlighter/dist/esm/styles/prism";
import WebLoader from "@/components/web/WebLoader";

interface CodeDetail {
  id: number;
  title: string;
  image: string | null;
  description: string;
  language: string;
  subCategory: {
    id: number;
    name: string;
    category: { id: number; name: string };
  };
}

const imgSrc = (img: string | null) => {
  if (!img) return null;
  return img.startsWith("data:") ? img : `data:image/jpeg;base64,${img}`;
};

const decodeHtml = (str: string): string => {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = str;
  return textarea.value;
};

export default function ViewCodePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [code, setCode] = useState<CodeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id || Number.isNaN(Number(id))) {
      router.replace("/");
      return;
    }
    fetch(`/api/home/viewcode/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.status === "404") {
          router.replace("/");
          return;
        }
        setCode(data.data);
      })
      .finally(() => setLoading(false));
  }, [id, router]);

  const handleCopy = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(decodeHtml(code.description));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked */
    }
  };

  if (loading) {
    return <WebLoader minHeight="60vh" />;
  }

  if (!code) return null;

  const src = imgSrc(code.image);
  const description = decodeHtml(code.description);
  const title = decodeHtml(code.title);

  return (
    <div
      className="max-w-4xl mx-auto py-10"
      style={{ paddingLeft: 32, paddingRight: 32 }}
    >
      {/* Back button */}
      <button
        onClick={() => router.back()}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          background: "#e94560",
          color: "#fff",
          border: "none",
          padding: "8px 20px",
          borderRadius: 6,
          cursor: "pointer",
          fontWeight: 600,
          marginBottom: 28,
          fontSize: 14,
        }}
      >
        ← Back
      </button>

      {/* Hero image */}
      {src && (
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={title}
            style={{
              maxWidth: "100%",
              maxHeight: 420,
              borderRadius: 10,
              objectFit: "cover",
            }}
          />
        </div>
      )}

      {/* Breadcrumb */}
      <p
        style={{
          color: "#888",
          fontSize: 13,
          marginBottom: 8,
          textAlign: "center",
        }}
      >
        {code.subCategory?.category?.name} &rsaquo; {code.subCategory?.name}
      </p>

      {/* Title */}
      <h1
        style={{
          color: "#e94560",
          fontSize: 28,
          fontWeight: 700,
          marginBottom: 24,
          lineHeight: 1.3,
          textAlign: "center",
        }}
      >
        {title}
      </h1>

      {/* Language badge */}
      <span
        style={{
          display: "inline-block",
          background: "#0f3460",
          color: "#a78bfa",
          padding: "3px 12px",
          borderRadius: 20,
          fontSize: 12,
          fontWeight: 600,
          marginBottom: 20,
          textTransform: "uppercase",
          letterSpacing: 1,
        }}
      >
        {code.language}
      </span>

      {/* Code block */}
      <div style={{ position: "relative" }}>
        <button
          onClick={handleCopy}
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            zIndex: 2,
            background: copied ? "#16a34a" : "#1e293b",
            color: "#fff",
            border: "1px solid #334155",
            padding: "5px 14px",
            borderRadius: 6,
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          {copied ? "✓ Copied" : "⎘ Copy"}
        </button>
        <SyntaxHighlighter
          language={code.language.toLowerCase()}
          style={nightOwl}
          customStyle={{
            borderRadius: 10,
            fontSize: 18,
            fontWeight: 600,
            fontFamily:
              "'Cascadia Code', 'Cascadia Mono', 'Consolas', monospace",
            paddingTop: 44,
          }}
          wrapLongLines
          wrapLines
        >
          {description}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
