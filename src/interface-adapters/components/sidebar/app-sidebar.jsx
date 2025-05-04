"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { getUserDetail } from "@/interface-adapters/usecases/token/getUserDetail";
import {
  IconCamera,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconUsersGroup,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconSettings,
  IconUsers,
  IconCalendarWeek,
  IconReport,
  IconListDetails,
  IconChevronDown,
  IconChevronUp,
  IconCirclePlus,
  IconListCheck,
  IconInbox,
  IconFlag,
  IconList,
  IconBook,
  IconFileText,
  IconManualGearbox,
  IconFileSearch,
  IconBulb,
  IconArchive,
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
  const [isReferenceOpen, setIsReferenceOpen] = useState(false);


  useEffect(() => {
    setHydrated(true);
    const fetchUser = async () => {
      try {
        const userDetail = await getUserDetail();
        const userName = userDetail?.user?.username || "Guest";
        const userEmail = userDetail?.user?.email || "no-email@example.com";
        setName(userName);
        setEmail(userEmail);
      } catch (error) {
        console.error("Error fetching user detail:", error);
      }
    };
    fetchUser();
  }, []);

  const navSecondary = [
    { title: "Settings", url: "#", icon: IconSettings },
    { title: "Get Help", url: "#", icon: IconHelp },
  ];

  const projectSubItems = [
    { title: "New Project", url: "#", icon: IconCirclePlus },
    { title: "All Project", url: "#", icon: IconFolder },
    { title: "New Milestone", url: "#", icon: IconFlag },
    { title: "Milestones", url: "#", icon: IconList },
    { title: "Tasks", url: "#", icon: IconListCheck },
    { title: "Inbox", url: "#", icon: IconInbox },
  ];

  const referenceItems = [
    { title: "Customers", url: "/customer", icon: IconUsers },
    { title: "Workgroup", url: "/workgroup", icon: IconUsersGroup },
    { title: "Manuals", url: "#", icon: IconManualGearbox },
    { title: "Search Files", url: "#", icon: IconFileSearch },
    { title: "Tips & Tricks", url: "#", icon: IconBulb },
    { title: "Archives", url: "#", icon: IconArchive },
  ];

  if (!hydrated) return null;

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">ATMS.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu className="px-4">

          {/* Dashboard */}
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="/dashboard" className="flex items-center gap-2">
                <IconDashboard className="size-5" />
                Dashboard
              </a>
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

          {isProjectsOpen && projectSubItems.map((item, index) => (
            <SidebarMenuItem key={index}>
              <SidebarMenuButton asChild>
                <a href={item.url} className="flex items-center gap-2 pl-8">
                  <item.icon className="size-4" />
                  {item.title}
                </a>
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

          {isReferenceOpen && referenceItems.map((item, index) => (
            <SidebarMenuItem key={index}>
              <SidebarMenuButton asChild>
                <a href={item.url} className="flex items-center gap-2 pl-8">
                  <item.icon className="size-4" />
                  {item.title}
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}


          {/* Other Main Items */}
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="#" className="flex items-center gap-2">
                <IconCalendarWeek className="size-5" />
                Calendar
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>

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
        </SidebarMenu>

        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={{ name, email }} />
      </SidebarFooter>
    </Sidebar>
  );
}
