"use client"

import { useEffect, useState } from "react"
import { Button } from "@/interface-adapters/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/interface-adapters/components/ui/card"
import { Input } from "@/interface-adapters/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/interface-adapters/components/ui/table"
import { Search } from "lucide-react"
import { toast } from "sonner"
import {
  RoleModal,
  RoleViewModal,
  RoleDeleteModal,
} from "@/interface-adapters/components/modals/roles/roles-modal"
import {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
} from "@/interface-adapters/usecases/roles/roles-usecase"

export default function RolesPage() {
  const [roles, setRoles] = useState([])
  const [allRoles, setAllRoles] = useState([])
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

      if (response.workgroup?.status) {
        const grouped = groupRoles(response.workgroup.role || [])
        setRoles(grouped)
        setAllRoles(grouped)
      } else {
        toast.error("Invalid response format.")
        setRoles([])
        setAllRoles([])
      }
    } catch (error) {
      console.error("Error fetching roles:", error)
      toast.error("Failed to load roles.")
      setRoles([])
      setAllRoles([])
    } finally {
      setIsLoading(false)
    }
  }

  const groupRoles = (rawRoles) => {
    return rawRoles.reduce((acc, role) => {
      const existing = acc.find((r) => r.name === role.name)
      if (existing) {
        existing.userCount += 1
        if (role.status === "active") {
          existing.status = "active"
        }
      } else {
        acc.push({
          name: role.name,
          uuid: role.uuid,
          status: role.status,
          userCount: 1,
          created: new Date().toLocaleDateString(),
          description: getDescription(role.name),
        })
      }
      return acc
    }, [])
  }

  const getDescription = (name) => {
    const lower = name.toLowerCase()
    if (lower === "administrator") return "Full system access"
    if (lower === "manager") return "Manage users and settings"
    if (lower === "auditor") return "Read-only auditing access"
    if (lower === "guest") return "Limited guest access"
    return "System access"
  }

  useEffect(() => {
    if (!searchTerm.trim()) {
      setRoles(allRoles)
      return
    }

    const lower = searchTerm.toLowerCase()
    const filtered = allRoles.filter((role) =>
      role.name.toLowerCase().includes(lower)
    )
    setRoles(filtered)
  }, [searchTerm, allRoles])

  const handleCreateClick = () => {
    setSelectedRole(null)
    setModalOpen(true)
  }

  const handleEditClick = (role) => {
    setSelectedRole(role)
    setModalOpen(true)
  }

  const handleViewClick = (role) => {
    const users = Array(role.userCount).fill().map((_, i) => ({
      id: i,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
    }))
    setRoleToView({ ...role, users, permissions: ["read", "write"] })
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
      toast.success(`Role "${roleToDelete.name}" deleted.`)
      fetchRoles()
    } catch {
      toast.error("Failed to delete role.")
    } finally {
      setDeleteModalOpen(false)
      setIsDeleting(false)
    }
  }

  const handleSaveRole = async (uuid, roleData) => {
    try {
      if (uuid) {
        await updateRole(uuid, roleData)
        toast.success("Role updated.")
      } else {
        await createRole(roleData)
        toast.success("Role created.")
      }
      setModalOpen(false)
      fetchRoles()
    } catch {
      toast.error("Failed to save role.")
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Roles Management</CardTitle>
          <CardDescription>Manage system roles and their permissions</CardDescription>
        </CardHeader>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search Roles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by role name..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Roles List</CardTitle>
            <CardDescription>Showing {roles.length} of {allRoles.length} roles</CardDescription>
          </div>
          <Button onClick={handleCreateClick}>Add Role</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Users</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    Loading roles...
                  </TableCell>
                </TableRow>
              ) : roles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No roles found.
                  </TableCell>
                </TableRow>
              ) : (
                roles.map((role) => (
                  <TableRow key={role.uuid}>
                    <TableCell className="font-medium">{role.name}</TableCell>
                    <TableCell>{role.description}</TableCell>
                    <TableCell>{role.userCount}</TableCell>
                    <TableCell>{role.created}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleViewClick(role)}>View</Button>
                      <Button variant="outline" size="sm" onClick={() => handleEditClick(role)}>Edit</Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(role)}>Delete</Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

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
