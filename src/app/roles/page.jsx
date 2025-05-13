

"use client";

import { AppSidebar } from "@/interface-adapters/components/sidebar/app-sidebar";
import { Toaster } from "sonner";
import { SiteHeader } from "@/interface-adapters/components/header/site-header";
import {
  SidebarProvider,
  SidebarInset,
} from "@/interface-adapters/components/ui/sidebar";

import RolePage from "@/interface-adapters/components/roles/role-page"; // Your vendor component

export default function Role() {
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
          <RolePage />
          <Toaster />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}