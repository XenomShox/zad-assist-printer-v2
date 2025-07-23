import { useEffect } from "react";
import { Outlet } from "react-router";

import { AppSidebar } from "@/components/app-sidebar";
import DashboardHeader from "@/components/dashboard/header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { MachineProvider } from "@/context/machine";
import { PageProvider } from "@/context/page-context";
import type { TConversationType } from "@/types/conversations";

interface DashboardLayoutProps {
  redirectPath: string;
  conversationType: TConversationType;
}

const DashboardLayout = ({
  redirectPath,
  conversationType,
}: DashboardLayoutProps) => {
  useEffect(() => {
    document.title = "Dashboard";
  }, []);

  return (
    <PageProvider
      redirectPath={redirectPath}
      conversationType={conversationType}
    >
      <SidebarProvider>
        <AppSidebar collapsible="icon" />
        <SidebarInset>
          <MachineProvider>
            <DashboardHeader />

            <div className="flex flex-1 flex-col gap-4">
              <Outlet />
            </div>
          </MachineProvider>
        </SidebarInset>
      </SidebarProvider>
    </PageProvider>
  );
};

export default DashboardLayout;
