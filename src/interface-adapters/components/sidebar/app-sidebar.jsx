"use client";

import * as React from "react";
import Link from "next/link";

import useAuthGuard from "@/framework-drivers/hooks/useAuthGuard";
import { useState, useEffect } from "react";
import { getUserDetail } from "@/application-business-layer/usecases/token/getUserDetail";
import {
  IconBuildingWarehouse,
  IconDashboard,
  IconUsersGroup,
  IconFolder,
  IconInnerShadowTop,
  IconUsers,
  IconChevronDown,
  IconChevronUp,
  IconListCheck,
  IconInbox,
  IconClockExclamation,
  IconBook,
  IconUserEdit,
  IconArchive,
  IconReport,
  IconListDetails,
} from "@tabler/icons-react";

import { NavSecondary } from "@/interface-adapters/components/nav-secondary";
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
  const [name, setName] = useState("Loading...");
  const [email, setEmail] = useState("Loading...");
  const [hydrated, setHydrated] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [isUserManagementOpen, setIsUserManagmentOpen] = useState(false);
  const [isReferenceOpen, setIsReferenceOpen] = useState(false);

  useEffect(() => {
    setHydrated(true);
    const fetchUser = async () => {
      try {
        const { data } = await getUserDetail();
        const userName = data?.user?.username || "Guest";
        const userEmail = data?.user?.email || "no-email@example.com";
        setName(userName);
        setEmail(userEmail);
      } catch (error) {
        console.error("Error fetching user detail:", error);
      }
    };
    fetchUser();
  }, []);

  const loading = useAuthGuard();
  if (loading) return <div className="flex justify-center items-center min-h-screen"></div>;
  if (!hydrated) return null;

  const projectSubItems = [
    { title: "Project Instance", url: "/projectInstance", icon: IconFolder },
    { title: "Archives", url: "/archives", icon: IconArchive },
    { title: "Unassign Task", url: "/unassignTask", icon: IconListCheck },
    { title: "Assign Task", url: "/assignTask", icon: IconInbox },
  ];

  const referenceItems = [
    { title: "Customers", url: "/customer", icon: IconUsers },
    { title: "Workgroup", url: "/workgroup", icon: IconUsersGroup },
    { title: "Roles", url: "/roles", icon: IconUserEdit },
  ];

  const userManagement = [
    { title: "User Profile", url: "/userProfile", icon: IconUsers },
    { title: "User Role", url: "/userRole", icon: IconUserEdit },
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
                  alt="testimage"
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
          {/* Dashboard */}
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/dashboard" className="flex items-center gap-2">
                <IconDashboard className="size-5" />
                Dashboard
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Projects - Collapsible */}
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

          {/* User Management - Collapsible */}
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

          {/* Reference - Collapsible */}
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

          {/* Other Main Items */}
          {/* 
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="#" className="flex items-center gap-2">
                <IconReport className="size-5" />
                Reports
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="#" className="flex items-center gap-2">
                <IconListDetails className="size-5" />
                My Task
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          */}
        </SidebarMenu>

        {/* <NavSecondary items={navSecondary} className="mt-auto" /> */}
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={{ name, email }} />
      </SidebarFooter>
    </Sidebar>
  );
}
