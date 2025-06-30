"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/interface-adapters/components/ui/dialog";
import { Input } from "@/interface-adapters/components/ui/input";
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
import { User, Shield, CheckCircle, XCircle, Loader2 } from "lucide-react";

export const EditWorkgroupModal = ({ isOpen, onClose, workgroup, onSave }) => {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("active");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (workgroup) {
      setName(workgroup.name || "");
      setStatus(workgroup.status || "active");
    } else {
      setName("");
      setStatus("active");
    }
  }, [workgroup]);

  const handleSave = async () => {
    if (!name.trim() || isLoading) return;
    
    setIsLoading(true);
    
    try {
      await onSave({
        id: workgroup?.uuid, 
        body: {
          name: name.trim(),
          status,
        },
      });
      
      // Reset form and close modal on success
      handleClose();
    } catch (error) {
      console.error("Error saving workgroup:", error);
      // Modal stays open on error so user can retry
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (isLoading) return; // Prevent closing while loading
    
    setName("");
    setStatus("active");
    setIsLoading(false);
    onClose();
  };

  // Reset loading state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsLoading(false);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={!isLoading ? handleClose : undefined}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold">
                {workgroup ? "Edit Workgroup" : "Create Workgroup"}
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                {workgroup ? "Update workgroup information" : "Add a new workgroup to your system"}
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="workgroup-name" className="text-sm font-medium flex items-center gap-2">
              <User className="h-4 w-4" />
              Workgroup Name
            </Label>
            <Input
              id="workgroup-name"
              placeholder="Enter workgroup name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-10 w-full"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Status
            </Label>
            <Select 
              value={status} 
              onValueChange={(value) => setStatus(value)}
              disabled={isLoading}
            >
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
                  <p className="font-medium">{name || "Workgroup Name"}</p>
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
            <Button 
              variant="outline" 
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={!name.trim() || isLoading} 
              className="min-w-[120px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {workgroup ? "Updating..." : "Creating..."}
                </>
              ) : (
                workgroup ? "Update" : "Create"
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};