import InterpreterCityRoute, {
  getInterpreterCityMetadata,
} from "@/app/components/InterpreterCityRoute";

const route = {
  citySlug: "porto-alegre" as const,
  lang: "pt" as const,
};

export function generateMetadata() {
  return getInterpreterCityMetadata(route);
}

export default function Page() {
  return <InterpreterCityRoute {...route} />;
}
