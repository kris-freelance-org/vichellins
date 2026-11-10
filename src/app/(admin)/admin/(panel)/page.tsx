import { DashboardView, type DashboardData } from "@/components/admin/DashboardView";
import { Card, LinkButton, Notice, PageHeader } from "@/components/admin/ui";
import { requireStaff } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage({ searchParams }: PageProps<"/admin">) {
  const staff = await requireStaff();
  const params = await searchParams;

  if (staff.role === "editor") {
    return <>
      <PageHeader title={`Welcome back, ${staff.name}`} description="Your content workspace. Keep the catalogue and storefront looking their best." />
      {params.denied && <Notice tone="gold">You don&apos;t have access to that page.</Notice>}
      <Card title="Make the store your own" description="Manage the categories, brands, and homepage your customers see.">
        <div className="flex flex-wrap gap-3"><LinkButton href="/admin/categories" icon="categories">Categories &amp; specs</LinkButton><LinkButton href="/admin/brands" icon="brands">Brands</LinkButton><LinkButton href="/admin/pages" icon="homepage" variant="primary">Edit pages</LinkButton></div>
      </Card>
    </>;
  }

  const days = [7, 30, 90].includes(Number(params.days)) ? Number(params.days) : 30;
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("admin_dashboard", { p_days: days });
  if (error || !data) {
    return <>
      <PageHeader title="Store overview" description="Your orders, sales, and stock in one place." />
      <Notice tone="red">We couldn&apos;t load your store overview. Try again in a moment.</Notice>
      <LinkButton href={`/admin?days=${days}`} icon="arrow">Try again</LinkButton>
    </>;
  }

  return <>
    {params.denied && <Notice tone="gold">You don&apos;t have access to that page.</Notice>}
    <DashboardView name={staff.name} data={data as DashboardData} />
  </>;
}
