"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/interface-adapters/components/ui/dialog"
import { Button } from "@/interface-adapters/components/ui/button"
import { Avatar, AvatarFallback } from "@/interface-adapters/components/ui/avatar"
import { Badge } from "@/interface-adapters/components/ui/badge"
import { Users } from "lucide-react"

export const RoleViewModal = ({ isOpen, onClose, role }) => {
  if (!role) return null

  const { user } = role || {}

  // Determine users list: use array if available, otherwise single fallback user
  const users =
    Array.isArray(user?.userName) && user.userName.length > 0
      ? user.userName.map((name, index) => ({
          name,
          email: user.email?.[index] || "N/A",
          status: user.status || "Unknown",
        }))
      : user?.name
      ? [
          {
            name: user.name,
            email: "N/A",
            status: user.status || "Unknown",
          },
        ]
      : []

  const getInitials = (name) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "inactive":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-600 border-gray-200"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{role.name}</DialogTitle>
          <DialogDescription>Workgroup role details and associated users</DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 md:grid-cols-2 mt-4">
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Role Information</h3>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Status</h4>
                <Badge variant="outline" className={getStatusColor(user?.status)}>
                  {user?.status || "Unknown"}
                </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-lg">Associated Users</h3>
            {users.length > 0 ? (
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                {users.map((user, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-2 rounded-md hover:bg-gray-100"
                  >
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-medium">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <p className="font-medium text-gray-900">{user.name || "Unknown User"}</p>
                      <p className="text-sm text-muted-foreground">{user.email || "No email"}</p>
                      <p className="text-sm text-muted-foreground">
                        Status:{" "}
                        <span
                          className={
                            user.status === "active" ? "text-green-500" : "text-gray-400"
                          }
                        >
                          {user.status || "Unknown"}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Users className="h-6 w-6 text-gray-400 mb-2" />
                <p className="text-gray-500 font-medium">No users assigned</p>
                <p className="text-sm text-gray-400">
                  This role doesn't have any users associated with it yet.
                </p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
