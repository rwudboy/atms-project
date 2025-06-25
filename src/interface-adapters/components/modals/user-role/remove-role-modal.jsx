"use client";

import { useEffect, useState } from "react";
import { getUserDetails } from "@/interface-adapters/usecases/user-role/user-detail";
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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/interface-adapters/components/ui/select";
import { Avatar, AvatarFallback } from "@/interface-adapters/components/ui/avatar";
import { Badge } from "@/interface-adapters/components/ui/badge";
import { Trash2, AlertTriangle, User } from "lucide-react";

export function DeleteUserRoleDialog({ username, children }) {
  const [open, setOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!open) return;
    (async () => {
      const response = await getUserDetails(username);
      if (response?.user) setUser(response.user);
    })();
  }, [open, username]);

  const handleDeleteRole = async () => {
    if (!selectedRole) return;

    setIsDeleting(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsDeleting(false);
    setOpen(false);
    setSelectedRole("");

    console.log(`Deleted role: ${selectedRole} from ${user.email}`);
  };

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
                  <User className="h-3 w-3" />
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">{user.fullName}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
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
                  You are about to remove the <strong>{selectedRole}</strong> role from {user.fullName}.
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
            disabled={!selectedRole || isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Role"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
