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
  const rawSlug = pathname.split("/").filter(Boolean).pop() || "home";
  const slugPart = rawSlug.includes("__") ? rawSlug.split("__")[1] : rawSlug;
  const formattedTitle = slugPart
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .replace(/-/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");


  useEffect(() => {
    setHydrated(true);
    const fetchRole = async () => {
      try {
        const { data } = await getUserDetail();
        const user = data.user;
        const roles = user?.role || [];
        const selectedRole = roles[0] || "guest";
        const capitalizedRole = selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1);
        setRole(capitalizedRole);
      } catch (error) {
        console.error("Error fetching user detail:", error);
      }
    };


    fetchRole();
  }, []);


  if (!hydrated || role === null) return null;

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] bg-red-600 ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1 text-white" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        <h1 className="text-base font-medium text-white">{formattedTitle}</h1>
        <div className="ml-auto flex items-center gap-2 bg-amber-50 rounded-full">
          <Button variant="ghost" size="sm" className="sm:flex dark:text-foreground rounded-full">
            {role}
          </Button>
        </div>
      </div>
    </header>
  );
}
