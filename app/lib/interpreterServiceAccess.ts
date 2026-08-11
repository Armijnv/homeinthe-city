import "server-only";

import { notFound } from "next/navigation";
import { getDashboardContext } from "@/app/lib/dashboard";
import {
  interpreterServicePageForKey,
  type InterpreterServicePageKey,
} from "@/app/lib/interpreterServicePages";
import { canEditInterpreterServicePage } from "@/app/lib/interpreterServicePolicy";

export async function requireInterpreterServiceAccess(
  pageKey: InterpreterServicePageKey | string,
) {
  const definition = interpreterServicePageForKey(pageKey);
  if (!definition) notFound();

  const returnTo = `/dashboard/interpreter-services/${definition.key}`;
  const context = await getDashboardContext(returnTo);

  if (
    !canEditInterpreterServicePage({
      provider: context.provider,
      isAdmin: context.isAdmin,
      citySlug: definition.citySlug,
    })
  ) {
    notFound();
  }

  return { context, definition };
}
