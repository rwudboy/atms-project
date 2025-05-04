"use client";

import { AppSidebar } from "@/interface-adapters/components/sidebar/app-sidebar";
import { Toaster } from 'sonner';
import { SiteHeader } from "@/interface-adapters/components/header/site-header";
import {
  SidebarInset,
  SidebarProvider,
} from "@/interface-adapters/components/ui/sidebar";
import WorkgroupsPage from '@/interface-adapters/components/workgroup/workgroup-form'; 

export default function Workgroup() {
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
          <WorkgroupsPage />
          <Toaster />
        </div>
      </SidebarInset>

    </SidebarProvider>
  );
}
