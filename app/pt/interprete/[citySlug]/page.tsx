import { DynamicCityInterpreterRoute, dynamicCityInterpreterMetadata } from "@/app/components/DynamicCityInterpreterRoute";

export async function generateMetadata({ params }: { params: Promise<{ citySlug: string }> }) {
  const { citySlug } = await params;
  return dynamicCityInterpreterMetadata(citySlug, "pt");
}

export default async function Page({ params }: { params: Promise<{ citySlug: string }> }) {
  const { citySlug } = await params;
  return <DynamicCityInterpreterRoute citySlug={citySlug} lang="pt" />;
}
