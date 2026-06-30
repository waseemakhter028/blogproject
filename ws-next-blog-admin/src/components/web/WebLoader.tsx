interface WebLoaderProps {
  minHeight?: number | string;
  label?: string;
}

export default function WebLoader({
  minHeight = 320,
  label = "Loading...",
}: WebLoaderProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight,
        gap: 20,
        animation: "webFadeIn 0.3s ease-out",
      }}
    >
      {/* Spinner rings */}
      <div style={{ position: "relative", width: 120, height: 120 }}>
        {/* Outer ring */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: "5px solid #0f3460",
            borderTopColor: "#e94560",
            boxShadow: "0 0 20px rgba(233,69,96,0.35)",
            animation: "spin 0.9s linear infinite",
          }}
        />
        {/* Middle ring */}
        <div
          style={{
            position: "absolute",
            inset: 18,
            borderRadius: "50%",
            border: "4px solid #1e3a5f",
            borderBottomColor: "#4d9de0",
            animation: "webSpinCCW 0.7s linear infinite",
          }}
        />
        {/* Inner pulsing dot */}
        <div
          style={{
            position: "absolute",
            inset: 44,
            borderRadius: "50%",
            background: "#e94560",
            boxShadow: "0 0 12px rgba(233,69,96,0.6)",
            animation: "webPulse 1.4s ease-in-out infinite",
          }}
        />
      </div>

      {/* Label */}
      {label && (
        <span
          style={{
            color: "#4d6a8a",
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
}
