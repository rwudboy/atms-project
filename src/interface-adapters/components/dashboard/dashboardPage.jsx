import Link from "next/link"
import { Card, CardContent, CardDescription, CardTitle } from "@/interface-adapters/components/ui/card"
import { User, ListChecks, LayoutDashboard } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto py-16 px-6 space-y-16">
        {/* Dashboard Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
            Audit Trail <span className="text-primary">Dashboard</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Monitor user activities, manage records, and maintain accountability across your systems with ease and clarity.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="space-y-10">
          <h2 className="text-4xl font-bold text-center">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

            {/* My Profile - /userProfile */}
            <Link href="/userProfile" passHref>
              <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-border hover:border-primary group h-full flex flex-col justify-between">
                <CardContent className="p-8 flex flex-col items-center text-center gap-6">
                  <div className="p-5 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    <User className="h-8 w-8" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                      User Profile
                    </CardTitle>
                    <CardDescription className="mt-2 text-base text-muted-foreground">
                      Manage your user account and security settings.
                    </CardDescription>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Assign Task - /assignTask */}
            <Link href="/assignTask" passHref>
              <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-border hover:border-primary group h-full flex flex-col justify-between">
                <CardContent className="p-8 flex flex-col items-center text-center gap-6">
                  <div className="p-5 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    <ListChecks className="h-8 w-8" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                      Assign Task
                    </CardTitle>
                    <CardDescription className="mt-2 text-base text-muted-foreground">
                      Allocate task  to designated users.
                    </CardDescription>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Unassign Task - /unassignTask */}
            <Link href="/unassignTask" passHref>
              <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-border hover:border-primary group h-full flex flex-col justify-between">
                <CardContent className="p-8 flex flex-col items-center text-center gap-6">
                  <div className="p-5 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    <ListChecks className="h-8 w-8" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                      Unassign Task
                    </CardTitle>
                    <CardDescription className="mt-2 text-base text-muted-foreground">
                      Unassigned Task (for manager only)
                    </CardDescription>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Project Instance - /projectInstance */}
            <Link href="/projectInstance" passHref>
              <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-border hover:border-primary group h-full flex flex-col justify-between">
                <CardContent className="p-8 flex flex-col items-center text-center gap-6">
                  <div className="p-5 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    <LayoutDashboard className="h-8 w-8" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                      Project Instance
                    </CardTitle>
                    <CardDescription className="mt-2 text-base text-muted-foreground">
                      Access and use ur instance whenever u want.
                    </CardDescription>
                  </div>
                </CardContent>
              </Card>
            </Link>

          </div>
        </div>
      </div>
    </div>
  )
}
