import InterpreterHubPage from "@/app/components/InterpreterHubPage";
import { interpreterHubMetadata } from "@/app/lib/interpreterPages";

export const metadata = interpreterHubMetadata("en");

export default function Page() {
  return <InterpreterHubPage lang="en" />;
}
