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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/interface-adapters/components/ui/dialog";
import { Search, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getUsers } from "@/application-business-layer/usecases/user/getUserList";
import { DeleteUser } from "@/application-business-layer/usecases/user/deleteUser";
import { useRouter } from "next/navigation";
import { useAuth } from "@/interface-adapters/context/AuthContext";

export default function UsersPage() {
  const router = useRouter();
  const { user: currentUser, loading: authLoading } = useAuth();

  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoadingUsersList, setIsLoadingUsersList] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    user: null,
    isDeleting: false,
  });

  useEffect(() => {
    if (!authLoading) {
      if (currentUser?.role?.toLowerCase() === "staff") {
        router.push(`/userProfile/${currentUser.username}`);
        return;
      }
      fetchUsers();
    }
  }, [authLoading, currentUser, router]);

  const fetchUsers = async () => {
    setIsLoadingUsersList(true);
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
      setIsLoadingUsersList(false);
    }
  };

  useEffect(() => {
    if (!searchTerm.trim()) {
      setUsers(allUsers);
      return;
    }

    const lower = searchTerm.toLowerCase();
    const filtered = allUsers.filter(
      (user) =>
        user.username.toLowerCase().includes(lower) ||
        user.email.toLowerCase().includes(lower) ||
        user.role?.toLowerCase().includes(lower) 
    );
    setUsers(filtered);
  }, [searchTerm, allUsers]);

  const handleEdit = (user) => {
    if (user.username) {
      router.push(`/userProfile/${user.username}`);
    }
  };

  const handleRemove = (user) => {
    setDeleteDialog({
      open: true,
      user: user,
      isDeleting: false,
    });
  };

  const handleDelete = async (userId) => {
    setDeleteDialog((prev) => ({ ...prev, isDeleting: true }));

    try {
      await DeleteUser(userId);

      const updatedUsers = allUsers.filter((user) => user.id !== userId);
      setAllUsers(updatedUsers);
      setUsers(
        updatedUsers.filter(
          (user) =>
            !searchTerm.trim() ||
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.role?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );

      toast.success("User deleted successfully");

      setDeleteDialog({
        open: false,
        user: null,
        isDeleting: false,
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
      setDeleteDialog((prev) => ({ ...prev, isDeleting: false }));
    }
  };

  const handleCloseDeleteDialog = () => {
    if (!deleteDialog.isDeleting) {
      setDeleteDialog({
        open: false,
        user: null,
        isDeleting: false,
      });
    }
  };

  const getBadgeVariant = (role) => {
    if (!role) return "default";
    switch (role.toLowerCase()) {
      case "admin":
        return "destructive";
      case "manager":
        return "secondary";
      case "staff": // Changed from 'user' to 'staff' based on context in useAuth logic
        return "outline";
      default:
        return "default";
    }
  };

  const getStatusBadgeVariant = (s) => {
    if (!s) return "default";
    switch (s.toLowerCase()) {
      case "active":
      case "unlocked":
        return "success";
      case "inactive":
      case "locked":
        return "default";
      default:
        return "outline";
    }
  };

  const capitalizeText = (text) => {
    if (!text) return "-";
    if (text.toLowerCase() === "locked" || text.toLowerCase() === "unlocked") {
      return text.toUpperCase();
    }
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  const FullPageSkeleton = () => (
    <div className="container mx-auto py-10">
      <Card className="mb-6">
        <CardHeader>
          <div className="h-7 bg-gray-200 rounded animate-pulse mb-2 w-48"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-80"></div>
        </CardHeader>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded animate-pulse mb-4 w-32"></div>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="h-6 bg-gray-200 rounded animate-pulse mb-2 w-24"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-40"></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-6 gap-4 pb-4 border-b">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>

            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="grid grid-cols-6 gap-4 py-4 border-b border-gray-100"
              >
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded animate-pulse w-16"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded animate-pulse w-20"></div>
                <div className="flex gap-2">
                  <div className="h-8 w-12 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (authLoading) {
    return <FullPageSkeleton />;
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>Manage system users and their profiles</CardDescription>
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
              {isLoadingUsersList ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex items-center justify-center space-x-2">
                      <Loader2 className="h-6 w-6 animate-spin" />
                      <span>Loading users...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.username}</TableCell>
                    <TableCell>{user.email || "-"}</TableCell>
                    <TableCell>
                      <Badge variant={getBadgeVariant(user.role)}>
                        {capitalizeText(user.role)}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.posisi || "-"}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(user.status)}>
                        {capitalizeText(user.status || "unlocked")}
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

      <Dialog open={deleteDialog.open} onOpenChange={handleCloseDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete user "{deleteDialog.user?.username}"? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCloseDeleteDialog}
              disabled={deleteDialog.isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDelete(deleteDialog.user?.id)}
              disabled={deleteDialog.isDeleting}
            >
              {deleteDialog.isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}