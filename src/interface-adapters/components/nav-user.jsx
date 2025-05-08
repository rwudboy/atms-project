"use client";

import {
  IconCreditCard,
  IconDotsVertical,
  IconNotification,
  IconUserCircle,
  IconUserFilled,
} from "@tabler/icons-react";
import AccountDetailModal from "@/interface-adapters/components/modals/account-detail/account-detail-modal";
import { useState, useEffect } from "react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/interface-adapters/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/interface-adapters/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/interface-adapters/components/ui/sidebar";

export function NavUser({ user }) {
  const { isMobile } = useSidebar();
  const [modalOpen, setModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // console.log(user)

  const getInitials = (name) => {
    if (!name) return "";
    const parts = name.trim().split(" ");
    const first = parts[0]?.[0] || "";
    const second = parts[1]?.[0] || "";
    return (first + second).toUpperCase();
  };


  const initials = getInitials(user.name);
  useEffect(() => {
    if (user && user.name && user.email) {
      setDefaultValues({
        fullName: user.name || "",
        username: user.username || "",
        email: user.email || "",
        phone: user.phone || "",
        dateOfBirth: user.TanggalLahir || "",
        position: user.Role || "",
      });

      console.log('test')
    }
  }, [user]);
  const [defaultValues, setDefaultValues] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    position: "",
  });

  // console.log(defaultValues, "isi")



  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg grayscale">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user.email}
                  </span>
                </div>
                <IconDotsVertical className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user.name}</span>
                    <span className="text-muted-foreground truncate text-xs">
                      {user.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.preventDefault();

                    // Only allow opening if user data is ready
                    if (user && user.name && user.email) {
                      setDropdownOpen(false);
                      setTimeout(() => setModalOpen(true), 100);
                    } else {
                      console.warn("User data not fully loaded yet.");
                    }
                  }}
                >
                  <IconUserCircle />
                  Account
                </DropdownMenuItem>

                <DropdownMenuItem>
                  <IconNotification />
                  Notifications
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => {
                  localStorage.removeItem("authToken");
                  window.location.href = "/login";
                }}
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      {/* Account Detail Modal */}
      <AccountDetailModal
        isOpen={modalOpen}
        onOpenChange={(open) => {
          setModalOpen(open);
          if (!open) setDropdownOpen(false); // Keep dropdown closed
        }}
        defaultValues={defaultValues}
        onSave={(data) => {
          console.log("Saved data:", data);
        }}
      />
    </>
  );
}