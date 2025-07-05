"use client";

import { useEffect, useState } from "react";
import { getUserDetails } from "@/application-business-layer/usecases/user-role/user-detail";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/interface-adapters/components/ui/dialog";
import { Button } from "@/interface-adapters/components/ui/button";
import { Alert, AlertDescription } from "@/interface-adapters/components/ui/alert";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/interface-adapters/components/ui/select";
import { Avatar, AvatarFallback } from "@/interface-adapters/components/ui/avatar";
import { AlertTriangle, User } from "lucide-react";
import { RemoveRole } from "@/application-business-layer/usecases/user-role/remove-role";
import { toast } from "sonner";

export function DeleteUserRoleDialog({ username, children, onSuccess }) {
  const [open, setOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    try {
      const response = await getUserDetails(username);
      if (response?.user) {
        setUser(response.user);
      }
    } catch (err) {
      toast.error("Failed to fetch user details.");
      console.error(err);
    }
  };

  useEffect(() => {
    if (open) fetchUser();
  }, [open, username]);

  const handleDeleteRole = async () => {
    if (!selectedRole || !user?.id) return;
    setIsDeleting(true);

    try {
      const result = await RemoveRole(selectedRole, user.id);
      if (result?.user) {
        toast.success(`Removed role "${selectedRole}" from ${result.user.user}`);
        await fetchUser();
        setSelectedRole("");
        setOpen(false);
        if (onSuccess) onSuccess(); // ✅ call parent fetch
      } else {
        throw new Error("No user info returned");
      }
    } catch (error) {
      toast.error("Failed to remove role");
      console.error("Failed to delete role:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const deletableRoles = Array.isArray(user?.role)
    ? user.role.filter((role) => role.toLowerCase() !== "rolename")
    : [];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Delete User Role
          </DialogTitle>
          <DialogDescription>
            Remove a role from {user?.fullName || username}. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        {user ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">{user.fullName}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Select role to delete:</label>
              {deletableRoles.length > 0 ? (
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a role to remove" />
                  </SelectTrigger>
                  <SelectContent>
                    {deletableRoles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    No roles available for deletion. The "RoleName" role cannot be removed.
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {selectedRole && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  You are about to remove the <strong>{selectedRole}</strong> role from{" "}
                  {user.fullName}.
                </AlertDescription>
              </Alert>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Loading user data...</p>
        )}

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteRole}
            disabled={!selectedRole || isDeleting || deletableRoles.length === 0}
          >
            {isDeleting ? "Deleting..." : "Delete Role"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
