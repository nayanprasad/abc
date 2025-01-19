import { NextResponse } from "next/server";
import type { CustomMiddleware } from "./chain";
import { createServerClient } from "@supabase/ssr";
import { getUserRole } from "../src/utils/supabase/get-user-role";

const publicRoutes = [/^\/signin/, /^\/auth\/callback/];

const adminRoutes = [/^\/dashboard/];

export function withAuthMiddleware(
  middleware: CustomMiddleware,
): CustomMiddleware {
  return async (request, event) => {
    const pathname = request.nextUrl.pathname;

    const isPublicRoute = publicRoutes.some((route) => route.test(pathname));
    const isAdminRoute = adminRoutes.some((route) => route.test(pathname));

    let supabaseResponse = NextResponse.next({
      request,
    });

    // Create a Supabase client
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value),
            );
            supabaseResponse = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options),
            );
          },
        },
      },
    );

    // Get the current user from Supabase
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Get the user's role using the custom getUserRole function
    const role = await getUserRole();

    // Redirect unauthenticated users to sign-in page
    if (!user && !isPublicRoute) {
        const url = request.nextUrl.clone();
        url.pathname = "/signin";
        url.searchParams.set("next", request.nextUrl.pathname);
        return NextResponse.redirect(url);
    }

    // Redirect non-admin users trying to access admin pages to the home page
    if (user && role !== "admin" && isAdminRoute) {
      return NextResponse.rewrite(new URL("/denied", request.url));
    }

    // Redirect authenticated users attempting to access the sign-in page to the home page
    if (user && request.nextUrl.pathname.startsWith("/signin")) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }

    return middleware(request, event, supabaseResponse);
  };
}
