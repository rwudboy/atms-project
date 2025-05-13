"use client"

import { useState, useEffect } from "react"
import { Button } from "@/interface-adapters/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/interface-adapters/components/ui/card"
import { Input } from "@/interface-adapters/components/ui/input"
import { Plus, Eye, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { RoleModal, RoleViewModal, RoleDeleteModal } from "@/interface-adapters/components/modals/roles/roles-modal"
import { getRoles, createRole, updateRole, deleteRole } from "@/interface-adapters/usecases/roles/roles-usecase"

export default function RolesPage() {
  const [roles, setRoles] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [roleToDelete, setRoleToDelete] = useState(null)
  const [roleToView, setRoleToView] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    fetchRoles()
  }, [])

  const fetchRoles = async () => {
    setIsLoading(true)
    try {
      const response = await getRoles()

      // Check if the response is in the expected format with workgroup and role array
      if (response.workgroup && response.workgroup.status) {
        if (response.workgroup.role && response.workgroup.role.length > 0) {
          setRoles(response.workgroup.role)
        } else {
          setRoles([])
          toast.info("No roles found.")
        }
      } else {
        toast.error("Invalid response format.")
        setRoles([])
      }
    } catch (error) {
      console.error("Error fetching roles:", error)
      toast.error("Failed to load roles.")
      setRoles([])
    } finally {
      setIsLoading(false)
    }
  }

  // Group roles by name and count users
  const groupedRoles = roles.reduce((acc, role) => {
    const existingRole = acc.find(r => r.name === role.name)
    if (existingRole) {
      existingRole.userCount += 1
      if (role.status === "active") {
        existingRole.status = "active"
      }
    } else {
      // Add some default descriptions based on role name
      let description = "System access"
      if (role.name.toLowerCase() === "administrator") {
        description = "Full system access with all permissions"
      } else if (role.name.toLowerCase() === "manager") {
        description = "Can manage users and some system settings"
      } else if (role.name.toLowerCase() === "user") {
        description = "Basic system access"
      } else if (role.name.toLowerCase() === "auditor") {
        description = "Read-only access for auditing purposes"
      } else if (role.name.toLowerCase() === "guest") {
        description = "Limited access for temporary users"
      }
      
      acc.push({
        name: role.name,
        status: role.status,
        userCount: 1,
        uuid: role.uuid, // Keep reference to one of the UUIDs
        description: description,
        created: new Date().toLocaleDateString() // Placeholder date, would come from API
      })
    }
    return acc
  }, [])

  const filteredRoles = groupedRoles.filter((role) =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreateClick = () => {
    setSelectedRole(null) // No role selected, preparing for creation
    setModalOpen(true)
  }

  const handleEditClick = (role) => {
    // Find all instances of this role name to display in the modal
    const roleInstances = roles.filter(r => r.name === role.name)
    setSelectedRole(roleInstances.length > 0 ? roleInstances[0] : role)
    setModalOpen(true)
  }

  const handleViewClick = (role) => {
    // Find all instances of this role name to display in the view modal
    const roleInstances = roles.filter(r => r.name === role.name)
    
    // Prepare users array for the view modal
    const usersArray = Array(role.userCount).fill().map((_, index) => ({
      id: `${index}`,
      name: `User ${index + 1}`,
      email: `user${index + 1}@example.com`
    }))
    
    // Combine role data with users
    const enrichedRole = {
      ...role,
      users: usersArray,
      permissions: role.permissions || ["read", "write"] // Example permissions if not available
    }
    
    setRoleToView(enrichedRole)
    setViewModalOpen(true)
  }

  const handleDeleteClick = (role) => {
    setRoleToDelete(role)
    setDeleteModalOpen(true)
  }

  const handleDeleteRole = async () => {
    if (!roleToDelete) return
    
    setIsDeleting(true)
    try {
      await deleteRole(roleToDelete.uuid)
      toast.success(`Role "${roleToDelete.name}" deleted successfully.`)
      setDeleteModalOpen(false)
      fetchRoles() // Refresh the list of roles
    } catch (error) {
      console.error("Error deleting role:", error)
      toast.error("Failed to delete role.")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleSaveRole = async (uuid, roleData) => {
    try {
      if (uuid) {
        // Update existing role
        await updateRole(uuid, roleData)
        toast.success("Role updated successfully.")
      } else {
        // Create new role
        await createRole(roleData)
        toast.success("Role created successfully.")
      }

      setModalOpen(false)
      fetchRoles() // Refresh the list of roles
    } catch (error) {
      toast.error("Failed to save role.")
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Roles Management</h2>
        <Button onClick={handleCreateClick}>
          <Plus className="w-4 h-4 mr-2" />
          Add Role
        </Button>
      </div>

      <Input
        placeholder="Search roles..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm"
      />

      {isLoading ? (
        <div className="text-center py-8">Loading roles...</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredRoles.length > 0 ? (
            filteredRoles.map((role) => (
              <Card key={role.name} className="border rounded-md overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl font-bold capitalize">{role.name}</CardTitle>
                  <p className="text-gray-500 text-sm mt-1">{role.description}</p>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="mb-4">
                    <p className="text-sm text-gray-700">Users: {role.userCount}</p>
                    <p className="text-sm text-gray-700">Created: {role.created}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 justify-center"
                      onClick={() => handleViewClick(role)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 justify-center text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDeleteClick(role)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      <span>Delete</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-3 text-center py-8 text-gray-500">
              No roles found matching your search.
            </div>
          )}
        </div>
      )}

      {/* Role Modals */}
      <RoleModal
        open={modalOpen}
        role={selectedRole}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveRole}
      />

      <RoleViewModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        role={roleToView}
      />

      <RoleDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onDelete={handleDeleteRole}
        role={roleToDelete}
        isDeleting={isDeleting}
      />
    </div>
  )
}