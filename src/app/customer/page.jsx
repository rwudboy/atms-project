"use client";

import { AppSidebar } from "@/interface-adapters/components/sidebar/app-sidebar";
import { SiteHeader } from "@/interface-adapters/components/header/site-header";
import { SidebarInset, SidebarProvider } from "@/interface-adapters/components/ui/sidebar";
import CustomerForm from "@/interface-adapters/components/customer/customer-form";
import { Toaster } from "sonner";
import { Footer } from "@/interface-adapters/components/footer/footer";

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
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow p-6 flex justify-center">
            <CustomerForm />
          </main>

          <Footer/>
        </div>
        <Toaster />
      </SidebarInset>
    </SidebarProvider>
  );
}
