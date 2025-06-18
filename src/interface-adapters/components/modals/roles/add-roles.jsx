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
import { Plus } from "lucide-react"
import { toast } from "sonner"

export const RoleAddModal = ({ open, onSave, onClose }) => {
  const [roleName, setRoleName] = useState("")
  const [roleStatus, setRoleStatus] = useState("inactive")
  const [description, setDescription] = useState("")
  const [permissions, setPermissions] = useState([])
  const [newPermission, setNewPermission] = useState("")

  const resetForm = () => {
    setRoleName("")
    setRoleStatus("inactive")
    setDescription("")
    setPermissions([])
    setNewPermission("")
  }

  useEffect(() => {
    if (!open) {
      resetForm()
    }
  }, [open])

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

    onSave(roleData)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Role</DialogTitle>
          <DialogDescription>
            Create a new role in the system
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
            Create Role
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}