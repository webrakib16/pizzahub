"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Heart,
  LayoutDashboard,
  LogOut,
  ShoppingBag,
  User,
  type LucideIcon,
} from "lucide-react";
import { signOut, useSession } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
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

interface CustomerNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const CUSTOMER_NAV: CustomerNavItem[] = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Orders", href: "/orders", icon: ShoppingBag },
  { label: "Wishlist", href: "/wishlist", icon: Heart },
  { label: "Profile", href: "/profile", icon: User },
];

const menuButtonClasses =
  "h-10 rounded-xl px-3 text-sm font-medium text-zinc-400 transition-colors " +
  "hover:bg-white/5 hover:text-white " +
  "data-active:bg-gradient-to-r data-active:from-red-600 data-active:to-orange-500 " +
  "data-active:font-semibold data-active:text-white data-active:shadow-lg " +
  "data-active:shadow-orange-950/30 data-active:hover:from-red-600 " +
  "data-active:hover:to-orange-500 data-active:hover:text-white";

function getInitials(name?: string | null) {
  if (!name) return "U";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

const DashboardSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { isMobile, setOpenMobile } = useSidebar();
  const { data: session } = useSession();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const user = session?.user;
  const displayName = user?.name?.trim() || "Guest";
  const email = user?.email ?? "Sign in to manage your account";
  const initials = getInitials(user?.name);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const closeMobileSidebar = () => {
    if (isMobile) setOpenMobile(false);
  };

  const handleSignOut = async () => {
    if (isSigningOut) return;

    setIsSigningOut(true);

    try {
      const { error } = await signOut();

      if (error) {
        toast.add({
          title: "Could not log you out. Please try again.",
          type: "error",
        });
        setIsSigningOut(false);
        return;
      }

      toast.add({ title: "Logged out successfully.", type: "success" });
      router.push("/");
      router.refresh();
    } catch {
      toast.add({
        title: "Could not log you out. Please try again.",
        type: "error",
      });
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
                <span className="truncate text-[11px] font-medium text-zinc-500">
                  Customer dashboard
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
            My Account
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {CUSTOMER_NAV.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    render={<Link href={item.href} />}
                    onClick={closeMobileSidebar}
                    isActive={isActive(item.href)}
                    className={menuButtonClasses}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3">
        <SidebarSeparator className="mb-1 bg-white/10" />

        {user ? (
          <>
            <div className="flex items-center gap-2.5 rounded-xl px-1 py-1.5 group-data-[collapsible=icon]:justify-center">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-red-600 to-orange-500 text-xs font-black text-white">
                {initials}
              </span>
              <span className="flex min-w-0 flex-col group-data-[collapsible=icon]:hidden">
                <span className="truncate text-sm font-semibold text-white">
                  {displayName}
                </span>
                <span className="truncate text-[11px] text-zinc-500">
                  {email}
                </span>
              </span>
            </div>

            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className={cn(
                    "h-9 rounded-xl px-3 text-zinc-400 hover:bg-red-500/10 hover:text-red-400",
                    "group-data-[collapsible=icon]:justify-center"
                  )}
                >
                  <LogOut />
                  <span className="group-data-[collapsible=icon]:hidden">
                    {isSigningOut ? "Signing out..." : "Log out"}
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </>
        ) : (
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                render={<Link href="/sign-in" />}
                onClick={closeMobileSidebar}
                className={menuButtonClasses}
              >
                <User />
                <span>Sign in</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
};

export default DashboardSidebar;
