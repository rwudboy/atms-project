"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/interface-adapters/components/ui/dialog"
import { Button } from "@/interface-adapters/components/ui/button"
import { Label } from "@/interface-adapters/components/ui/label"
import { Input } from "@/interface-adapters/components/ui/input"
import { Textarea } from "@/interface-adapters/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/interface-adapters/components/ui/select"
import { Plus, X, AlertTriangle, Eye } from "lucide-react"
import { Avatar, AvatarFallback } from "@/interface-adapters/components/ui/avatar"
import { toast } from "sonner"

// ==================== ROLE ADD/EDIT MODAL ====================
export const RoleModal = ({ open, role, onSave, onClose }) => {
  const [roleName, setRoleName] = useState("")
  const [roleStatus, setRoleStatus] = useState("inactive")
  const [description, setDescription] = useState("")
  const [permissions, setPermissions] = useState([])
  const [newPermission, setNewPermission] = useState("")
  
  const isEditing = !!role

  const resetForm = () => {
    setRoleName("")
    setRoleStatus("inactive")
    setDescription("")
    setPermissions([])
    setNewPermission("")
  }

  // Initialize form when modal opens or role changes
  useEffect(() => {
    if (role) {
      setRoleName(role.name || "")
      setRoleStatus(role.status || "inactive")
      setDescription(role.description || "")
      setPermissions(role.permissions || [])
    } else {
      resetForm()
    }
  }, [role, open])

  const addPermission = () => {
    if (newPermission.trim() && !permissions.includes(newPermission.trim())) {
      setPermissions([...permissions, newPermission.trim()])
      setNewPermission("")
    }
  }

  const removePermission = (index) => {
    setPermissions(permissions.filter((_, i) => i !== index))
  }

  const handleSave = () => {
    if (!roleName.trim()) {
      toast.error("Role name is required")
      return
    }

    const roleData = { 
      name: roleName, 
      status: roleStatus,
      description,
      permissions 
    }
    
    onSave(role?.uuid || null, roleData)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Role" : "Add New Role"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Modify an existing role" : "Create a new role in the system"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="roleName">Role Name</Label>
            <Input
              id="roleName"
              placeholder="Enter role name"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="roleStatus">Status</Label>
            <Select value={roleStatus} onValueChange={setRoleStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter role description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Permissions</Label>
            <div className="flex space-x-2">
              <Input
                placeholder="Add a permission"
                value={newPermission}
                onChange={(e) => setNewPermission(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addPermission()
                  }
                }}
              />
              <Button type="button" onClick={addPermission}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              {permissions.map((permission, index) => (
                <div
                  key={index}
                  className="flex items-center bg-secondary text-secondary-foreground px-3 py-1 rounded-md"
                >
                  <span>{permission}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0 ml-2"
                    onClick={() => removePermission(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              {permissions.length === 0 && <p className="text-sm text-muted-foreground">No permissions added yet</p>}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {isEditing ? "Update" : "Create Role"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ==================== ROLE VIEW MODAL ====================
export const RoleViewModal = ({ isOpen, onClose, role }) => {
  if (!role) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{role.name}</DialogTitle>
          <DialogDescription>Role details and associated users</DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 md:grid-cols-2 mt-4">
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Role Information</h3>
            <div>
              <h4 className="font-medium">Description</h4>
              <p>{role.description || "No description provided"}</p>
            </div>
            <div>
              <h4 className="font-medium">Created</h4>
              <p>{role.created || "Unknown"}</p>
            </div>
            <div>
              <h4 className="font-medium">Status</h4>
              <p className={role.status === "active" ? "text-green-500" : "text-gray-400"}>
                {role.status || "Unknown"}
              </p>
            </div>
            <div>
              <h4 className="font-medium">Permissions</h4>
              {role.permissions && role.permissions.length > 0 ? (
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  {role.permissions.map((permission, index) => (
                    <li key={index}>{permission}</li>
                  ))}
                </ul>
              ) : (
                <p>No permissions defined</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-lg">Associated Users</h3>
            {role.users && role.users.length > 0 ? (
              <div className="space-y-4 max-h-[300px] overflow-y-auto">
                {role.users.map((user) => (
                  <div key={user.id} className="flex items-center space-x-4 p-2 rounded-md hover:bg-gray-100">
                    <Avatar>
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user.name ? user.name.charAt(0) : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <p className="font-medium">{user.name || "Unknown User"}</p>
                      <p className="text-sm text-muted-foreground">{user.email || "No email"}</p>
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

// ==================== ROLE DELETE MODAL ====================
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