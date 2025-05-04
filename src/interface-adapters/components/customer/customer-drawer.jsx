import { useState } from "react";
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from "@/interface-adapters/components/ui/drawer";
import { Input } from "@/interface-adapters/components/ui/input";
import { Button } from "@/interface-adapters/components/ui/button";
import { addCustomer } from "@/interface-adapters/usecases/customer/customer-usecase";
import { useIsMobile } from "@/interface-adapters/hooks/use-mobile"; 
import Swal from 'sweetalert2'; 

export default function AddCustomerDrawer({ onCustomerAdded, trigger }) {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    country: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const isMobile = useIsMobile();

  const handleAddCustomer = async () => {
    setLoading(true);
    setError(null);

    try {
      const newCustomer = await addCustomer(formData);
      onCustomerAdded(newCustomer);
      setFormData({ name: "", address: "", city: "", country: "" });
      setOpenDrawer(false);

      Swal.fire({
        title: 'Success!',
        text: 'Customer added successfully.',
        icon: 'success',
        confirmButtonText: 'OK',
      });

    } catch (err) {
      setError("Failed to add customer");

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
            <DrawerTitle>Add New Customer</DrawerTitle>
            <DrawerDescription>Fill out the customer details below.</DrawerDescription>
          </DrawerHeader>
          <div className="grid gap-4 py-4">
            <Input
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              placeholder="Address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
            <Input
              placeholder="City"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />
            <Input
              placeholder="Country"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
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
