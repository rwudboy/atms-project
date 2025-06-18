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

export const RoleViewModal = ({ isOpen, onClose, role }) => {
  if (!role) return null

  // Ensure 'role.user' exists before attempting to map
  const users = role.user?.userName?.map((name, index) => ({
    name: name,
    email: role.user.email?.[index], // Use optional chaining for email as well
    status: role.user.status // Assuming a single status for all users within this role
  })) || []

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
            {/* Removed the Description section entirely */}
            <div>
              <h4 className="font-medium">Status</h4>
              <p className={role.user?.status === "active" ? "text-green-500" : "text-gray-400"}>
                {role.user?.status || "Unknown"}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-lg">Associated Users</h3>
            {users.length > 0 ? (
              <div className="space-y-4 max-h-[300px] overflow-y-auto">
                {users.map((user, index) => ( // Use index as key if no unique ID is available
                  <div key={user.email || index} className="flex items-center space-x-4 p-2 rounded-md hover:bg-gray-100">
                    <Avatar>
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <p className="font-medium">{user.name || "Unknown User"}</p>
                      <p className="text-sm text-muted-foreground">{user.email || "No email"}</p>
                      <p className="text-sm text-muted-foreground">Status: <span className={user.status === "active" ? "text-green-500" : "text-gray-400"}>{user.status || "Unknown"}</span></p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-muted-foreground">No users assigned to this role</p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}