import { useEffect } from "react";
import { Outlet } from "react-router";

import { AppSidebar } from "@/components/app-sidebar";
import DashboardHeader from "@/components/dashboard/header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

interface DashboardLayoutProps {
  redirectPath: string;
  conversationType: "base" | "parameter";
}

const DashboardLayout = ({
  redirectPath,
  conversationType,
}: DashboardLayoutProps) => {
  //   console.log({ redirectPath, conversationType });

  useEffect(() => {
    document.title = "Dashboard";
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar collapsible="icon" />
      <SidebarInset>
        <DashboardHeader />

        <div className="flex flex-1 flex-col gap-4 p-4">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardLayout;
