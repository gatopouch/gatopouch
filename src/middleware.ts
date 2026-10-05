import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except for
  // - /api (API routes)
  // - /_next (Next.js internals)
  // - /.*\..* (static files)
  // - /admin (admin dashboard, will be handled separately with auth)
  matcher: ["/((?!api|_next|admin|.*\\..*).*)"],
};
