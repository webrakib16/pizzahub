import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { updateOrderStatusByVendor } from "@/lib/orders";

// PATCH /api/vendor/orders/[id] — accept or reject a pending order
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

  const { status } = body as Record<string, unknown>;

  if (status !== "accepted" && status !== "rejected") {
    return NextResponse.json(
      { error: "Status must be 'accepted' or 'rejected'" },
      { status: 400 }
    );
  }

  const vendorName = user.name ?? "";
  const result = await updateOrderStatusByVendor(id, vendorName, status);

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json(result.order);
}
