import { redirect } from "next/navigation";
import { Sidebar } from "@/components/admin/Sidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { requireStaff } from "@/lib/admin/auth";

export default async function PanelLayout({ children }: LayoutProps<"/admin">) {
  const staff = await requireStaff();
  if (staff.mustChangePassword) redirect("/admin/change-password-required");
  return (
    <div className="admin-shell">
      <Sidebar name={staff.name} role={staff.role} />
      <div className="admin-workspace">
        <AdminTopbar name={staff.name} role={staff.role} />
        <main id="admin-main" className="admin-content @container">{children}</main>
      </div>
    </div>
  );
}
