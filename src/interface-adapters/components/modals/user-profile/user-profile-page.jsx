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
import { getRoles } from "@/application-business-layer/usecases/roles/roles-usecase";

export default function UserDetailModal({ user, open, onOpenChange }) {
  const [isLocked, setIsLocked] = useState(user?.status !== "active");
  const [selectedRole, setSelectedRole] = useState(user?.Role?.[0] || "");
  const [roleOptions, setRoleOptions] = useState([]);

  // Fetch roles on mount
  useEffect(() => {
    async function fetchRoles() {
      try {
        const response = await getRoles();
        const roles = response?.workgroup?.role || [];

        // Remove duplicates by role name
        const uniqueByName = Array.from(
          new Map(roles.map((role) => [role.name, role])).values()
        );

        setRoleOptions(uniqueByName);
      } catch (error) {
        console.error("Failed to load roles:", error);
      }
    }

    fetchRoles();
  }, []);

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
          {/* Left Column - User Information */}
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
              <Button
                onClick={() => setIsLocked(!isLocked)}
                className={`flex items-center gap-2 px-4 py-2 text-white
                  ${isLocked ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}`}
              >
                {isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                {isLocked ? "Locked" : "Unlocked"}
              </Button>
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

        <div className="flex justify-end gap-3 mt-8">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="bg-black text-white hover:bg-gray-800"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              console.log("Saving user details...", { selectedRole, isLocked });
              onOpenChange(false);
            }}
            className="bg-black text-white hover:bg-gray-800"
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
