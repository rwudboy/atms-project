"use client";

import { useEffect, useState } from "react";
import { Button } from "@/interface-adapters/components/ui/button";
import { Separator } from "@/interface-adapters/components/ui/separator";
import { SidebarTrigger } from "@/interface-adapters/components/ui/sidebar";
import { getUserDetail } from "@/interface-adapters/usecases/token/getUserDetail";
import { usePathname } from "next/navigation";

export function SiteHeader() {
  const [role, setRole] = useState(null);
  const [hydrated, setHydrated] = useState(false); 
  const pathname = usePathname();

  const pageTitle = pathname
  .split("/")
  .filter(Boolean)
  .shift() || "Home";

  const formattedTitle = pageTitle.charAt(0).toUpperCase() + pageTitle.slice(1);

  useEffect(() => {
    setHydrated(true); 

    const fetchRole = async () => {
      try {
        const userDetail = await getUserDetail();
        const userRole = userDetail?.user?.Role ?? "Guest";
        setRole(userRole);
      } catch (error) {
        console.error("Error fetching role:", error);
      }
    };    

    fetchRole();
  }, []);

  if (!hydrated || role === null) {
    return null; 
  }

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        <h1 className="text-base font-medium"> {formattedTitle}</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="sm" className="sm:flex dark:text-foreground">
            {`Role: ${role}`}
          </Button>
        </div>
      </div>
    </header>
  );
}
