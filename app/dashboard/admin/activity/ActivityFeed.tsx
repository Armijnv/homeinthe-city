import Link from "next/link";
import type { AdminActivity } from "@/app/lib/adminActivity";
import { relativeActivityTime } from "@/app/lib/adminActivity";

export function ActivityFeed({ activities, empty = "No activity has been recorded yet." }: { activities: AdminActivity[]; empty?: string }) {
  if (!activities.length) return <p className="rounded-xl border border-white/10 bg-white/5 p-5 text-stone-300">{empty}</p>;
  return (
    <div className="space-y-3">
      {activities.map((activity) => (
        <Link key={activity.key} href={`/dashboard/admin/activity/${encodeURIComponent(activity.key)}`} className="block rounded-xl border border-white/10 bg-white/5 p-4 transition hover:border-[#d6a85a]/60 sm:p-5">
          <p className="text-white"><span className="font-medium">{activity.actor}{activity.actorRole ? ` (${activity.actorRole})` : ""}</span> {activity.action}</p>
          <p className="mt-1 text-sm text-stone-400">{activity.location} · <time dateTime={activity.occurredAt}>{relativeActivityTime(activity.occurredAt)}</time></p>
        </Link>
      ))}
    </div>
  );
}
