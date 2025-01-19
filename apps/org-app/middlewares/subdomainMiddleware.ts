import { NextResponse } from "next/server";
import { CustomMiddleware } from "./chain";

export function withSubdomainMiddleware(
  middleware: CustomMiddleware,
): CustomMiddleware {
  return async (request, event, response) => {
    const hostname = request.headers
      .get("host")
      ?.replace(".localhost:3000", `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`);
    if (!hostname) {
      return response;
    }
    const pathname = new URL(request.url).pathname;
    if (hostname === `register.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) {
      return NextResponse.rewrite(new URL("/register/org", request.url));
    }

    return middleware(request, event, response);
  };
}
