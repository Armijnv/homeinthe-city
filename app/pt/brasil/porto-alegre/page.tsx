import CityPage from "@/app/components/CityPage";

export default function Page() {
  return (
    <div className="relative">
      <div className="pointer-events-none fixed inset-0 -z-20 hidden bg-[url('/porto-alegre-desktop-background.jpg')] bg-cover bg-center md:block" />
      <div className="pointer-events-none fixed inset-0 -z-10 hidden bg-white/25 md:block" />

      <CityPage lang="pt" />
    </div>
  );
}
