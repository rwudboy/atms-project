import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, DialogFooter } from "@/interface-adapters/components/ui/dialog"; // Adjust based on your imports
import { Button } from "@/interface-adapters/components/ui/button";
import { Input } from "@/interface-adapters/components/ui/input";
import { Label } from "@/interface-adapters/components/ui/label";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"; // Import the VisuallyHidden component

export function VendorModal({ open, onOpenChange, vendor, onSave }) {
  const [formData, setFormData] = useState({
    name: vendor?.name || "",
    address: vendor?.address || "",
    city: vendor?.city || "",
    country: vendor?.country || "",
    status: vendor?.status || "active",
  });

  useEffect(() => {
    setFormData({
      name: vendor?.name || "",
      address: vendor?.address || "",
      city: vendor?.city || "",
      country: vendor?.country || "",
      status: vendor?.status || "active",
    });
  }, [vendor]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData); // Handle saving vendor data
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        aria-labelledby="modal-title"  // Ensure the title is properly linked to the content for screen readers
        aria-describedby="modal-description"
        className="sm:max-w-[600px]"
      >
        {/* Dialog Title for screen readers */}
        <VisuallyHidden>
          <DialogTitle id="modal-title">
            {vendor ? "Edit Vendor" : "Add Vendor"}
          </DialogTitle>
        </VisuallyHidden>
        
        {/* Description for screen readers */}
        <div id="modal-description" className="mt-2">
          <p>{vendor ? `Edit details for ${vendor.name}` : "Add a new vendor"}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="space-y-4">
            {/* Name */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name">Vendor Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            {/* Address */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            {/* City */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            {/* Country */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            {/* Status */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="col-span-3 border rounded-md p-2 text-sm"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{vendor ? "Update" : "Create"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
