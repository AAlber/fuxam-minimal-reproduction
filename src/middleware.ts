import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import * as Sentry from "@sentry/nextjs";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const DEBUG_MODE = false;

export default clerkMiddleware(async (auth, request) => {
  debugFlag();
  const pathname = request.nextUrl.pathname;
  const url = new URL(request.url);
  if (url.searchParams.get("user-drive") === "open") {
    url.searchParams.set("user-drive", "closed");
    return NextResponse.redirect(url);
  }

  /** No middleware logic should be applied to ignored routes */
  if (isIgnoredRoute(request)) {
    debugLog(
      "Is ignored route. Returning NextResponse.next() Pathname" + pathname,
    );
    return NextResponse.next();
  }

  const locale = getLocaleFromCookies(request);

  const searchParams = request.nextUrl.searchParams;
  const redirectUrl = searchParams.get("redirect_url");
  debugLog("Pathname:", pathname);
  debugLog("Search params:", searchParams);
  debugLog("Redirect URL:", redirectUrl);

  /** Is SignIn route */
  if (isSignInRoute(request)) {
    return handleSignIn(
      auth,
      request,
      pathname,
      searchParams,
      locale,
      redirectUrl,
    );
  }

  /** Use the clerk protect function to protect the routes that are protected */
  if (!auth().userId && isProtectedRoute(request)) {
    debugLog("Is protected route; Redirecting to welcome page");
    const { origin } = new URL(request.url);

    const url = new URL(`/${locale}/welcome`, origin);
    url.searchParams.append("redirect_url", pathname);

    return NextResponse.redirect(url);
  }

  try {
    return handleRedirect(
      auth,
      request,
      pathname,
      searchParams,
      locale,
      redirectUrl,
    );
  } catch (error) {
    Sentry.captureException(error);
    return new Response("Internal Server Error", { status: 500 });
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};

const isProtectedRoute = createRouteMatcher([
  "/(.*)/dashboard(.*)",
  "/(.*)/onboarding(.*)",
  "/(.*)/admin-dashboard(.*)",
  "/(.*)/attendance-check-in(.*)",
  "/(.*)/switch-institution(.*)",
  "/(.*)/invite(.*)",
  "/(.*)/no-organization(.*)",

]);

const isIgnoredRoute = createRouteMatcher([
  "/api/edge-config",
  "/api/custom-integrations(.*)",
  "/api/concierge/data-retrieval",
  "/api/ai-planner/get-schedule-data-for-planning",
  "/api/ai/budget/update-budget-status",
  "/api/ai/budget/get-budget-status",
  "/api/notifications/send",
  "/api/cron/:anything*",
  "/monitoring(.*)",
  "/api/ai/budget/get-budget-status",
  "/api/ai/budget/update-budget-status",
  "/api/users/update-user-clerk",
  "/api/stripe/webhook",
  "/api/stripe/webhook-connect-accounts",
  "/api/role/has-roles-with-access/:anything*",
  "/api/functions",
  "/api/cloudflare/auth",
  "/maintenance",
  "/api/notifications/link-user-to-push-token",
  "/api/email(.*)",
  "/api/schedule(.*)",
  // cached routes are public, since the middleware handles auth via the FUXAM_SECRET
  "/api/kv-cached(.*)",
  "/api/scorm(.*)",
  "/api/concierge/answer",
  "/api/institution-user-data-field/get-user-id-field-data",
  "/api/institution-user-data-field/get-user-id-field-value",
  "/api/mobile(.*)",
]);

const isSignInRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/(.*)/sign-in(.*)",
  "/(.*)/sign-up(.*)",
]);

function getLocale(request: NextRequest): string | undefined {
  const url = new URL(request.url);
  const origin = url.origin;
  const segments = url.href.replace(origin + "/", "").split("/");
  const locale = segments[0];

  return locale === "de" ? "de" : "en";
}

const doubleLocaleRegex = new RegExp(`/(en|de)/(en|de)/`, "g");

/**
 * This function handles redirects based on the pathname and locale.
 *
 * @param {Object} auth - The authentication object.
 * @param {NextRequest} request - The NextRequest object.
 * @param {string} pathname - The pathname of the request.
 * @param {URLSearchParams} searchParams - The search parameters of the request.
 * @param {string} locale - The locale of the request.
 * @param {string} redirectUrl - The redirect URL after sign-in.
 * @returns {Promise<NextResponse>} A promise that resolves to a NextResponse object.
 */
async function handleRedirect(
  auth,
  request,
  pathname,
  searchParams,
  locale,
  redirectUrl,
) {
  debugLog("Handling redirect...");
  const origin = new URL(request.url).origin;
  // If there's a redirect URL, redirect the user to it after sign-in
  if (redirectUrl && redirectUrl !== "null" && redirectUrl !== "undefined") {
    try {
      new URL(redirectUrl);
      debugLog("Redirecting to redirectUrl: ", redirectUrl);
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    } catch (e) {
      debugLog("Invalid redirect URL:", redirectUrl);
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

/**
 * Handles the sign in.
 * Only makes sure the locale is before the sign in
 */
async function handleSignIn(
  auth: any,
  request: any,
  pathname: string,
  searchParams: any,
  locale: string,
  redirectUrl: any,
) {
  debugLog("Handling sign-in route");
  const readyForRedirect = !!auth().userId;
  debugLog("Ready for redirect", readyForRedirect);

  if (readyForRedirect) {
    debugLog("Sign-in finished, redirecting to: ", redirectUrl);
    if (!redirectUrl || redirectUrl === "null") {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  const pathnameIsMissingLocale =
    !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`;
  const pathnameHasDoubleLocale = doubleLocaleRegex.test(pathname);

  if (pathnameIsMissingLocale) {
    debugLog("Sign-in pathname is missing locale");

    const newPathname = `/${locale}${
      pathname.startsWith("/") ? "" : "/"
    }${pathname}`;
    const finalUrl = new URL(
      newPathname + (searchParams ? `?${searchParams.toString()}` : ""),
      request.url,
    );
    debugLog("Redirecting to new pathname with locale: ", finalUrl);
    return NextResponse.redirect(finalUrl);
  }

  // If the pathname has a double locale, remove double locale and set the correct locale
  if (pathnameHasDoubleLocale) {
    debugLog("Double locale detected, Redirecting to correct locale: ", locale);
    const newPathname = pathname.replace(doubleLocaleRegex, `/${locale}/`);
    return NextResponse.redirect(
      new URL(
        newPathname + (searchParams ? `?${searchParams.toString()}` : ""),
        request.url,
      ),
    );
  }

  const origin = new URL(request.url).origin;
  const url = new URL(pathname, origin);

  if (!!redirectUrl) {
    url.searchParams.append(
      "redirect_url",
      redirectUrl.replace("/" + locale, ""),
    );
  }

  debugLog("Routing to sign-in/up page", url);
  return NextResponse.rewrite(url);
}

const debugLog = (...args: any[]) => {
  if (DEBUG_MODE) {
    console.log(...args);
  }
};

function debugFlag() {
  debugLog("");
  debugLog("");
  debugLog("");
  debugLog("MIDDLEWARE - DEBUG MODE");
  debugLog("");
  debugLog("");
}

function getLocaleFromCookies(request) {
  debugLog("Getting locale from cookies");
  const langCookie = cookies().get("fuxam-dictionary");
  const locale = getLocale(request) ?? "en";
  debugLog("Locale:", locale);

  return langCookie ? langCookie.value : locale;
}
