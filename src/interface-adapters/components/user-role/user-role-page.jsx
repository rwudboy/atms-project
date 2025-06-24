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
import { Badge } from "@/interface-adapters/components/ui/badge"
import { Search } from "lucide-react"
import { toast } from "sonner"
import { getUsers } from "@/interface-adapters/usecases/user/getUserList"

export default function UserRolePage() {
  const [users, setUsers] = useState([])
  const [allUsers, setAllUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const response = await getUsers()

      if (Array.isArray(response)) {
        setUsers(response)
        setAllUsers(response)
      } else {
        toast.error("Invalid response format.")
        setUsers([])
        setAllUsers([])
      }
    } catch (error) {
      console.error("Error fetching users:", error)
      toast.error("Failed to load user roles.")
      setUsers([])
      setAllUsers([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!searchTerm.trim()) {
      setUsers(allUsers)
      return
    }

    const lower = searchTerm.toLowerCase()
    const filtered = allUsers.filter((user) =>
      user.username.toLowerCase().includes(lower) ||
      user.email.toLowerCase().includes(lower) ||
      (Array.isArray(user.Role)
        ? user.Role.join(", ").toLowerCase().includes(lower)
        : user.Role?.toLowerCase().includes(lower))
    )
    setUsers(filtered)
  }, [searchTerm, allUsers])

  const handleEdit = (user) => {
    // TODO: Show edit modal or navigate to edit user role page
  }

  const handleRemove = (user) => {
    // TODO: Show confirmation and call delete role API
  }

  const getBadgeVariant = (role) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "destructive"
      case "manager":
        return "secondary"
      case "user":
        return "outline"
      default:
        return "default"
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>User Role Management</CardTitle>
          <CardDescription>Manage system users and their roles</CardDescription>
        </CardHeader>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search User Roles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by name, email or role..."
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
            <CardTitle>User Role List</CardTitle>
            <CardDescription>Showing {users.length} of {allUsers.length} user roles</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Jabatan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    Loading user roles...
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    No user roles found.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.username}</TableCell>
                    <TableCell>{user.email || "-"}</TableCell>
                    <TableCell className="flex flex-wrap gap-1">
                      {Array.isArray(user.Role) && user.Role.length > 0 ? (
                        user.Role.map((role, idx) => (
                          <Badge key={idx} variant={getBadgeVariant(role)}>
                            {role}
                          </Badge>
                        ))
                      ) : (
                        <Badge variant="default">-</Badge>
                      )}
                    </TableCell>
                    <TableCell>{user.posisi || "-"}</TableCell>
                    <TableCell>{user.status || "active"}</TableCell>
                    <TableCell className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(user)}
                      >
                        Add Role
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemove(user)}
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
