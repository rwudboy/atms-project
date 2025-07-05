"use client";

import { useState, useEffect } from "react";
import { Button } from "@/interface-adapters/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/interface-adapters/components/ui/card";
import { Input } from "@/interface-adapters/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/interface-adapters/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/interface-adapters/components/ui/dialog";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/interface-adapters/components/ui/alert";
import { Search, Plus, Trash2, Edit } from "lucide-react";
import { getVendors } from "@/application-business-layer/usecases/vendor/get-vendor";
import { deleteVendor } from "@/application-business-layer/usecases/vendor/delete-vendor";
import { updateVendorDetail } from "@/application-business-layer/usecases/vendor/edit-vendor";

import AddVendorDrawer from "@/interface-adapters/components/vendor/vendor-drawer";
import EditVendorModal from "@/interface-adapters/components/modals/vendor/edit-vendor"; // Import the new component
import { toast } from "sonner";

export default function VendorPage() {
  const [vendors, setVendors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [vendorToDelete, setVendorToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [confirmDeleteStep, setConfirmDeleteStep] = useState(false);
  
  // Add edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [vendorToEdit, setVendorToEdit] = useState(null);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const result = await getVendors("");
        setVendors(result);
      } catch (error) {
        console.error("Error fetching vendors:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVendors();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      setLoading(true);
      try {
        const result = await getVendors(searchTerm);
        setVendors(result);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    }, 1000);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const handleDeleteClick = (id) => {
    setVendorToDelete(id);
    setShowDeleteDialog(true);
    setDeleteError(null);
    setConfirmDeleteStep(false);
  };

  const handleDeleteVendor = async () => {
    try {
      await deleteVendor(vendorToDelete);
      setVendors((prev) => prev.filter((v) => v.uuid !== vendorToDelete));
      setShowDeleteDialog(false);
      setConfirmDeleteStep(false);
      toast.success("Vendor deleted successfully.");
    } catch (error) {
      setDeleteError("Failed to delete the vendor.");
      toast.error("There was an error deleting the vendor.");
    }
  };

  // Add edit handler
  const handleEditClick = (vendor) => {
    setVendorToEdit(vendor);
    setShowEditModal(true);
  };

  // Add update handler
  const handleupdateVendorDetail = async (vendorId, updatedData) => {
    try {
      await updateVendorDetail(vendorId, updatedData);
      // Update the vendors list with the updated data
      setVendors((prev) =>
        prev.map((vendor) =>
          vendor.uuid === vendorId ? { ...vendor, ...updatedData } : vendor
        )
      );
      toast.success("Vendor updated successfully.");
    } catch (error) {
      console.error("Error updating vendor:", error);
      toast.error("There was an error updating the vendor.");
      throw error; // Re-throw to handle in modal
    }
  };

  const refreshVendors = async () => {
    try {
      const result = await getVendors("");
      setVendors(result);
    } catch (error) {
      console.error("Failed to refresh vendor list:", error);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="mb-6">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Vendor References</CardTitle>
            <CardDescription>Manage and view all vendor data.</CardDescription>
          </div>
          <AddVendorDrawer
            trigger={
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Vendor
              </Button>
            }
            onVendorAdded={refreshVendors}
          />
        </CardHeader>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search Vendor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by name..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Vendor List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : vendors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    No vendors found
                  </TableCell>
                </TableRow>
              ) : (
                vendors.map((vendor) => (
                  <TableRow key={vendor.uuid || vendor.name}>
                    <TableCell>{vendor.name}</TableCell>
                    <TableCell>{vendor.address}</TableCell>
                    <TableCell>{vendor.status}</TableCell>
                    <TableCell>{vendor.city}</TableCell>
                    <TableCell>{vendor.country}</TableCell>
                    <TableCell>{vendor.category}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEditClick(vendor)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDeleteClick(vendor.uuid)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <EditVendorModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setVendorToEdit(null);
        }}
        onUpdate={handleupdateVendorDetail}
        vendor={vendorToEdit}
      />

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Vendor</DialogTitle>
            <DialogDescription>
              {confirmDeleteStep
                ? "Are you absolutely sure? This will permanently delete the vendor."
                : "Are you sure you want to delete this vendor? This action cannot be undone."}
            </DialogDescription>
          </DialogHeader>

          {deleteError && (
            <Alert variant="destructive" className="mt-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{deleteError}</AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteDialog(false);
                setConfirmDeleteStep(false);
              }}
            >
              Cancel
            </Button>

            {!confirmDeleteStep ? (
              <Button
                variant="destructive"
                onClick={() => setConfirmDeleteStep(true)}
              >
                Delete
              </Button>
            ) : (
              <Button variant="destructive" onClick={handleDeleteVendor}>
                Yes, Delete Permanently
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}