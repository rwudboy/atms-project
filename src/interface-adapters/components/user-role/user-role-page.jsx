"use client";

import { useEffect, useState } from "react";
import { Button } from "@/interface-adapters/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/interface-adapters/components/ui/card";
import { Input } from "@/interface-adapters/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/interface-adapters/components/ui/table";
import { Badge } from "@/interface-adapters/components/ui/badge";
import { toast } from "sonner";
import { getUsers } from "@/application-business-layer/usecases/user/getUserList";
import UserDetailModal from "@/interface-adapters/components/modals/user-role/user-detail-modal";
import { DeleteUserRoleDialog } from "@/interface-adapters/components/modals/user-role/remove-role-modal";
import { Search, ShieldAlert } from "lucide-react";
import { useAuth } from "@/interface-adapters/context/AuthContext";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
    const { user } = useAuth();
    const isStaff = user?.role?.toLowerCase() === "staff";
  const [allUsers, setAllUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);



  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await getUsers();
      if (Array.isArray(response)) {
        setUsers(response);
        setAllUsers(response);
      } else {
        toast.error("Invalid response format.");
        setUsers([]);
        setAllUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users.");
      setUsers([]);
      setAllUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!searchTerm.trim()) {
      setUsers(allUsers);
      return;
    }

    const lower = searchTerm.toLowerCase();
    const filtered = allUsers.filter((user) =>
      user.username.toLowerCase().includes(lower) ||
      user.email.toLowerCase().includes(lower) ||
      (Array.isArray(user.Role)
        ? user.Role.join(", ").toLowerCase().includes(lower)
        : user.Role?.toLowerCase().includes(lower))
    );
    setUsers(filtered);
  }, [searchTerm, allUsers]);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

    const capitalizeText = (text) => {
    if (!text) return "-";
    if (text.toLowerCase() === "locked" || text.toLowerCase() === "unlocked") {
      return text.toUpperCase();
    }
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };



  const getBadgeVariant = (role) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "destructive";
      case "manager":
        return "secondary";
      case "user":
        return "outline";
      default:
        return "default";
    }
  };

  const getStatusBadgeVariant = (status) => {
    if (!status) return "default";
    return status.toLowerCase() === "unlocked" ? "success" : "default";
  };

  const formatStatus = (status) => {
    if (!status) return "ACTIVE";
    return status.toUpperCase();
  };
  // Show access denied for staff users with the same style as customer page
  if (isStaff) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader className="text-center">
            <ShieldAlert className="mx-auto h-12 w-12 text-destructive opacity-75 mb-2" />
            <CardTitle>Access Denied</CardTitle>
            <CardDescription className="pt-2">
              Staff members do not have permission to access the User Role page. 
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
          <CardTitle>User Role</CardTitle>
          <CardDescription>Manage role user</CardDescription>
        </CardHeader>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search Users</CardTitle>
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
            <CardTitle>User List</CardTitle>
            <CardDescription>
              Showing {users.length} of {allUsers.length} users
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Job Position</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    Loading users...
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.username}</TableCell>
                    <TableCell>{user.email || "-"}</TableCell>
                    <TableCell className="flex flex-wrap gap-1">
                      <Badge variant={getBadgeVariant(user.Role)}>
                        {capitalizeText(user.Role || "unlocked")}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.posisi || "-"}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(user.status)}>
                        {formatStatus(user.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(user)}
                      >
                        Edit
                      </Button>
                      <DeleteUserRoleDialog username={user.username} onSuccess={fetchUsers}>
                        <Button variant="destructive" size="sm">
                          Remove
                        </Button>
                      </DeleteUserRoleDialog>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedUser && (
        <UserDetailModal
          user={selectedUser}
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          onRoleUpdated={fetchUsers}
        />
      )}
    </div>
  );
}