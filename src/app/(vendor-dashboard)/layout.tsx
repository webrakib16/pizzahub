import type { ReactNode } from "react";
import VendorSidebar from "@/components/dashboard/shared/VendorSidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { proxyVendorGuard } from "@/lib/proxy";

export default async function VendorLayout({
  children,
}: {
  children: ReactNode;
}) {
  await proxyVendorGuard();

  return (
    <div className="dark">
      <SidebarProvider>
        <VendorSidebar />

        <SidebarInset className="bg-[#09090b] text-white">
          <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between border-b border-white/10 bg-[#09090b]/90 px-4 backdrop-blur-md sm:px-6">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="text-zinc-300 hover:text-white" />
              <span className="h-4 w-px bg-white/10" aria-hidden="true" />
              <span className="text-sm font-semibold text-zinc-300">
                Vendor Portal
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs font-bold text-orange-400">
                <span className="size-1.5 rounded-full bg-orange-400 animate-pulse" />
                Restaurant Active
              </span>
            </div>
          </header>

          <div className="flex-1 p-4 sm:p-6 lg:p-8">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
