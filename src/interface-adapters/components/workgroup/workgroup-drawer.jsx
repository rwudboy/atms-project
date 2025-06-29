"use client";

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
import { addWorkgroup } from "@/interface-adapters/usecases/workgroup/add-workgroup";
import { useIsMobile } from "@/interface-adapters/hooks/use-mobile";
import { toast } from "sonner";

export default function AddWorkgroupDrawer({ onWorkgroupAdded, trigger }) {
  const categories = ["Retail", "Government", "Enterprise", "Military"];
  const [selectedCategory, setSelectedCategory] = useState("");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [formData, setFormData] = useState({ name: "", project_name: "" });
  const [loading, setLoading] = useState(false);
  const isMobile = useIsMobile();

const handleAddWorkgroup = async () => {
  if (!formData.name || !formData.project_name) {
    toast.warning("Please complete the form before submitting.");
    return;
  }

  setLoading(true);

  try {
    const status = await addWorkgroup(formData);
    console.log(status);
    
    if (status === 201) {
      onWorkgroupAdded();
      toast.success("✅ Workgroup successfully created.");
      setFormData({ name: "", project_name: "" });
      setOpenDrawer(false);
    }
  } catch (err) {
    toast.error("❌ Failed to add workgroup. Please try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    <Drawer
      open={openDrawer}
      onOpenChange={setOpenDrawer}
      direction={isMobile ? "bottom" : "right"}
    >
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>

      <DrawerContent>
        <div className="w-full max-w-2xl mx-auto px-6 py-4">
          <DrawerHeader>
            <DrawerTitle>Add New Workgroup</DrawerTitle>
            <DrawerDescription>
              Fill out the workgroup details below.
            </DrawerDescription>
          </DrawerHeader>

          <div className="grid gap-4">
            <Input
              placeholder="Workgroup Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <Input
              placeholder="Project Name"
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, project_name: e.target.value })
              }
            />
          </div>

          <DrawerFooter className="mt-4">
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
s