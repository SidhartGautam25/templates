import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  // Target only admin routes to prevent unnecessary middleware execution on landing pages
  matcher: ["/admin/:path*"],
};
