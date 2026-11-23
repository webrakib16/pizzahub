"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Loader2, Search, ShieldOff, ShieldCheck, Users } from "lucide-react";
import type { AppUser } from "@/lib/users";
import { toast } from "@/components/ui/toast";
import { safeFetchApi } from "@/lib/api-client";

export default function AdminUsersList({
  initialUsers,
}: {
  initialUsers: AppUser[];
}) {
  const [users, setUsers] = useState<AppUser[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "customer" | "vendor" | "admin">("all");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = users;
    if (roleFilter !== "all") {
      list = list.filter((u) => u.role === roleFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q)
      );
    }
    return list;
  }, [users, search, roleFilter]);

  const handleBlockToggle = async (user: AppUser) => {
    setLoadingId(user.id);
    try {
      const res = await safeFetchApi(`/api/admin/users/${user.id}/block`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ blocked: !user.blocked }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.add({ title: data.error || "Failed to update user", type: "error" });
        return;
      }
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, blocked: !u.blocked } : u))
      );
      toast.add({
        title: `${user.name} has been ${!user.blocked ? "blocked" : "unblocked"}`,
        type: "success",
      });
    } catch {
      toast.add({ title: "Failed to update user", type: "error" });
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & filter bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-zinc-900 pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-orange-500/60 focus:outline-none"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as typeof roleFilter)}
          className="rounded-xl border border-white/10 bg-zinc-900 px-4 py-2.5 text-sm text-white focus:border-orange-500/60 focus:outline-none"
        >
          <option value="all">All Roles</option>
          <option value="customer">Customers</option>
          <option value="vendor">Vendors</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      {/* Results count */}
      <p className="text-xs text-zinc-500">
        Showing <span className="text-white font-semibold">{filtered.length}</span> of {users.length} users
      </p>

      {/* Users list */}
      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-[#141416] p-14 text-center">
          <Users className="mx-auto size-12 text-zinc-600" />
          <p className="mt-4 text-sm font-semibold text-white">No users found</p>
          <p className="mt-1 text-xs text-zinc-400">Try adjusting your search or filter.</p>
        </div>
      ) : (
        <div className="rounded-3xl border border-white/10 bg-[#141416] shadow-xl overflow-hidden">
          <ul className="divide-y divide-white/5">
            {filtered.map((user) => (
              <li
                key={user.id}
                className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-6 hover:bg-white/[0.02] transition-colors"
              >
                {/* Avatar + info */}
                <div className="flex items-center gap-3 min-w-0">
                  {user.image ? (
                    <div className="relative size-9 shrink-0 rounded-xl overflow-hidden">
                      <Image
                        src={user.image}
                        alt={user.name}
                        fill
                        sizes="36px"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-orange-500 text-xs font-black text-white">
                      {user.name?.[0]?.toUpperCase() ?? "U"}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-bold text-white truncate">
                        {user.name || "—"}
                      </p>
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                          user.role === "admin"
                            ? "bg-orange-500/15 text-orange-400"
                            : user.role === "vendor"
                            ? "bg-blue-500/15 text-blue-400"
                            : "bg-zinc-500/15 text-zinc-400"
                        }`}
                      >
                        {user.role}
                      </span>
                      {user.blocked && (
                        <span className="inline-block rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] font-bold uppercase text-red-400">
                          Blocked
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-400 truncate">{user.email}</p>
                  </div>
                </div>

                {/* Block / Unblock button — never shown for admin role */}
                {user.role !== "admin" && (
                  <button
                    type="button"
                    onClick={() => handleBlockToggle(user)}
                    disabled={loadingId === user.id}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold border transition-colors disabled:opacity-50 cursor-pointer ${
                      user.blocked
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                        : "border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20"
                    }`}
                  >
                    {loadingId === user.id ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : user.blocked ? (
                      <ShieldCheck className="size-3.5" />
                    ) : (
                      <ShieldOff className="size-3.5" />
                    )}
                    {user.blocked ? "Unblock" : "Block"}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
