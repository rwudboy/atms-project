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
import { addCustomer } from "@/interface-adapters/usecases/customer/customer-usecase";
import { useIsMobile } from "@/interface-adapters/hooks/use-mobile";
import { toast } from "sonner";

export default function AddCustomerDrawer({ onCustomerAdded, trigger }) {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    country: "",
    category: "", // added category field
  });
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const isMobile = useIsMobile();

  const handleAddCustomer = async () => {
    const { name, address, city, country, category } = formData;

    const errors = {};
    if (!name) errors.name = "Name is required";
    if (!address) errors.address = "Address is required";
    if (!city) errors.city = "City is required";
    if (!country) errors.country = "Country is required";
    if (!category) errors.category = "Category is required"; // validate category

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    setFieldErrors({});

    try {
      await addCustomer(formData); 
      await onCustomerAdded(); 
      setFormData({ name: "", address: "", city: "", country: "", category: "" }); // reset
      setOpenDrawer(false);
      toast.success("Customer added!");
    } catch (err) {
      toast.error("Failed to add customer, please try again!");
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
            <DrawerTitle>Add New Customer</DrawerTitle>
            <DrawerDescription>Fill out the customer details below.</DrawerDescription>
          </DrawerHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Input
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              {fieldErrors.name && <p className="text-sm text-red-500">{fieldErrors.name}</p>}
            </div>
            <div>
              <Input
                placeholder="Address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
              {fieldErrors.address && <p className="text-sm text-red-500">{fieldErrors.address}</p>}
            </div>
            <div>
              <Input
                placeholder="City"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
              {fieldErrors.city && <p className="text-sm text-red-500">{fieldErrors.city}</p>}
            </div>
            <div>
              <Input
                placeholder="Country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              />
              {fieldErrors.country && <p className="text-sm text-red-500">{fieldErrors.country}</p>}
            </div>
            <div>
              <Input
                placeholder="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
              {fieldErrors.category && <p className="text-sm text-red-500">{fieldErrors.category}</p>}
            </div>
          </div>
          <DrawerFooter>
            <Button onClick={handleAddCustomer} disabled={loading}>
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
