import CityPage from "@/app/components/CityPage";

export default function Page() {
  return (
    <div className="relative isolate">
      <div className="pointer-events-none fixed inset-0 z-0 hidden bg-[url('/porto-alegre-desktop-background.jpg')] bg-cover bg-center md:block" />
      <div className="pointer-events-none fixed inset-0 z-0 hidden bg-white/25 md:block" />

      <CityPage lang="en" />
    </div>
  );
}
