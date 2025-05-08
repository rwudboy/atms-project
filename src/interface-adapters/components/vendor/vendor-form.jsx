"use client";

import { useState, useEffect } from "react";
import { Button } from "@/interface-adapters/components/ui/button";
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/interface-adapters/components/ui/card";
import { Plus, Trash, Search, Edit } from "lucide-react";  // Removed Eye icon
import {
  getVendors as getVendorsUseCase,
  deleteVendor as deleteVendorUseCase,
  addVendor as addVendorUseCase,
  updateVendor as updateVendorUseCase,
} from "@/interface-adapters/usecases/vendor/vendor-usecase";
import { toast } from "sonner";
import AddVendorDrawer from "@/interface-adapters/components/vendor/vendor-drawer";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/interface-adapters/components/ui/dialog";

export default function VendorPage() {
  const [vendors, setVendors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [modalState, setModalState] = useState({
    open: false,
    mode: "add",
    vendor: null,
  });

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteVendor, setDeleteVendor] = useState(null);
  const [confirmDeleteStep, setConfirmDeleteStep] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  // Load vendors on mount
  useEffect(() => {
    const loadVendors = async () => {
      setIsLoading(true);
      try {
        const result = await getVendorsUseCase(searchTerm);
        setVendors(result || []);
      } catch (error) {
        console.error("Failed to fetch vendors:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadVendors();
  }, [searchTerm]);

  const handleSaveVendor = async (formData) => {
    try {
      if (modalState.mode === "add") {
        const addedVendor = await addVendorUseCase(formData);
        setVendors((prev) => [...prev, addedVendor]);
        toast.success("Vendor added successfully");
      } else if (modalState.mode === "edit" && modalState.vendor?.uuid) {
        const updatedVendor = await updateVendorUseCase(modalState.vendor.uuid, formData);
        setVendors(
          vendors.map((v) => (v.uuid === updatedVendor.uuid ? updatedVendor : v))
        );
        toast.success("Vendor updated successfully");
      }
    } catch (error) {
      console.error("Error saving vendor:", error.message);
      toast.error("Failed to save vendor");
    } finally {
      setModalState({ open: false, mode: "add", vendor: null });
    }
  };

  const handleDeleteVendor = async () => {
    try {
      if (deleteVendor?.uuid) {
        await deleteVendorUseCase(deleteVendor.uuid);
        setVendors(vendors.filter((v) => v.uuid !== deleteVendor.uuid));
        toast.success("Vendor deleted successfully");
      }
    } catch (error) {
      console.error("Failed to delete vendor:", error.message);
      setDeleteError("Failed to delete vendor");
      toast.error("Failed to delete vendor");
    } finally {
      setDeleteVendor(null);
      setConfirmDeleteStep(false); // Reset to first step
      setShowDeleteDialog(false);
    }
  };

  const filteredVendors = vendors.filter(
    (vendor) =>
      vendor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteDialogClose = () => {
    setShowDeleteDialog(false);
    setDeleteError(null);
    setConfirmDeleteStep(false); // Reset confirmation steps
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vendor References</h1>
          <p className="text-muted-foreground">Manage your vendor references</p>
        </div>
        {/* Replaced Modal Button with AddVendorDrawer */}
        <AddVendorDrawer
          trigger={
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Vendor
            </Button>
          }
          onVendorAdded={() => {
            // Re-fetch vendors after adding new one
            setIsLoading(true);
            getVendorsUseCase(searchTerm)
              .then((result) => setVendors(result || []))
              .finally(() => setIsLoading(false));
          }}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vendors</CardTitle>
          <CardDescription>A list of all vendors in the system.</CardDescription>
          <div className="flex w-full max-w-sm items-center space-x-2 mt-4">
            <Input
              type="search"
              placeholder="Search vendors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button type="button" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading vendors...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVendors.map((vendor) => (
                  <TableRow key={vendor.uuid}>
                    <TableCell className="font-medium">{vendor.name}</TableCell>
                    <TableCell>{vendor.address}</TableCell>
                    <TableCell>{vendor.status}</TableCell>
                    <TableCell>{vendor.city}</TableCell>
                    <TableCell>{vendor.country}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setModalState({ open: true, mode: "edit", vendor })}
                        >
                          <Edit className="h-4 w-4" />  {/* Pencil/pen icon for editing */}
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setDeleteVendor(vendor);
                            setShowDeleteDialog(true);
                          }}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={handleDeleteDialogClose}>
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
            <Button variant="outline" onClick={handleDeleteDialogClose}>
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
              <Button
                variant="destructive"
                onClick={handleDeleteVendor}
              >
                Yes, Delete Permanently
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
