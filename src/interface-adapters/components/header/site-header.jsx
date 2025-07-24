"use client";

import { Button } from "@/interface-adapters/components/ui/button";
import { Separator } from "@/interface-adapters/components/ui/separator";
import { SidebarTrigger } from "@/interface-adapters/components/ui/sidebar";
import { useAuth } from "@/interface-adapters/context/AuthContext";   // ← your path here
import { usePathname } from "next/navigation";

export function SiteHeader() {
  const { user, loading } = useAuth();      // user.role is now a single string
  const pathname = usePathname();
  
  const rawSlug = pathname.split("/").filter(Boolean).pop() || "home";
  const slugPart = rawSlug.includes("__") ? rawSlug.split("__")[1] : rawSlug;
  const formattedTitle = slugPart
    .replace(/([a-z])([A-Z])/g, "\$1 \$2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "\$1 \$2")
    .replace(/-/g, " ")
    .split(" ")
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  // role is a plain string
  const role = user?.role || "guest";
  const capitalizedRole = role.charAt(0).toUpperCase() + role.slice(1);

  if (loading || !user) return null;

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] bg-red-600 ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1 text-white" />
        <Separator orientation="vertical" />
        <h1 className="text-base font-medium text-white">{formattedTitle}</h1>
        <div className="ml-auto flex items-center gap-2 bg-amber-50 rounded-full">
          <Button variant="ghost" size="sm" className="rounded-full text-foreground">
            {capitalizedRole}
          </Button>
        </div>
      </div>
    </header>
  );
}