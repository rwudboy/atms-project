import { useState } from "react";
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from "@/interface-adapters/components/ui/drawer";
import { Input } from "@/interface-adapters/components/ui/input";
import { Button } from "@/interface-adapters/components/ui/button";
import { addWorkgroup } from "@/interface-adapters/usecases/workgroup/workgroup-usecase";
import { useIsMobile } from "@/interface-adapters/hooks/use-mobile"; 
import Swal from 'sweetalert2';

export default function AddWorkgroupDrawer({ onWorkgroupAdded, trigger }) {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    status: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const isMobile = useIsMobile();

  const handleAddWorkgroup = async () => {
    if (!formData.name || !formData.status) {
      Swal.fire({
        title: 'Error!',
        text: 'Please complete the form.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }

    console.log("Form Data before API call:", formData);

    setLoading(true);
    setError(null);

    try {
      const newWorkgroup = await addWorkgroup(formData);

      console.log("New Workgroup:", newWorkgroup);

      onWorkgroupAdded(newWorkgroup);
      setFormData({ name: "", status: "" });
      setOpenDrawer(false);

    } catch (err) {
      setError("Failed to add workgroup");

      Swal.fire({
        title: 'Error!',
        text: 'Something went wrong. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
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
            <DrawerTitle>Add New Workgroup</DrawerTitle>
            <DrawerDescription>Fill out the workgroup details below.</DrawerDescription>
          </DrawerHeader>
          <div className="grid gap-4 py-4">
            <Input
              placeholder="Workgroup Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              placeholder="Project Name"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
          <DrawerFooter>
            <Button onClick={handleAddWorkgroup} disabled={loading}>
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
