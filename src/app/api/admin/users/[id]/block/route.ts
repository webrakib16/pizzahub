import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { setUserBlocked } from "@/lib/users";

// PATCH /api/admin/users/[id]/block — block or unblock a user
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;

  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { blocked } = body as Record<string, unknown>;

  if (typeof blocked !== "boolean") {
    return NextResponse.json({ error: "blocked must be true or false" }, { status: 400 });
  }

  if (id === user.id) {
    return NextResponse.json({ error: "You cannot block yourself." }, { status: 400 });
  }

  const result = await setUserBlocked(id, blocked);

  if (!result.ok) {
    return NextResponse.json({ error: result.error ?? "Failed to update user" }, { status: 400 });
  }

  return NextResponse.json({ ok: true, blocked });
}
