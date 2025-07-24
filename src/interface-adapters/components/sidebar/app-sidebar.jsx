"use client";

import * as React from "react";
import Link from "next/link";

// If you still need useAuthGuard for route protection beyond just fetching user data
import useAuthGuard from "@/framework-drivers/hooks/useAuthGuard";
import { useAuth } from "@/interface-adapters/context/AuthContext"; // Import useAuth hook

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

export function AppSidebar(props) {
  const { user, loading: authLoading } = useAuth();
  const loadingGuard = useAuthGuard();

  const [isProjectsOpen, setIsProjectsOpen] = React.useState(false);
  const [isUserManagementOpen, setIsUserManagmentOpen] = React.useState(false);
  const [isReferenceOpen, setIsReferenceOpen] = React.useState(false);

  const name = user?.fullName || user?.username || "Guest";
  const email = user?.email || "no-email@example.com";
  const userRole = user?.role || ""; 

  if (authLoading || loadingGuard) {
    return <div className="flex justify-center items-center min-h-screen"></div>;
  }

  const projectSubItems = [
    { title: "Project Instance", url: "/projectInstance", icon: IconFolder },
    { title: "Archives", url: "/archives", icon: IconArchive },
    { title: "Task", url: "/task", icon: IconInbox },
  ];

  const referenceItems = [
    { title: "Customers", url: "/customer", icon: IconUsers },
    { title: "Workgroup", url: "/workgroup", icon: IconUsersGroup },
    { title: "Roles", url: "/roles", icon: IconUserEdit },
  ];

  const userManagement = [
    { title: "User Profile", url: "/userProfile", icon: IconUsers },
    { title: "User Role", url: "/userRole", icon: IconUserEdit }, // Assuming '/userRole' is for managing roles
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
          {userRole.toLowerCase() === "staff" ? ( // Ensure case-insensitivity
            <>
              {/* User Profile */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href={`/userProfile/${user?.username || ''}`} className="flex items-center gap-2"> {/* Link to specific user profile */}
                    <IconUsers className="size-5" />
                    User Profile
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Task */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/task" className="flex items-center gap-2">
                    <IconInbox className="size-5" />
                    Task
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Workgroup */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/workgroup" className="flex items-center gap-2">
                    <IconUsersGroup className="size-5" />
                    Workgroup
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </>
          ) : (
            <>
              {/* Dashboard */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard" className="flex items-center gap-2">
                    <IconDashboard className="size-5" />
                    Dashboard
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Projects */}
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
                projectSubItems.map((item, index) => (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url} className="flex items-center gap-2 pl-8">
                        <item.icon className="size-4" />
                        {item.title}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}

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
                userManagement.map((item, index) => (
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
                referenceItems.map((item, index) => (
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
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={{ name, email }} />
      </SidebarFooter>
    </Sidebar>
  );
}