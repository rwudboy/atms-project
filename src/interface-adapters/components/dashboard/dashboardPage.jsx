"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/interface-adapters/components/ui/card";
import { User, Users, ListChecks, LayoutDashboard } from "lucide-react";
import { getTasks } from "@/application-business-layer/usecases/assign-task/get-task";
import { useAuth } from "@/interface-adapters/context/AuthContext"; // Import useAuth

// Animation variants
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth(); // Get user and loading from useAuth
  const [taskCount, setTaskCount] = useState(0);
  // userRole will be derived directly from the 'user' object once available
  const userRole = user?.role?.toLowerCase();

  useEffect(() => {
    const fetchTasks = async () => {
      // Only fetch tasks if authLoading is false and user data is available
      if (!authLoading && user) {
        try {
          const response = await getTasks();
          if (response?.data?.status && Array.isArray(response.data.data)) {
            if (userRole === "manager") {
              // For managers: count tasks where Resolve is not 0
              const unresolvedCount = response.data.data.filter(
                (task) => task.Resolve !== 0
              ).length;
              setTaskCount(unresolvedCount);
            } else {
              // For other roles: count total tasks
              setTaskCount(response.data.data.length);
            }
          }
        } catch (error) {
          console.error("Error fetching tasks:", error);
        }
      }
    };

    fetchTasks();
  }, [authLoading, user, userRole]); 

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="ml-2 text-lg text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-background text-foreground"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="container mx-auto py-16 px-6 space-y-16">
        {/* Header */}
        <motion.div className="text-center space-y-4" variants={itemVariants}>
          <motion.h1
            className="text-5xl font-bold tracking-tight sm:text-6xl"
            variants={itemVariants}
          >
            Audit Trail <span className="text-primary">Management System</span>
          </motion.h1>
          <motion.p
            className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            variants={itemVariants}
          >
            Monitor user activities, manage records, and maintain accountability
            across your systems with ease and clarity.
          </motion.p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div className="space-y-10" variants={itemVariants}>
          <h2 className="text-4xl font-bold text-center">Quick Actions</h2>

          {/* Grid of Cards - Centered 3 cards */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto"
            variants={containerVariants}
          >
            {[
              {
                title: "User Profile",
                description:
                  "Manage your personal account settings, security preferences, and user information to keep your profile up to date.",
                href: "/userProfile",
                icon: <User className="h-8 w-8" />,
                showBadge: false,
                badgeCount: 0,
              },
              {
                title: "Workgroup",
                description:
                  "Collaborate with your team and access shared resources.",
                href: "/workgroup",
                icon: <Users className="h-8 w-8" />,
                showBadge: false,
                badgeCount: 0,
              },
              {
                title: "Task",
                description:
                  "View, assign, and track all your tasks efficiently. Monitor progress and ensure timely completion of assignments.",
                href: "/task",
                icon: <ListChecks className="h-8 w-8" />,
                showBadge: taskCount > 0,
                badgeCount: taskCount,
              },
              ...(userRole !== "staff" // Use the derived userRole here
                ? [
                    {
                      title: "Project Instance",
                      description:
                        "Access and manage your project instances. Monitor system performance and configure project-specific settings.",
                      href: "/projectInstance",
                      icon: <LayoutDashboard className="h-8 w-8" />,
                      showBadge: false,
                      badgeCount: 0,
                    },
                  ]
                : []),
            ].map((item, index) => (
              <Link href={item.href} passHref key={index}>
                <motion.div variants={itemVariants} className="h-full">
                  <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-border hover:border-primary group flex flex-col justify-between">
                    <CardContent className="p-8 flex flex-col items-center text-center gap-6 flex-grow">
                      <div className="relative p-5 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                        {item.icon}
                        {item.showBadge && (
                          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center min-w-[24px] shadow-lg">
                            {item.badgeCount}
                          </span>
                        )}
                      </div>
                      <div className="space-y-3">
                        <CardTitle className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                          {item.title}
                        </CardTitle>
                        <CardDescription className="text-base text-muted-foreground leading-relaxed">
                          {item.description}
                        </CardDescription>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}