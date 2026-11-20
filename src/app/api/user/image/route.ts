import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { updateUserImage } from "@/lib/users";

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;

  if (!user) {
    return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { image } = body as Record<string, unknown>;

  if (!image || typeof image !== "string" || !image.trim()) {
    return NextResponse.json({ error: "Valid image URL is required." }, { status: 400 });
  }

  const result = await updateUserImage(user.id, image.trim());

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error ?? "Failed to update profile image." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, image: image.trim() });
}
