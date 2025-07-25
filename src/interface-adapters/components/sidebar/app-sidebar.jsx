"use client";

import * as React from "react";
import Link from "next/link";

import useAuthGuard from "@/framework-drivers/hooks/useAuthGuard";
import { useAuth } from "@/interface-adapters/context/AuthContext";

import {
  IconDashboard,
  IconFolder,
  IconInbox,
  IconUsers,
  IconChevronDown,
  IconChevronUp,
  IconUsersGroup,
  IconUserEdit,
  IconArchive,
  IconBook,
} from "@tabler/icons-react";

import { NavUser } from "@/interface-adapters/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/interface-adapters/components/ui/sidebar";
import { Skeleton } from "@/interface-adapters/components/ui/skeleton";

// Skeleton loader
const SidebarSkeletonLoader = () => (
  <Sidebar>
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
            <div className="flex items-center gap-2">
              <Skeleton className="!size-5 rounded" />
              <Skeleton className="w-16 h-5" />
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>

    <SidebarContent>
      <SidebarMenu className="px-4">
        {[...Array(5)].map((_, i) => (
          <SidebarMenuItem key={i}>
            <SidebarMenuButton asChild>
              <div className="flex items-center gap-2">
                <Skeleton className="size-5" />
                <Skeleton className="w-24 h-4" />
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarContent>

    <SidebarFooter>
      <div className="flex items-center gap-4 p-4">
        <Skeleton className="size-9 rounded-full" />
        <div className="space-y-1">
          <Skeleton className="w-24 h-4" />
          <Skeleton className="w-16 h-3" />
        </div>
      </div>
    </SidebarFooter>
  </Sidebar>
);

export function AppSidebar(props) {
  const { user, loading: authLoading } = useAuth();
  const loadingGuard = useAuthGuard();

  const [isProjectsOpen, setIsProjectsOpen] = React.useState(false);
  const [isUserManagementOpen, setIsUserManagmentOpen] = React.useState(false);
  const [isReferenceOpen, setIsReferenceOpen] = React.useState(false);

  const name = user?.fullName || user?.username || "Guest";
  const email = user?.email || "no-email@example.com";
  const userRole = user?.role || ""; 
  const userName = user?.username || '';

  if (authLoading || loadingGuard) {
    return <SidebarSkeletonLoader />;
  }

  const isStaff = userRole.toLowerCase() === "staff";
  const isAdmin = userRole.toLowerCase() === "admin";

  // For both staff and non-staff, but will filter for staff
  const projectSubItems = [
    { title: "Project Instance", url: "/projectInstance", icon: IconFolder, staffVisible: false },
    { title: "Archives", url: "/archives", icon: IconArchive, staffVisible: true },
    { title: "Task", url: "/task", icon: IconInbox, staffVisible: true },
  ];

  const referenceItems = [
    { title: "Customers", url: "/customer", icon: IconUsers, staffVisible: false },
    { title: "Workgroup", url: "/workgroup", icon: IconUsersGroup, staffVisible: true },
    { title: "Roles", url: "/roles", icon: IconUserEdit, staffVisible: false },
  ];

  const userManagementItems = [
    { title: "User Profile", url: isStaff ? `/userProfile/${userName}` : "/userProfile", icon: IconUsers, staffVisible: true },
    { title: "User Role", url: "/userRole", icon: IconUserEdit, staffVisible: false },
  ];

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <Link href="#" className="flex items-center gap-2">
                <img
                  src="/icon.jpg"
                  alt="Logo"
                  className="!size-5 object-cover rounded"
                />
                <span className="text-base font-semibold">ATMS.</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu className="px-4">
          {/* Dashboard - Always visible */}
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/dashboard" className="flex items-center gap-2">
                <IconDashboard className="size-5" />
                Dashboard
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Projects section: hidden for admin */}
          {!isAdmin && (
            <>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => setIsProjectsOpen(!isProjectsOpen)}>
                  <IconFolder className="mr-2 size-5" />
                  <span>Projects</span>
                  {isProjectsOpen ? (
                    <IconChevronUp className="ml-auto size-4" />
                  ) : (
                    <IconChevronDown className="ml-auto size-4" />
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>

              {isProjectsOpen &&
                projectSubItems
                  .filter(item => !isStaff || item.staffVisible)
                  .map((item, index) => (
                    <SidebarMenuItem key={index}>
                      <SidebarMenuButton asChild>
                        <Link href={item.url} className="flex items-center gap-2 pl-8">
                          <item.icon className="size-4" />
                          {item.title}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
            </>
          )}

          {/* User Management */}
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => setIsUserManagmentOpen(!isUserManagementOpen)}>
              <IconUsers className="mr-2 size-5" />
              <span>User Management</span>
              {isUserManagementOpen ? (
                <IconChevronUp className="ml-auto size-4" />
              ) : (
                <IconChevronDown className="ml-auto size-4" />
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>

          {isUserManagementOpen &&
            userManagementItems
              .filter(item => !isStaff || item.staffVisible)
              .map((item, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url} className="flex items-center gap-2 pl-8">
                      <item.icon className="size-4" />
                      {item.title}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

          {/* Reference */}
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => setIsReferenceOpen(!isReferenceOpen)}>
              <IconBook className="mr-2 size-5" />
              <span>Reference</span>
              {isReferenceOpen ? (
                <IconChevronUp className="ml-auto size-4" />
              ) : (
                <IconChevronDown className="ml-auto size-4" />
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>

          {isReferenceOpen &&
            referenceItems
              .filter(item => !isStaff || item.staffVisible)
              .map((item, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url} className="flex items-center gap-2 pl-8">
                      <item.icon className="size-4" />
                      {item.title}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={{ name, email }} />
      </SidebarFooter>
    </Sidebar>
  );
}