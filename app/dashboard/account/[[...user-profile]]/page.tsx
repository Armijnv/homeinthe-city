import { UserProfile } from "@clerk/nextjs";
import type { Metadata } from "next";
import { BackToDashboard, DashboardShell } from "@/app/dashboard/dashboard-ui";
import { getDashboardContext } from "@/app/lib/dashboard";

export const metadata: Metadata = {
  title: "Account Security | Provider Dashboard",
};

export default async function DashboardAccountPage() {
  await getDashboardContext("/dashboard/account");

  return (
    <DashboardShell
      eyebrow="Provider dashboard"
      title="Account security"
      intro="Use Clerk's secure account settings to manage your password and sign-in methods."
    >
      <BackToDashboard />

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/10 p-2 shadow-xl shadow-black/10 sm:p-4">
        <UserProfile
          path="/dashboard/account"
          routing="path"
          appearance={{
            variables: {
              colorPrimary: "#d6a85a",
              colorBackground: "#232a3c",
              colorText: "#ffffff",
              colorTextSecondary: "#d6d3d1",
              colorInputBackground: "#1a1f2e",
              colorInputText: "#ffffff",
              borderRadius: "0.75rem",
            },
            elements: {
              rootBox: "w-full",
              cardBox: "w-full max-w-none shadow-none",
              card: "w-full border border-white/10 shadow-none",
              navbar: "border-white/10",
            },
          }}
        />
      </div>
    </DashboardShell>
  );
}
