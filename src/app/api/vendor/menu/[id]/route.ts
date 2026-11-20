import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { updateMenuItem, deleteMenuItem } from "@/lib/menu-items";

// PATCH /api/vendor/menu/[id] — toggle isActive or update fields
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;

  if (!user || (user.role !== "vendor" && user.role !== "admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const result = await updateMenuItem(
    id,
    user.id,
    body as Parameters<typeof updateMenuItem>[2]
  );

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json(result.item ?? { ok: true });
}

// DELETE /api/vendor/menu/[id] — delete vendor's own item
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;

  if (!user || (user.role !== "vendor" && user.role !== "admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const result = await deleteMenuItem(id, user.id);

  if (!result.ok) {
    return NextResponse.json({ error: result.error ?? "Could not delete" }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
