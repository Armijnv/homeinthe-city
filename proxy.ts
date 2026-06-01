import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";

const isAccountRoute = createRouteMatcher(["/account(.*)"]);

export const proxy = clerkMiddleware(async (auth, request: NextRequest) => {
  if (isAccountRoute(request)) {
    await auth.protect();
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-homeinthecity-pathname", request.nextUrl.pathname);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.png).*)"],
};
