import InterpreterHubPage from "@/app/components/InterpreterHubPage";
import { interpreterHubMetadata } from "@/app/lib/interpreterPages";

export const metadata = interpreterHubMetadata("pt");

export default function Page() {
  return <InterpreterHubPage lang="pt" />;
}
