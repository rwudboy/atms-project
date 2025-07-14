"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/interface-adapters/components/ui/card"
import {
  User,
  ListChecks,
  LayoutDashboard,
} from "lucide-react"

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
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
}

export default function DashboardPage() {
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
            Monitor user activities, manage records, and maintain accountability across your systems with ease and clarity.
          </motion.p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div className="space-y-10" variants={itemVariants}>
          <h2 className="text-4xl font-bold text-center">Quick Actions</h2>

          {/* Grid of Cards */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch"
            variants={containerVariants}
          >
            {[
              {
                title: "User Profile",
                description: "Manage your user account and security settings.",
                href: "/userProfile",
                icon: <User className="h-8 w-8" />,
              },
              {
                title: "Assign Task",
                description: "Allocate task to designated users.",
                href: "/assignTask",
                icon: <ListChecks className="h-8 w-8" />,
              },
              {
                title: "Unassign Task",
                description: "Unassigned Task",
                href: "/unassignTask",
                icon: <ListChecks className="h-8 w-8" />,
              },
              {
                title: "Project Instance",
                description: "Access and use your instance.",
                href: "/projectInstance",
                icon: <LayoutDashboard className="h-8 w-8" />,
              },
            ].map((item, index) => (
              <Link href={item.href} passHref key={index}>
                <motion.div variants={itemVariants} className="h-full">
                  <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-border hover:border-primary group flex flex-col justify-between">
                    <CardContent className="p-8 flex flex-col items-center text-center gap-6 flex-grow">
                      <div className="p-5 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                        {item.icon}
                      </div>
                      <div>
                        <CardTitle className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                          {item.title}
                        </CardTitle>
                        <CardDescription className="mt-2 text-base text-muted-foreground">
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
  )
}
