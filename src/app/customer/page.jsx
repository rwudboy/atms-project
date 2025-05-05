"use client";

import { AppSidebar } from "@/interface-adapters/components/sidebar/app-sidebar";
import { SiteHeader } from "@/interface-adapters/components/header/site-header";
import { SidebarInset, SidebarProvider } from "@/interface-adapters/components/ui/sidebar";
import  CustomerForm  from "@/interface-adapters/components/customer/customer-form";
import { Toaster } from 'sonner';



export default function CustomerFormPage() {
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
        <div className="p-6 flex justify-center">
          <CustomerForm />
          <Toaster />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
