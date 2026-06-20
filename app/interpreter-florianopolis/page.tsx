import InterpreterCityRoute, {
  getInterpreterCityMetadata,
} from "@/app/components/InterpreterCityRoute";

const route = { citySlug: "florianopolis" as const, lang: "en" as const };

export function generateMetadata() {
  return getInterpreterCityMetadata(route);
}

export default function Page() {
  return <InterpreterCityRoute {...route} />;
}
