import { useState } from "react";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/interface-adapters/components/ui/drawer";
import { Input } from "@/interface-adapters/components/ui/input";
import { Button } from "@/interface-adapters/components/ui/button";
import { createRole } from "@/interface-adapters/usecases/roles/roles-usecase";
import { useIsMobile } from "@/interface-adapters/hooks/use-mobile";
import { toast } from "sonner";

export default function AddRoleDrawer({ onRoleAdded, trigger }) {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [roleName, setRoleName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const isMobile = useIsMobile();

  const handleAddRole = async () => {
    if (!roleName.trim()) {
      setError("Role name is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await createRole({ RoleName: roleName });
      await onRoleAdded();
      setRoleName("");
      setOpenDrawer(false);
      toast.success("Role added!");
    } catch (err) {
      toast.error("Failed to add role, please try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer open={openDrawer} onOpenChange={setOpenDrawer} direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent>
        <div className="p-4">
          <DrawerHeader>
            <DrawerTitle>Add New Role</DrawerTitle>
            <DrawerDescription>Specify the role name below.</DrawerDescription>
          </DrawerHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Input
                placeholder="Role Name"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
          </div>
          <DrawerFooter>
            <Button onClick={handleAddRole} disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
