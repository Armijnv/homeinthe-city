import InterpreterServicePage from "@/app/components/InterpreterServicePage";

import { client } from "@/sanity/lib/client";
import { servicePageQuery } from "@/sanity/lib/queries";

export async function generateMetadata() {
  const page = await client.fetch(servicePageQuery, {
    slug: "interpreter-porto-alegre",
  });

  return {
    title: page?.seoTitle_pt,
    description: page?.seoDescription_pt,
  };
}

export default async function Page() {
  const page = await client.fetch(servicePageQuery, {
    slug: "interpreter-porto-alegre",
  });

  return <InterpreterServicePage lang="pt" page={page} />;
}