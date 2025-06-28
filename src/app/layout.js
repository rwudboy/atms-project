"use client";

import { Geist, Geist_Mono } from "next/font/google";
import { usePathname } from "next/navigation";
import { AppSidebar } from "@/interface-adapters/components/sidebar/app-sidebar";
import { SiteHeader } from "@/interface-adapters/components/header/site-header";
import { SidebarInset, SidebarProvider } from "@/interface-adapters/components/ui/sidebar";
import { Footer } from "@/interface-adapters/components/footer/footer";
import { Toaster } from "sonner";
import { AuthProvider } from "@/interface-adapters/context/AuthContext";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const pageSlug = pathname.split("/").filter(Boolean)[0] || "home";
  const excludedRoutes = ["/otp", "/login", "/register"];
  const isExcludedRoute = excludedRoutes.includes(pathname);

  const formattedTitle = pageSlug
    .replace(/-/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <html lang="en">
      <head>
        <title>{formattedTitle}</title>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {isExcludedRoute ? (
          <>
            {children}
            <Toaster />
          </>
        ) : (
          <AuthProvider>
            <SidebarProvider
              style={{
                "--sidebar-width": "calc(var(--spacing) * 72)",
                "--header-height": "calc(var(--spacing) * 12)",
              }}
            >
              <AppSidebar variant="inset" />
              <SidebarInset>
                <SiteHeader />
                <div className="flex flex-col min-h-screen">
                  <main className="flex-grow p-6">{children}</main>
                  <Footer />
                </div>
                <Toaster richColors />
              </SidebarInset>
            </SidebarProvider>
          </AuthProvider>
        )}
      </body>
    </html>
  );
}