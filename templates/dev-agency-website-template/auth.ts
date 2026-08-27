import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { SITE } from "./constants";

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  trustHost: true,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const adminUser = process.env.ADMIN_USER || "admin";
        const adminPassword = process.env.ADMIN_PASSWORD || "change_this_password";

        if (
          credentials?.username === adminUser &&
          credentials?.password === adminPassword
        ) {
          return {
            id: "admin-id",
            name: SITE.admin.defaultUserName,
            email: SITE.admin.defaultUserEmail,
          };
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
});
