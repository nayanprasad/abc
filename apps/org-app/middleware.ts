import { type NextRequest } from "next/server";

import { updateSession } from "../org-app/src/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
    return await updateSession(request);
}

export const config = {
    matcher: ["/protected", "/login", "/admin/:path*"],
};
