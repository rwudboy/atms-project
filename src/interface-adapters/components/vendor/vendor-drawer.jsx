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
import { addVendor } from "@/interface-adapters/usecases/vendor/vendor-usecase";
import { toast } from "sonner";
import { useIsMobile } from "@/interface-adapters/hooks/use-mobile";

export default function AddVendorDrawer({ trigger, onVendorAdded }) {
  const isMobile = useIsMobile();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    country: "",
    category: "",
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const validate = () => {
    const errs = {};
    if (!formData.name) errs.name = "Name is required";
    if (!formData.address) errs.address = "Address is required";
    if (!formData.city) errs.city = "City is required";
    if (!formData.country) errs.country = "Country is required";
    if (!formData.category) errs.category = "Category is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAddVendor = async () => {
  if (!validate()) return;

  try {
    setLoading(true);
    const newVendor = await addVendor(formData);
    toast.success("Vendor added successfully");
    setFormData({ name: "", address: "", city: "", country: "", category: "" });
    setOpenDrawer(false);
    onVendorAdded?.(newVendor); // ✅ send vendor back to parent
  } catch (error) {
    toast.error(error.message || "Failed to add vendor");
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
            <DrawerTitle>Add New Vendor</DrawerTitle>
            <DrawerDescription>Fill in the vendor details below.</DrawerDescription>
          </DrawerHeader>
          <div className="grid gap-4 py-4">
            {["name", "address", "city", "country", "category"].map((field) => (
              <div key={field}>
                <Input
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={formData[field]}
                  onChange={handleInputChange(field)}
                />
                {errors[field] && <p className="text-sm text-red-500">{errors[field]}</p>}
              </div>
            ))}
          </div>
          <DrawerFooter>
            <Button onClick={handleAddVendor} disabled={loading}>
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
