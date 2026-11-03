import { Badge, Card, EmptyState, PageHeader, Table, td, th } from "@/components/admin/ui";
import { COMMERCE, requireStaff } from "@/lib/admin/auth";
import { dateOnly } from "@/lib/admin/util";
import { formatPrice } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";
import { AddMemberForm, CancelButton, RecordPaymentForm, RemoveMemberButton } from "./forms";

export const metadata = { title: "Workspace" };

type Sub = {
  id: string;
  plan: string;
  amount: number;
  payment_method: string;
  start_date: string;
  end_date: string;
  status: "active" | "expired" | "cancelled";
  notes: string;
  created_at: string;
};

type Member = {
  id: string;
  name: string;
  phone: string;
  email: string;
  notes: string;
  created_at: string;
  workspace_subscriptions: Sub[];
};

function statusOf(sub: Sub | undefined, today: string): { label: string; tone: "green" | "gold" | "red" | "neutral"; detail: string } {
  if (!sub) return { label: "No subscription", tone: "neutral", detail: "Record a payment to activate." };
  if (sub.status === "cancelled") return { label: "Cancelled", tone: "red", detail: `Was ${sub.plan}` };
  if (sub.end_date < today) return { label: "Expired", tone: "red", detail: `Ended ${dateOnly.format(new Date(sub.end_date))}` };
  const daysLeft = Math.ceil((new Date(sub.end_date).getTime() - new Date(today).getTime()) / 86400000);
  if (daysLeft <= 3) return { label: `${daysLeft} day${daysLeft === 1 ? "" : "s"} left`, tone: "gold", detail: `${sub.plan} · ends ${dateOnly.format(new Date(sub.end_date))}` };
  return { label: "Active", tone: "green", detail: `${sub.plan} · ends ${dateOnly.format(new Date(sub.end_date))}` };
}

export default async function WorkspacePage() {
  await requireStaff(COMMERCE);
  const supabase = await createClient();
  const { data } = await supabase
    .from("workspace_members")
    .select("id, name, phone, email, notes, created_at, workspace_subscriptions(id, plan, amount, payment_method, start_date, end_date, status, notes, created_at)")
    .order("created_at", { ascending: false });

  const members = (data ?? []) as unknown as Member[];
  const today = new Date().toISOString().slice(0, 10);

  for (const m of members) {
    m.workspace_subscriptions.sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
  }

  const latest = members.map((m) => ({ member: m, current: m.workspace_subscriptions[0] }));
  const active = latest.filter((r) => r.current && r.current.status === "active" && r.current.end_date >= today).length;
  const expiring = latest.filter((r) => {
    if (!r.current || r.current.status !== "active" || r.current.end_date < today) return false;
    const daysLeft = Math.ceil((new Date(r.current.end_date).getTime() - new Date(today).getTime()) / 86400000);
    return daysLeft <= 3;
  }).length;

  return (
    <>
      <PageHeader
        title="Workspace"
        description="Walk-in guests and their subscription payments. Record payments taken in person or by transfer."
      />

      <div className="mb-6 grid gap-3 text-sm @min-[42rem]:grid-cols-3">
        <div className="rounded-xl bg-white p-4 ring-1 ring-line">
          <p className="text-xs uppercase tracking-wide text-muted">Total members</p>
          <p className="mt-1 text-2xl font-semibold text-marine-900">{members.length}</p>
        </div>
        <div className="rounded-xl bg-white p-4 ring-1 ring-line">
          <p className="text-xs uppercase tracking-wide text-muted">Active now</p>
          <p className="mt-1 text-2xl font-semibold text-marine-900">{active}</p>
        </div>
        <div className="rounded-xl bg-white p-4 ring-1 ring-line">
          <p className="text-xs uppercase tracking-wide text-muted">Expiring in 3 days</p>
          <p className="mt-1 text-2xl font-semibold text-marine-900">{expiring}</p>
        </div>
      </div>

      <div className="space-y-6">
        <Card title="Add a walk-in guest" description="Capture the person first; record their payment next.">
          <AddMemberForm />
        </Card>

        <Card title="Record a payment" description="Links the payment to a guest and sets the subscription window.">
          {members.length === 0
            ? <p className="text-sm text-muted">Add a guest first, then come back here to record their payment.</p>
            : <RecordPaymentForm members={members.map((m) => ({ id: m.id, name: m.name }))} />}
        </Card>

        {latest.length === 0 ? (
          <EmptyState title="No members yet" body="Guests you add will show up here with their subscription status." />
        ) : (
          <Table>
            <thead className="border-b border-line">
              <tr>
                <th className={th}>Member</th>
                <th className={th}>Contact</th>
                <th className={th}>Current plan</th>
                <th className={th}>Status</th>
                <th className={th}>History</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {latest.map(({ member, current }) => {
                const s = statusOf(current, today);
                return (
                  <tr key={member.id}>
                    <td className={td}>
                      <span className="font-semibold text-marine-900">{member.name}</span>
                      <span className="block text-xs text-muted">Joined {dateOnly.format(new Date(member.created_at))}</span>
                    </td>
                    <td className={td}>
                      <span className="block">{member.phone || <span className="text-muted">—</span>}</span>
                      <span className="block text-xs text-muted">{member.email}</span>
                    </td>
                    <td className={td}>
                      {current ? (
                        <>
                          <span className="font-medium">{current.plan}</span>
                          <span className="block text-xs text-muted">{formatPrice(current.amount)} · {current.payment_method}</span>
                        </>
                      ) : <span className="text-muted">—</span>}
                    </td>
                    <td className={td}>
                      <Badge tone={s.tone}>{s.label}</Badge>
                      <span className="mt-1 block text-xs text-muted">{s.detail}</span>
                    </td>
                    <td className={td}>
                      <details>
                        <summary className="cursor-pointer text-sm text-marine-700 underline">
                          {member.workspace_subscriptions.length} payment{member.workspace_subscriptions.length === 1 ? "" : "s"}
                        </summary>
                        <div className="mt-3 space-y-2">
                          {member.workspace_subscriptions.map((sub) => (
                            <div key={sub.id} className="rounded-lg bg-surface/60 p-2 text-xs">
                              <div className="flex justify-between gap-2">
                                <span className="font-medium">{sub.plan}</span>
                                <span>{formatPrice(sub.amount)}</span>
                              </div>
                              <div className="text-muted">
                                {dateOnly.format(new Date(sub.start_date))} → {dateOnly.format(new Date(sub.end_date))} · {sub.payment_method} · {sub.status}
                              </div>
                              {sub.notes && <div className="mt-1 text-muted">{sub.notes}</div>}
                            </div>
                          ))}
                          <div className="flex flex-wrap gap-2 pt-2">
                            {current && current.status === "active" && current.end_date >= today && (
                              <CancelButton id={current.id} memberName={member.name} />
                            )}
                            <RemoveMemberButton id={member.id} name={member.name} />
                          </div>
                        </div>
                      </details>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
      </div>
    </>
  );
}
