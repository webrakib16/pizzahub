import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "./auth";

const getAuthBaseUrl = () => {
  if (typeof window !== "undefined") {
    // In browser, always use current origin so production never points to localhost
    return window.location.origin;
  }
  return (
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
    process.env.BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://pizzahub-azure.vercel.app"
  );
};

export const authClient = createAuthClient({
  baseURL: getAuthBaseUrl(),
  plugins: [inferAdditionalFields<typeof auth>()],
});

export const { signIn, signUp, useSession, signOut } = authClient;
