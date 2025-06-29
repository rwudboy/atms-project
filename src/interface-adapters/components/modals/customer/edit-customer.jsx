"use client"

import { useState, useEffect } from "react"
import { Button } from "@/interface-adapters/components/ui/button"
import { Input } from "@/interface-adapters/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/interface-adapters/components/ui/dialog"

export default function EditCustomerModal({ isOpen, onClose, onUpdate, customer }) {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    status: "",
    city: "",
    country: "",
    category: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || "",
        address: customer.address || "",
        status: customer.status || "",
        city: customer.city || "",
        country: customer.country || "",
        category: customer.category || "",
      })
    }
  }, [customer])

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleUpdate = async () => {
    setIsLoading(true)
    try {
      console.log("Updating with data:", formData)
      await onUpdate(customer.id, formData)
      onClose()
    } catch (error) {
      console.error("Error updating customer:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({
      name: "",
      address: "",
      status: "",
      city: "",
      country: "",
      category: "",
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Customer</DialogTitle>
          <DialogDescription>Update the customer information below.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="edit-name" className="text-right text-sm font-medium">
              Name
            </label>
            <Input
              id="edit-name"
              value={formData.name}
              onChange={(e) => handleFormChange("name", e.target.value)}
              className="col-span-3"
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="edit-address" className="text-right text-sm font-medium">
              Address
            </label>
            <Input
              id="edit-address"
              value={formData.address}
              onChange={(e) => handleFormChange("address", e.target.value)}
              className="col-span-3"
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="edit-status" className="text-right text-sm font-medium">
              Status
            </label>
            <select
              id="edit-status"
              value={formData.status}
              onChange={(e) => handleFormChange("status", e.target.value)}
              disabled={isLoading}
              className="col-span-3 h-10 w-full appearance-none rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="edit-city" className="text-right text-sm font-medium">
              City
            </label>
            <Input
              id="edit-city"
              value={formData.city}
              onChange={(e) => handleFormChange("city", e.target.value)}
              className="col-span-3"
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="edit-country" className="text-right text-sm font-medium">
              Country
            </label>
            <Input
              id="edit-country"
              value={formData.country}
              onChange={(e) => handleFormChange("country", e.target.value)}
              className="col-span-3"
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="edit-category" className="text-right text-sm font-medium">
              Category
            </label>
            <select
              id="edit-category"
              value={formData.category}
              onChange={(e) => handleFormChange("category", e.target.value)}
              disabled={isLoading}
              className="col-span-3 h-10 w-full appearance-none rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select category</option>
              <option value="Retail">Retail</option>
              <option value="Enterprise">Enterprise</option>
              <option value="Government">Government</option>
              <option value="Military">Military</option>
            </select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleUpdate} disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Customer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}