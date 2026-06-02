import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";

const isAccountRoute = createRouteMatcher(["/account(.*)"]);
const developmentClockSkewInMs = 60 * 60 * 1000;
const clerkProxyPath = "/__clerk";

export default clerkMiddleware(
  async (auth, request: NextRequest) => {
    if (isAccountRoute(request)) {
      const { isAuthenticated, redirectToSignIn } = await auth({
        treatPendingAsSignedOut: false,
      });

      if (!isAuthenticated) {
        return redirectToSignIn({
          returnBackUrl: `${request.nextUrl.pathname}${request.nextUrl.search}`,
        });
      }
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-homeinthecity-pathname", request.nextUrl.pathname);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  },
  {
    clockSkewInMs:
      process.env.NODE_ENV === "development"
        ? developmentClockSkewInMs
        : undefined,
   frontendApiProxy: {
  enabled: process.env.NODE_ENV !== "development",
  path: clerkProxyPath,
},
  },
);

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/(.*)",
  ],
};
