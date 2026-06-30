import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import AdminShell from "@/components/admin/AdminShell";

type Props = Readonly<{ children: React.ReactNode }>;

export default async function ProtectedLayout({ children }: Props) {
  const session = await getAdminSession();
  if (!session) redirect("/adminpanel/login");

  return <AdminShell>{children}</AdminShell>;
}
