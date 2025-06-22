

"use client";

import { AppSidebar } from "@/interface-adapters/components/sidebar/app-sidebar";
import { Toaster } from "sonner";
import { SiteHeader } from "@/interface-adapters/components/header/site-header";
import {
  SidebarProvider,
  SidebarInset,
} from "@/interface-adapters/components/ui/sidebar";

import UnassignTaskPage from "@/interface-adapters/components/unassign-task/unassign-task-form"; 

export default function UnassignTask() {
  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      }}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="p-6">
          <UnassignTaskPage />
          <Toaster />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}