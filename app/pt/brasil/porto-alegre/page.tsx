import CityPage from "@/app/components/CityPage";

export default function Page() {
  return (
    <>
      <div className="pointer-events-none fixed inset-0 hidden bg-[url('/porto-alegre-desktop-background.jpg')] bg-cover bg-center md:block" />
      <div className="pointer-events-none fixed inset-0 hidden bg-white/45 md:block" />

      <CityPage lang="pt" />
    </>
  );
}
