"use client";

import { useEffect, useState } from "react";
import { getUserDetails } from "@/interface-adapters/usecases/user-role/user-detail";
import { Button } from "@/interface-adapters/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/interface-adapters/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/interface-adapters/components/ui/select";
import { Badge } from "@/interface-adapters/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
} from "@/interface-adapters/components/ui/avatar";
import { AlertTriangle, Trash2, User } from "lucide-react";
import {
  Alert,
  AlertDescription,
} from "@/interface-adapters/components/ui/alert";

export default function DeleteUserRoleDialog({ username }) {
  const [open, setOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      if (!username) return;
      try {
        const response = await getUserDetails(username);
        if (response?.user) {
          setUser(response.user);
        }
      } catch (error) {
        console.error("Failed to fetch user details:", error);
      }
    }

    fetchUser();
  }, [username]);

  const handleDeleteRole = async () => {
    if (!selectedRole) return;

    setIsDeleting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulated delay
    setIsDeleting(false);
    setOpen(false);
    setSelectedRole("");

    console.log(`Deleted role: ${selectedRole} from user: ${user.email}`);
  };

  if (!user) return <div className="p-4 text-sm">Loading user data...</div>;

  return (
    <div className="p-8">
      <div className="max-w-md mx-auto">
        {/* User Info Card */}
        <div className="border rounded-lg p-4 mb-4">
          <div className="flex items-center gap-3 mb-3">
            <Avatar>
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{user.fullName}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Current Roles:</p>
            <div className="flex flex-wrap gap-2">
              {user.role.map((role) => (
                <Badge key={role} variant="default">
                  {role}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Delete Role Dialog */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="destructive" className="w-full">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Role
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Delete User Role
              </DialogTitle>
              <DialogDescription>
                Remove a role from {user.fullName}. This action cannot be undone.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">
                    <User className="h-3 w-3" />
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm">{user.fullName}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Select role to delete:</label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a role to remove" />
                  </SelectTrigger>
                  <SelectContent>
                    {user.role.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedRole && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    You are about to remove the <strong>{selectedRole}</strong> role from{" "}
                    {user.fullName}. They will lose all permissions associated with this role.
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setOpen(false)} disabled={isDeleting}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteRole}
                disabled={!selectedRole || isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete Role"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
