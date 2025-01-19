import { chain } from "./middlewares/chain";
import { withAuthMiddleware } from "./middlewares/authMiddleware";
import { withSubdomainMiddleware } from "./middlewares/subdomainMiddleware";


export default chain([withSubdomainMiddleware, withAuthMiddleware])

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|.*\\.jpg|.*\\.png|.*\\.ico|.*\\.svg).*)",
    ],
};
