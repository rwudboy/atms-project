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
import { addVendor } from "@/interface-adapters/usecases/vendor/add-vendor";
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

  const categories = ["IT", "Construction", "Consultant", "Security", "Education"];

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
      onVendorAdded?.(newVendor);
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
            <div>
              <Input
                placeholder="Name"
                value={formData.name}
                onChange={handleInputChange("name")}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>
            <div>
              <Input
                placeholder="Address"
                value={formData.address}
                onChange={handleInputChange("address")}
              />
              {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
            </div>
            <div>
              <Input
                placeholder="City"
                value={formData.city}
                onChange={handleInputChange("city")}
              />
              {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
            </div>
            <div>
              <Input
                placeholder="Country"
                value={formData.country}
                onChange={handleInputChange("country")}
              />
              {errors.country && <p className="text-sm text-red-500">{errors.country}</p>}
            </div>
            <div>
              <select
                value={formData.category}
                onChange={handleInputChange("category")}
                className="w-full px-3 py-2 border rounded-md text-sm"
              >
                <option value="" disabled>
                  Select Category
                </option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
            </div>
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
