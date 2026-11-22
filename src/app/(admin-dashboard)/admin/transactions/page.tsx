import { requireAdmin } from "@/lib/session";
import { getAllTransactions } from "@/lib/transactions";
import TransactionsClient from "./TransactionsClient";

export default async function AdminTransactionsPage() {
  await requireAdmin();
  const transactions = await getAllTransactions();

  return <TransactionsClient initialTransactions={transactions} />;
}
