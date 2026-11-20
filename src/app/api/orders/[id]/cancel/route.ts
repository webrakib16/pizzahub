import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { cancelOrderForUser } from "@/lib/orders";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();

  if (!session?.user) {
    return NextResponse.json(
      { error: "Please sign in to manage your orders." },
      { status: 401 }
    );
  }

  const { id } = await params;
  const result = await cancelOrderForUser(id, session.user.id);

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error },
      { status: result.status }
    );
  }

  return NextResponse.json({ order: result.order });
}
