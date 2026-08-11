import InterpreterHubRoute, {
  getInterpreterHubMetadata,
} from "@/app/components/InterpreterHubRoute";

export function generateMetadata() {
  return getInterpreterHubMetadata("nl");
}

export default function Page() {
  return <InterpreterHubRoute lang="nl" />;
}
