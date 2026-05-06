import HostPage from "@/app/components/HostPage";

export const metadata = {
  title: "Interpreter in Porto Alegre | Armijn van Dijk",
  description:
    "Local interpreter in Porto Alegre helping international business visitors with meetings, company visits and communication.",
  openGraph: {
    title: "Interpreter in Porto Alegre | Armijn van Dijk",
    description:
      "Local interpreter in Porto Alegre helping international business visitors with meetings and communication.",
    url: "https://homeinthe.city/hosts/armijn",
    siteName: "Home in the City",
    images: [
      {
        url: "/og-armijn2.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function Page() {
  return <HostPage lang="en" slug="armijn" />;
}