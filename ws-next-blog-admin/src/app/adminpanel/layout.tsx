// Root adminpanel layout — passthrough so login page has no sidebar
export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
