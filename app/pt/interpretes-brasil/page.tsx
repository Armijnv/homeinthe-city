import InterpreterHubRoute, {
  getInterpreterHubMetadata,
} from "@/app/components/InterpreterHubRoute";

export function generateMetadata() {
  return getInterpreterHubMetadata("pt");
}

export default function Page() {
  return <InterpreterHubRoute lang="pt" />;
}
