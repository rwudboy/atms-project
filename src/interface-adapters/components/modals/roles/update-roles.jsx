"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/interface-adapters/components/ui/dialog";
import { Button } from "@/interface-adapters/components/ui/button";
import { Label } from "@/interface-adapters/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/interface-adapters/components/ui/select";
import { Badge } from "@/interface-adapters/components/ui/badge";
import { Shield, CheckCircle, XCircle } from "lucide-react";

export const EditRoleModal = ({ isOpen, onClose, role, onSave }) => {
  const [status, setStatus] = useState("active");

  useEffect(() => {
    setStatus(role?.status || "active");
  }, [role]);

  const handleSave = () => {
    onSave({
      id: role?.uuid, 
      body: {
        status,
      },
    });

    onClose();
  };

  const handleClose = () => {
    setStatus("active");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold">
                {role ? "Edit Role" : "Create Role"}
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                {role ? "Update role information" : "Add a new role to your system"}
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Status
            </Label>
            <Select value={status} onValueChange={(value) => setStatus(value)}>
              <SelectTrigger className="h-10 w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Active</span>
                    <Badge variant="secondary" className="ml-auto bg-green-100 text-green-700">
                      Active
                    </Badge>
                  </div>
                </SelectItem>
                <SelectItem value="inactive">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-gray-500" />
                    <span>Inactive</span>
                    <Badge variant="secondary" className="ml-auto bg-gray-100 text-gray-700">
                      Inactive
                    </Badge>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-lg border bg-muted/50 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <Shield className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Preview</p>
                </div>
              </div>
              <Badge
                variant={status === "active" ? "default" : "secondary"}
                className={status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}
              >
                {status === "active" ? (
                  <CheckCircle className="mr-1 h-3 w-3" />
                ) : (
                  <XCircle className="mr-1 h-3 w-3" />
                )}
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Badge>
            </div>
          </div>
        </div>

        <DialogFooter>
          <div className="flex w-full justify-end gap-2">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="min-w-[80px]">
              {role ? "Update" : "Create"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};