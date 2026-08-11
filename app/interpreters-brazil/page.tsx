import InterpreterHubRoute, {
  getInterpreterHubMetadata,
} from "@/app/components/InterpreterHubRoute";

export function generateMetadata() {
  return getInterpreterHubMetadata("en");
}

export default function Page() {
  return <InterpreterHubRoute lang="en" />;
}
