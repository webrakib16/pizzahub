import { requireAdmin } from "@/lib/session";
import AdminProfileClient from "./AdminProfileClient";

export default async function AdminProfilePage() {
  await requireAdmin();
  return <AdminProfileClient />;
}
