// Login page bypasses the parent adminpanel auth layout
export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
