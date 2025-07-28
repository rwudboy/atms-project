"use client";

import { useEffect, useState } from "react";
import { Button } from "@/interface-adapters/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/interface-adapters/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/interface-adapters/components/ui/select";
import { Lock, Unlock } from "lucide-react";
import { getRoles } from "@/framework-drivers/api/roles/roles-usecase";
import { AddRoleUser } from "@/framework-drivers/api/user-role/add-role-user";
import { toast } from "sonner";

export default function UserDetailModal({
  user,
  open,
  onOpenChange,
  onRoleUpdated, // ✅ new prop for refreshing parent
}) {
  const [selectedRole, setSelectedRole] = useState(user?.Role?.[0] || "");
  const [roleOptions, setRoleOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setSelectedRole(user.Role?.[0] || "");
    }
  }, [user, open]);

  useEffect(() => {
    async function fetchRoles() {
      try {
        const response = await getRoles();
        const roles = response?.workgroup?.role || [];

        const uniqueByName = Array.from(
          new Map(roles.map((role) => [role.name, role])).values()
        );

        setRoleOptions(uniqueByName);
      } catch (error) {
        console.error("Failed to load roles:", error);
        toast.error("Failed to load roles");
      }
    }

    fetchRoles();
  }, []);

  const isUnlocked = user?.status === "unlocked";
  const isLocked = user?.status === "locked";

  const handleSave = async () => {
    if (!user?.id) {
      toast.error("No user selected");
      return;
    }

    if (!selectedRole) {
      toast.error("Please select a role");
      return;
    }

    setIsLoading(true);
    try {
      const result = await AddRoleUser(selectedRole, user.id);

      if (result && result.success) {
        toast.success(
          `✅ Assigned role "${result.data.name_Role}" to user "${result.data.user}"`
        );

        // ✅ Notify parent to refresh
        if (typeof onRoleUpdated === "function") {
          onRoleUpdated();
        }

        onOpenChange(false);
      } else {
        throw new Error(result?.message || "Failed to assign role");
      }
    } catch (error) {
      console.error("Error assigning role:", error);
      toast.error(error.message || "Failed to assign role");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-6">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-2xl font-semibold text-left">
            User Details
          </DialogTitle>
          <p className="text-gray-500 text-left">User details and status</p>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-8">
          {/* Left Column - User Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="font-medium min-w-[100px]">Name</span>
              <span>:</span>
              <span>{user?.namaLengkap || "-"}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-medium min-w-[100px]">Username</span>
              <span>:</span>
              <span>{user?.username || "-"}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-medium min-w-[100px]">Job Position</span>
              <span>:</span>
              <span>{user?.posisi || "-"}</span>
            </div>
          </div>

          {/* Right Column - Status and Role */}
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3">Status</h3>
              <div
                className={`flex items-center gap-2 px-4 py-2 text-white rounded-md w-fit
                ${isUnlocked ? "bg-green-600" : isLocked ? "bg-red-600" : "bg-gray-500"}`}
              >
                {isUnlocked && <Unlock className="w-4 h-4" />}
                {isLocked && <Lock className="w-4 h-4" />}
                {user?.status || "-"}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Role</h3>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map((role) => (
                    <SelectItem key={role.uuid} value={role.name}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 mt-8">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="bg-black text-white hover:bg-gray-800"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-black text-white hover:bg-gray-800"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
