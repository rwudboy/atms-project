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
import { toast } from "sonner"

import { RoleViewModal } from "@/interface-adapters/components/modals/roles/view-roles"
import { EditRoleModal } from "@/interface-adapters/components/modals/roles/update-roles"
import { DeleteRoleModal } from "@/interface-adapters/components/modals/roles/delete-roles"
import { updateRole } from "@/framework-drivers/api/roles/update-roles"

import { getRoles } from "@/framework-drivers/api/roles/roles-usecase"
import { viewRoles } from "@/framework-drivers/api/roles/view-roles"
import { deleteRole } from "@/framework-drivers/api/roles/delete-roles"
import { Search, Eye, ShieldAlert } from "lucide-react";
import { useAuth } from "@/interface-adapters/context/AuthContext";

export default function RolesPage() {
    // --- AUTH MANAGEMENT ---
  const { user } = useAuth();
  const isStaff = user?.role?.toLowerCase() === "staff";

  const [roles, setRoles] = useState([])
  const [allRoles, setAllRoles] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [roleToView, setRoleToView] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState(null)
  const [roleToDelete, setRoleToDelete] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    fetchRoles()
  }, [])

  const fetchRoles = async () => {
    setIsLoading(true)
    try {
      const response = await getRoles()

      const rolesData = response?.workgroup?.role || []

      if (Array.isArray(rolesData)) {
        const grouped = groupRoles(rolesData)
        setRoles(grouped)
        setAllRoles(grouped)
      } else {
        toast.error("Invalid roles format.")
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
        existing.member += role.member
        if (role.status === "active") {
          existing.status = "active"
        }
      } else {
        acc.push({
          name: role.name,
          uuid: role.uuid,
          status: role.status,
          member: role.member,
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

  const handleViewClick = async (role) => {
    try {
      const response = await viewRoles(role.name)
      const userData = response?.workgroup?.user

      if (!userData || typeof userData !== "object") {
        toast.error("Invalid role data.")
        return
      }

      setRoleToView({
        ...role,
        user: {
          name: userData.name || "Unknown",
          status: userData.status || "Unknown",
          userName: userData.userName || [],
          email: userData.email || [],
        },
      })

      setViewModalOpen(true)
    } catch (error) {
      console.error("Error viewing role:", error)
      toast.error("Failed to load role details.")
    }
  }
  const handleDelete = async () => {
    if (!roleToDelete) return
    setIsDeleting(true)
    try {
      await deleteRole(roleToDelete.uuid)
      toast.success(`Role '${roleToDelete.name}' deleted successfully`)
      setDeleteModalOpen(false)
      setRoleToDelete(null)
      fetchRoles()
    } catch (error) {
      toast.error(error.message || "Failed to delete role.")
    } finally {
      setIsDeleting(false)
    }
  }

    // Show access denied for staff users with the same style as customer page
  if (isStaff) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader className="text-center">
            <ShieldAlert className="mx-auto h-12 w-12 text-destructive opacity-75 mb-2" />
            <CardTitle>Access Denied</CardTitle>
            <CardDescription className="pt-2">
              Staff members do not have permission to access the Roles page. 
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }



  return (
    <div className="container mx-auto py-10">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Roles Management</CardTitle>
          <CardDescription>Manage system roles and their permissions</CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Roles List</CardTitle>
            <CardDescription>Showing {roles.length} of {allRoles.length} roles</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Member</TableHead>
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
                    <TableCell className="font-medium">{role.member}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleViewClick(role)}>View</Button>
                      <Button variant="outline" size="sm" onClick={() => {
                        setSelectedRole(role)
                        setModalOpen(true)
                      }}>Edit</Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* MODALS */}
      <EditRoleModal
  isOpen={modalOpen}
  onClose={() => setModalOpen(false)}
  role={selectedRole}
  onSave={async ({ id, body }) => {
    try {
      await updateRole(id, body); 
      toast.success(`Updated role to "${body.RoleName}"`);
      fetchRoles();
    } catch (error) {
      toast.error(error.message || "Failed to update role.");
    }
  }}
/>


      <DeleteRoleModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        role={roleToDelete}
        onDelete={handleDelete}
        isDeleting={isDeleting}
      />

      <RoleViewModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        role={roleToView}
      />
    </div>
  )
}
