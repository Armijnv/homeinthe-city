import HostPage from "@/app/components/HostPage";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <HostPage lang="en" slug={slug} />;
}