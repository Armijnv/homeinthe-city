import InterpreterHubPage from "@/app/components/InterpreterHubPage";
import {
  interpreterHubMetadata,
  interpreterHubServicePageSlug,
  interpreterHubStructuredData,
} from "@/app/lib/interpreterHub";
import type { InterpreterCmsPage, InterpreterLanguage } from "@/app/lib/interpreterTypes";
import { JsonLdScript } from "@/app/lib/structuredData";
import { client } from "@/sanity/lib/client";
import { servicePageQuery } from "@/sanity/lib/queries";

async function getInterpreterHubCmsPage() {
  return client.fetch<InterpreterCmsPage | null>(servicePageQuery, {
    slug: interpreterHubServicePageSlug,
  });
}

export async function getInterpreterHubMetadata(lang: InterpreterLanguage) {
  const page = await getInterpreterHubCmsPage();
  return interpreterHubMetadata(lang, page);
}

export default async function InterpreterHubRoute({
  lang,
}: {
  lang: InterpreterLanguage;
}) {
  const page = await getInterpreterHubCmsPage();

  return (
    <>
      <JsonLdScript data={interpreterHubStructuredData(lang)} />
      <InterpreterHubPage lang={lang} page={page} />
    </>
  );
}
