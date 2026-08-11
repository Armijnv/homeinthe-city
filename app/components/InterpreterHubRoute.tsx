import InterpreterHubPage from "@/app/components/InterpreterHubPage";
import { getInterpreterCmsPage } from "@/app/components/InterpreterCityRoute";
import {
  interpreterHubMetadata,
  interpreterHubServicePageSlug,
  interpreterHubStructuredData,
  type InterpreterLanguage,
} from "@/app/lib/interpreterPages";
import { JsonLdScript } from "@/app/lib/structuredData";

export async function getInterpreterHubMetadata(lang: InterpreterLanguage) {
  const page = await getInterpreterCmsPage(interpreterHubServicePageSlug);
  return interpreterHubMetadata(lang, page);
}

export default async function InterpreterHubRoute({
  lang,
}: {
  lang: InterpreterLanguage;
}) {
  const page = await getInterpreterCmsPage(interpreterHubServicePageSlug);

  return (
    <>
      <JsonLdScript data={interpreterHubStructuredData(lang)} />
      <InterpreterHubPage lang={lang} page={page} />
    </>
  );
}
