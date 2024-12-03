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
 * It first checks if the pathname is missing a locale and not an API path.
 * If both conditions are met, it adjusts the pathname and redirects the request.
 *
 * If the pathname is not missing a locale, it checks if there's no page after the locale.
 * If there's no page after the locale, it redirects the request to the dashboard home.
 *
 * If the pathname is a dashboard path and needs adjustment, it redirects the request to the dashboard home.
 *
 * If the pathname is missing a locale and not an API path, it redirects the request.
 *
 * @param {Object} auth - The authentication object.
 * @param {NextRequest} request - The NextRequest object.
 * @param {string} pathname - The pathname of the request.
 * @param {URLSearchParams} searchParams - The search parameters of the request.
 * @param {string} locale - The locale of the request.
 * @returns {Promise<NextResponse>} A promise that resolves to a NextResponse object.
 */
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
      redirectUrl = `/${locale}/dashboard/home`; // fallback to dashboard/home if the redirectUrl is null / undefined !
    }
  }

  // Check if the pathname is missing the determined locale
  const pathnameIsMissingLocale =
    !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`;
  // Check if the pathname has the wrong locale
  const pathnameHasWrongLocale = pathname.startsWith(
    `/${locale === "en" ? "de" : "en"}/`,
  );

  // double locale examples: /en/en/dashboard/home, /de/de/dashboard/home, /de/en/dashboard/home, /en/de/dashboard/home
  const pathnameHasDoubleLocale = doubleLocaleRegex.test(pathname);

  // Check if the pathname is an API path
  const pathnameIsAPI = pathname.startsWith("/api");

  // If the pathname is missing the determined locale and not an API path, adjust the pathname and redirect the request
  if (pathnameIsMissingLocale && !pathnameHasWrongLocale && !pathnameIsAPI) {
    debugLog("Redirecting to new pathname with locale: ", pathname);
    const newPathname = `/${locale}${
      pathname.startsWith("/") ? "" : "/"
    }${pathname}`;
    return NextResponse.redirect(
      new URL(
        newPathname + (searchParams ? `?${searchParams.toString()}` : ""),
        request.url,
      ),
    );
  }

  // If the pathname has the wrong locale, adjust the pathname and redirect the request
  if (pathnameHasWrongLocale && !pathnameIsAPI) {
    debugLog("Redirecting to correct locale: ", locale);
    const newPathname = `/${locale}${pathname.substring(3)}`;
    return NextResponse.redirect(
      new URL(
        newPathname + (searchParams ? `?${searchParams.toString()}` : ""),
        request.url,
      ),
    );
  }

  // If the pathname has a double locale, remove double locale and set the correct locale
  if (pathnameHasDoubleLocale && !pathnameIsAPI) {
    debugLog("Double locale detected, Redirecting to correct locale: ", locale);
    const newPathname = pathname.replace(doubleLocaleRegex, `/${locale}/`);
    return NextResponse.redirect(
      new URL(
        newPathname + (searchParams ? `?${searchParams.toString()}` : ""),
        request.url,
      ),
    );
  }
  // Get the last path segment
  const lastPathSegment = pathname.split("/").pop();

  // Check if there's no page after the locale
  const noPageAfterLocale = !lastPathSegment || lastPathSegment === locale;

  // Check if the pathname is a dashboard path
  const pathnameIsDashboard = pathname.includes("/dashboard/home");

  // Check if the dashboard path needs adjustment
  const dashboardPathNeedsAdjustment =
    pathnameIsDashboard &&
    pathname !== `/${locale}/dashboard/home/${auth().userId}`;

  // If there's no page after the locale or the dashboard path needs adjustment, redirect the request to the dashboard home
  if (noPageAfterLocale || dashboardPathNeedsAdjustment) {
    const userId = auth().userId;
    debugLog("Redirecting to dashboard home: UserID:", userId);
    if (userId) {
      const newPathname = `/${locale}/dashboard/home/${userId}`;

      const url = new URL(
        newPathname + (searchParams ? `?${searchParams.toString()}` : ""),
        origin,
      );

      return NextResponse.redirect(url);
    }

    debugLog("UserId is null; Redirecting to welcome page");

    const url = new URL(`/${locale}/welcome`, origin);
    const originalUrl = new URL(request.url);
    let pathnameAndSearch =
      originalUrl.pathname +
      (originalUrl.search ? `?${originalUrl.search}` : "");

    pathnameAndSearch = pathnameAndSearch.replace("/" + locale, "");

    if (!!pathnameAndSearch) {
      url.searchParams.append("redirect_url", pathnameAndSearch);
    }

    return NextResponse.redirect(url);
  }

  // If the pathname is missing a locale and not an API path, redirect the request
  if (pathnameIsMissingLocale && !pathnameIsAPI) {
    debugLog("Redirecting to pathname:", pathname);
    return NextResponse.redirect(new URL(pathname, request.url));
  }

  return NextResponse.next(request.url);
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
      redirectUrl = `/${locale}/dashboard/home`;
      debugLog("Redirect URL was null, falling back to:", redirectUrl);
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
