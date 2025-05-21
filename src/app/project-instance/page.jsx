

"use client";

import { AppSidebar } from "@/interface-adapters/components/sidebar/app-sidebar";
import { Toaster } from "sonner";
import { SiteHeader } from "@/interface-adapters/components/header/site-header";
import {
  SidebarProvider,
  SidebarInset,
} from "@/interface-adapters/components/ui/sidebar";

import ProjectInstancePage from "@/interface-adapters/components/project-instance/project-instance-form"; 

export default function ProjectInstance() {
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
          <ProjectInstancePage />
          <Toaster />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}