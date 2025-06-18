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
import { AlertTriangle } from "lucide-react"

export const RoleDeleteModal = ({ isOpen, onClose, onDelete, role, isDeleting }) => {
  if (!role) return null

  const hasUsers = role.users && role.users.length > 0 || role.userCount > 0
  const userCount = role.users ? role.users.length : (role.userCount || 0)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center text-red-500">
            <AlertTriangle className="mr-2 h-5 w-5" />
            Delete "{role.name}"
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. Please confirm you want to delete this role.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <h3 className="font-medium">Role Information</h3>
            <p>
              <strong>Name:</strong> {role.name}
            </p>
            <p>
              <strong>Description:</strong> {role.description || "No description"}
            </p>
            <p>
              <strong>Created:</strong> {role.created || role.createdAt || "Unknown"}
            </p>
          </div>

          {hasUsers && (
            <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
              <h3 className="font-medium text-amber-800 flex items-center">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Warning
              </h3>
              <p className="text-amber-700">
                This role has {userCount} user{userCount !== 1 ? 's' : ''} assigned to it. You must remove these users from the role before
                deleting it.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onDelete} disabled={isDeleting || hasUsers}>
            {isDeleting ? "Deleting..." : "Delete Role"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}