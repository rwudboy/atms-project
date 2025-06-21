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

  const pageSlug = pathname.split("/").filter(Boolean).shift() || "home";
  const formattedTitle = pageSlug
    .replace(/-/g, " ")
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  useEffect(() => {
    setHydrated(true);

    const fetchRole = async () => {
  try {
    const { data } = await getUserDetail();
    const roleString = data?.user?.Role || "";
    const roleArray = roleString.split(",").map(r => r.trim());
    const firstRoleRaw = roleArray[0] || "Guest";
    const firstRole = firstRoleRaw.charAt(0).toUpperCase() + firstRoleRaw.slice(1).toLowerCase();
    setRole(firstRole);
  } catch (error) {
    console.error("Error fetching role:", error);
  }
};


    fetchRole();
  }, []);

  if (!hydrated || role === null) return null;

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] bg-red-600 ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        <h1 className="text-base font-medium">{formattedTitle}</h1>
        <div className="ml-auto flex items-center gap-2 rounded-full">
          <Button variant="ghost" size="sm" className="sm:flex dark:text-foreground rounded-full" >
            {`${role}`}
          </Button>
        </div>
      </div>
    </header>
  );
}
