import { betterAuth } from "better-auth";
import { APIError } from "better-auth/api";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { canonicalEmail, normalizeEmail } from "@/lib/email";

// const uri = process.env.MONGODB_BETTER_AUTH_URI as string;

// Reuse MongoDB client in development to prevent connection exhaustion
declare global {
  var _mongoClient: MongoClient | undefined;
}

const client = new MongoClient(process.env.MONGODB_BETTER_AUTH_URI as string)
if (process.env.NODE_ENV !== "production") {
  globalThis._mongoClient = client;
}

const db = client.db("pizzahub");

export const auth = betterAuth({
  baseURL:
    process.env.BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://pizzahub-azure.vercel.app",
  trustedOrigins: [
    "http://localhost:3000",
    "https://pizzahub-azure.vercel.app",
    ...(process.env.BETTER_AUTH_URL ? [process.env.BETTER_AUTH_URL] : []),
    ...(process.env.NEXT_PUBLIC_APP_URL ? [process.env.NEXT_PUBLIC_APP_URL] : []),
    ...(process.env.NEXT_PUBLIC_BETTER_AUTH_URL ? [process.env.NEXT_PUBLIC_BETTER_AUTH_URL] : []),
  ],
  secret: process.env.BETTER_AUTH_SECRET,
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
      requireLocalEmailVerified: false,
    },
  },
  user: {
    additionalFields: {
      role: {
        type: ["customer", "vendor", "admin"],
        required: false,
        defaultValue: "customer",
        input: true,
      },
    },
  },
  socialProviders: {
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
      }
      : {}),
  },

  databaseHooks: {
    session: {
      create: {
        before: async (session) => {
          // Block check: if the user is blocked, reject session creation entirely.
          // Better Auth stores user _id as a plain string in MongoDB (not ObjectId).
          const userDoc = await db
            .collection("user")
            .findOne(
              { id: session.userId },
              { projection: { blocked: 1 } }
            );

          if (userDoc?.blocked) {
            throw new APIError("FORBIDDEN", {
              message:
                "Your account has been blocked by an administrator. Please contact support.",
              code: "ACCOUNT_BLOCKED",
            });
          }
        },
      },
    },
    user: {
      create: {
        before: async (user) => {
          // One email = one account.
          // Gmail ignores dots and "+tag", so r.afik+pizza@gmail.com and
          // rafik@gmail.com are the same inbox — treat them as duplicates too.
          const email = normalizeEmail(user.email);
          const canonical = canonicalEmail(email);

          const existing = await db
            .collection("user")
            .find({}, { projection: { email: 1 } })
            .toArray();

          const isDuplicate = existing.some(
            (existingUser) =>
              canonicalEmail(String(existingUser.email ?? "")) === canonical
          );

          if (isDuplicate) {
            throw new APIError("UNPROCESSABLE_ENTITY", {
              message: "This email is already registered. Please sign in instead.",
              code: "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL",
            });
          }

          const role =
            user.role === "vendor"
              ? "vendor"
              : user.role === "admin"
                ? "admin"
                : "customer";
          return { data: { ...user, email, role } };
        },
      },
    },
  },
});
