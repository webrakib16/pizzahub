import type { ReactNode } from "react";
import DashboardSidebar from "@/components/dashboard/shared/DashboardSidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { proxyCustomerGuard } from "@/lib/proxy";

const DashboardLayout = async ({ children }: { children: ReactNode }) => {
  await proxyCustomerGuard();

  return (
    <div className="dark">
      <SidebarProvider>
        <DashboardSidebar />

        <SidebarInset className="bg-[#09090b] text-white">
          <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-3 border-b border-white/10 bg-[#09090b]/90 px-4 backdrop-blur-md sm:px-6">
            <SidebarTrigger className="text-zinc-300 hover:text-white" />
            <span className="h-4 w-px bg-white/10" aria-hidden="true" />
            <span className="text-sm font-semibold text-zinc-300">
              Customer Dashboard
            </span>
          </header>

          <div className="flex-1 p-4 sm:p-6 lg:p-8">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};

export default DashboardLayout;
