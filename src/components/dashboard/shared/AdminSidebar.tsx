"use client";

import { useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  LogOut,
  Receipt,
  Settings,
  ShieldCheck,
  UtensilsCrossed,
  Users,
  type LucideIcon,
} from "lucide-react";
import { signOut, useSession } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";

interface AdminNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const ADMIN_NAV: AdminNavItem[] = [
  { label: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Manage Users", href: "/admin/users", icon: Users },
  { label: "Manage Menu Items", href: "/admin/menu", icon: UtensilsCrossed },
  { label: "Transactions", href: "/admin/transactions", icon: Receipt },
  { label: "Profile Settings", href: "/admin/profile", icon: Settings },
];

const menuButtonClasses =
  "h-10 rounded-xl px-3 text-sm font-medium text-zinc-400 transition-colors " +
  "hover:bg-white/5 hover:text-white " +
  "data-active:bg-gradient-to-r data-active:from-red-600 data-active:to-orange-500 " +
  "data-active:font-semibold data-active:text-white data-active:shadow-lg " +
  "data-active:shadow-orange-950/30 data-active:hover:from-red-600 " +
  "data-active:hover:to-orange-500 data-active:hover:text-white";

function getInitials(name?: string | null) {
  if (!name) return "A";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isMobile, setOpenMobile } = useSidebar();
  const { data: session } = useSession();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const user = session?.user;
  const displayName = user?.name?.trim() || "Admin";
  const email = user?.email ?? "admin@pizzahub.com";
  const initials = getInitials(user?.name);

  const isActive = (href: string) => pathname === href;

  const closeMobileSidebar = () => {
    if (isMobile) setOpenMobile(false);
  };

  const handleSignOut = async () => {
    if (isSigningOut) return;
    setIsSigningOut(true);
    try {
      const { error } = await signOut();
      if (error) {
        toast.add({ title: "Could not log you out. Please try again.", type: "error" });
        setIsSigningOut(false);
        return;
      }
      toast.add({ title: "Logged out successfully.", type: "success" });
      router.push("/");
      router.refresh();
    } catch {
      toast.add({ title: "Could not log you out. Please try again.", type: "error" });
      setIsSigningOut(false);
    }
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-white/10">
      <SidebarHeader className="px-3 py-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              render={<Link href="/" />}
              onClick={closeMobileSidebar}
              className="group-data-[collapsible=icon]:justify-center hover:bg-transparent"
            >
              <Image
                src="/assets/logo-icon.png"
                alt="PizzaHub"
                width={36}
                height={36}
                priority
                className="size-9 shrink-0 rounded-xl object-contain"
              />
              <span className="flex min-w-0 flex-col leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate text-base font-black tracking-tight text-white">
                  Pizza<span className="text-orange-500">Hub</span>
                </span>
                <span className="truncate text-[11px] font-semibold text-orange-400">
                  Admin Panel
                </span>
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator className="bg-white/10" />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
            Administration
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-1">
            <SidebarMenu className="gap-1">
              {ADMIN_NAV.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    render={<Link href={item.href} />}
                    isActive={isActive(item.href)}
                    onClick={closeMobileSidebar}
                    tooltip={item.label}
                    className={menuButtonClasses}
                  >
                    <item.icon className="size-4 shrink-0" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator className="bg-white/10" />

      <SidebarFooter className="p-3">
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-2.5">
          {user?.image ? (
            <Image
              src={user.image}
              alt={displayName}
              width={36}
              height={36}
              unoptimized
              className="size-9 shrink-0 rounded-xl object-cover ring-1 ring-white/10"
            />
          ) : (
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-orange-500 text-xs font-black text-white shadow-md shadow-orange-950/40">
              {initials}
            </div>
          )}

          <div className="flex min-w-0 flex-1 flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="truncate text-xs font-bold text-white">{displayName}</span>
            <span className="truncate text-[10px] text-zinc-400">{email}</span>
            <span className="mt-0.5 inline-flex items-center gap-1 text-[10px] font-bold text-orange-400">
              <ShieldCheck className="size-2.5" />
              Administrator
            </span>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            disabled={isSigningOut}
            title="Log out"
            aria-label="Log out"
            className="flex size-8 shrink-0 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-red-500/10 hover:text-red-400 group-data-[collapsible=icon]:hidden cursor-pointer"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
