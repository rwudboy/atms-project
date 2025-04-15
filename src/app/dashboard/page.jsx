import { AppSidebar } from "@/interface-adapters/dashboard/app-sidebar"
import { ChartAreaInteractive } from "@/interface-adapters/dashboard/chart-area-interactive"
import { DataTable } from "@/interface-adapters/dashboard/data-table"
import { SectionCards } from "@/interface-adapters/dashboard/section-cards"
import { SiteHeader } from "@/interface-adapters/dashboard/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/interface-adapters/components/ui/sidebar"

import data from "./data.json"

export default function Page() {
  return (
    (<SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)"
        }
      }>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
              <DataTable data={data} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>)
  );
}
