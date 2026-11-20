import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { updateMenuItemStatusByAdmin, deleteMenuItem } from "@/lib/menu-items";
import type { MenuItemStatus } from "@/types/menu-item";

// PATCH /api/admin/menu/[id]/status — approve or reject a menu item
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

  const { status } = body as Record<string, unknown>;

  if (status !== "approved" && status !== "rejected" && status !== "pending") {
    return NextResponse.json(
      { error: "Status must be 'approved', 'rejected', or 'pending'" },
      { status: 400 }
    );
  }

  const result = await updateMenuItemStatusByAdmin(id, status as MenuItemStatus);

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ ok: true, status });
}

// DELETE /api/admin/menu/[id]/status — admin can delete any menu item
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;

  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const result = await deleteMenuItem(id);

  if (!result.ok) {
    return NextResponse.json({ error: result.error ?? "Could not delete" }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
