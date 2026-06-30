import WebLoader from "@/components/web/WebLoader";

export default function HomeLoading() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "calc(100vh - 64px)",
      }}
    >
      <WebLoader minHeight={400} label="Loading codes..." />
    </div>
  );
}
