"use client";

import { useEffect, useState } from "react";
import { Button } from "@/interface-adapters/components/ui/button";
import { Badge } from "@/interface-adapters/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/interface-adapters/components/ui/dialog";
import { Label } from "@/interface-adapters/components/ui/label";
import { Card } from "@/interface-adapters/components/ui/card";
import { Input } from "@/interface-adapters/components/ui/input";
import {
  Users,
  User,
  UserPlus,
  Crown,
  Shield,
  UserCheck,
} from "lucide-react";
import { getUsers } from "@/interface-adapters/usecases/user/getUserList";
import { AddUser } from "@/interface-adapters/usecases/workgroup/add-user-usecase";
import { toast } from "sonner";
import clsx from "clsx";

const getRoleIcon = (role) => {
  switch (role) {
    case "admin":
      return <Crown className="h-3 w-3" />;
    case "manager":
      return <Shield className="h-3 w-3" />;
    case "user":
      return <UserCheck className="h-3 w-3" />;
    default:
      return <User className="h-3 w-3" />;
  }
};

const getRoleColor = (role) => {
  switch (role) {
    case "admin":
      return "bg-red-100 text-red-800";
    case "manager":
      return "bg-blue-100 text-blue-800";
    case "user":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function AddUserModal({
  open,
  onOpenChange,
  workgroups,
  preSelectedWorkgroup,
  onUserAdded,
}) {
  const [selectedUser, setSelectedUser] = useState("");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedWorkgroup, setSelectedWorkgroup] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setSelectedUser("");
      setSearch("");
      setSelectedWorkgroup(preSelectedWorkgroup || "");
    }
  }, [open, preSelectedWorkgroup]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await getUsers();
        const userData = res.user || res || [];
        setUsers(Array.isArray(userData) ? userData : []);
      } catch {
        setUsers([]);
      }
    }
    if (open) fetchUsers();
  }, [open]);

  useEffect(() => {
    const filtered = users.filter((user) => {
      const query = search.toLowerCase();
      return (
        user.namaLengkap?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query)
      );
    });
    setFilteredUsers(filtered);
  }, [search, users]);

 const handleSubmit = async () => {
  if (!selectedUser || !selectedWorkgroup) {
    toast.error("Please fill in all required fields");
    return;
  }

  setIsSubmitting(true);
  try {
    const user = users.find((u) => u.id === selectedUser);
    const userData = { uuid: user.id };

    await AddUser(selectedWorkgroup, userData);

    // Show success toast with user's name
    toast.success(`User ${user.namaLengkap} added to workgroup`);
    
    // Call the callback after showing our toast
    onUserAdded(user, selectedWorkgroup);
    onOpenChange(false);
  } catch (error) {
    const errorMessage = error?.message || "Failed to add user to workgroup";
    toast.error(errorMessage);
  } finally {
    setIsSubmitting(false);
  }
};


  const handleClose = () => {
    setSelectedUser("");
    setSearch("");
    setSelectedWorkgroup("");
    onOpenChange(false);
  };

  const selectedWorkgroupData = workgroups.find(
    (wg) => wg.uuid === selectedWorkgroup
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <UserPlus className="h-5 w-5 text-primary" />
            <span>Add User to Workgroup</span>
          </DialogTitle>
          <DialogDescription>
            Select a user to add to the workgroup.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>
              Workgroup <span className="text-destructive">*</span>
            </Label>
            {selectedWorkgroupData ? (
              <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg border-2 border-dashed border-muted-foreground/20">
                <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{selectedWorkgroupData.name}</p>
                  <p className="text-xs text-muted-foreground">{selectedWorkgroupData.projectName}</p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">Pre-selected</div>
                  <div className="text-xs font-medium text-primary">✓ Active</div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No workgroup selected</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Search Users</Label>
            <Input
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <div className="grid gap-3 max-h-72 overflow-y-auto">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => {
                  const isLocked = user.status === "locked";
                  return (
                    <Card
                      key={user.id}
                      className={clsx(
                        "p-3 border transition-all duration-200",
                        isLocked
                          ? "opacity-60 cursor-not-allowed"
                          : "hover:cursor-pointer hover:border-primary hover:shadow-sm",
                        selectedUser === user.id && !isLocked
                          ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                          : ""
                      )}
                      onClick={() => {
                        if (!isLocked) {
                          setSelectedUser(user.id);
                        }
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{user.namaLengkap}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                          <p className="text-xs text-muted-foreground italic">{user.posisi}</p>
                          {isLocked && (
                            <Badge variant="destructive" className="mt-1 text-xs">
                              🔒 Locked
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-1 flex-wrap">
                          {Array.isArray(user.Role) &&
                            user.Role.map((role, index) => (
                              <Badge
                                key={`${user.id}-${role}-${index}`}
                                className={`text-[10px] px-2 py-0.5 flex items-center gap-1 ${getRoleColor(role)}`}
                              >
                                {getRoleIcon(role)}
                                <span className="capitalize">{role}</span>
                              </Badge>
                            ))}
                        </div>
                      </div>
                    </Card>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">No users matched your search.</p>
                </div>
              )}
            </div>
            {selectedUser && (
              <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>
                  Selected: {users.find((u) => u.id === selectedUser)?.namaLengkap}
                </span>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !selectedUser || !selectedWorkgroup}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Adding User...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <UserPlus className="h-4 w-4" />
                <span>Add User</span>
              </div>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
