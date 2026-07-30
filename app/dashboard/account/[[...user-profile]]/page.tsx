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

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#22293a] p-2 shadow-xl shadow-black/20 sm:p-4">
        <UserProfile
          path="/dashboard/account"
          routing="path"
          appearance={{
            variables: {
              colorPrimary: "#d6a85a",
              colorPrimaryForeground: "#1a1f2e",
              colorForeground: "#ffffff",
              colorMutedForeground: "#b8bec9",
              colorNeutral: "#aeb5c2",
              colorBackground: "#252d40",
              colorMuted: "#30394d",
              colorInput: "#1a1f2e",
              colorInputForeground: "#ffffff",
              colorBorder: "#465168",
              colorRing: "#d6a85a",
              colorShadow: "#080b12",
              colorModalBackdrop: "rgba(8, 11, 18, 0.82)",
              colorDanger: "#f87171",
              borderRadius: "0.875rem",
              fontFamily: "inherit",
            },
            elements: {
              rootBox: {
                width: "100%",
              },
              cardBox: {
                width: "100%",
                maxWidth: "none",
                boxShadow: "none",
              },
              card: {
                width: "100%",
                backgroundColor: "#252d40",
                border: "1px solid #465168",
                boxShadow: "0 24px 60px rgba(8, 11, 18, 0.28)",
              },
              navbar: {
                backgroundColor: "#20273a",
                borderColor: "#465168",
              },
              navbarButton: {
                borderRadius: "0.75rem",
                color: "#b8bec9",
              },
              navbarButtonIcon: {
                color: "currentColor",
              },
              headerTitle: {
                color: "#ffffff",
              },
              headerSubtitle: {
                color: "#b8bec9",
              },
              profileSection: {
                borderColor: "#465168",
              },
              profileSectionTitleText: {
                color: "#ffffff",
              },
              profileSectionContent: {
                color: "#b8bec9",
              },
              profileSectionPrimaryButton: {
                color: "#d6a85a",
              },
              formFieldLabel: {
                color: "#ffffff",
              },
              formFieldInput: {
                backgroundColor: "#1a1f2e",
                borderColor: "#56627a",
                color: "#ffffff",
              },
              formButtonPrimary: {
                backgroundColor: "#d6a85a",
                color: "#1a1f2e",
                boxShadow: "none",
                fontWeight: 600,
              },
              modalContent: {
                backgroundColor: "#252d40",
                border: "1px solid #56627a",
                boxShadow: "0 28px 80px rgba(8, 11, 18, 0.58)",
              },
              modalCloseButton: {
                color: "#b8bec9",
              },
              footerActionLink: {
                color: "#d6a85a",
              },
            },
          }}
        />
      </div>
    </DashboardShell>
  );
}
