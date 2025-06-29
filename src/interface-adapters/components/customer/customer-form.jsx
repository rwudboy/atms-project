import { useState, useEffect } from "react";
import { Button } from "@/interface-adapters/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/interface-adapters/components/ui/card";
import { Input } from "@/interface-adapters/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/interface-adapters/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/interface-adapters/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/interface-adapters/components/ui/alert";
import { Search, Plus, Trash2, Edit } from "lucide-react";
import { getCustomers } from "@/interface-adapters/usecases/customer/get-customer";
import { deleteCustomer } from "@/interface-adapters/usecases/customer/delete-customer";
import { editCustomer } from "@/interface-adapters/usecases/customer/edit-customer";
import AddCustomerDrawer from "@/interface-adapters/components/customer/customer-drawer";
import EditCustomerModal from "@/interface-adapters/components/modals/customer/edit-customer";
import { toast } from "sonner";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [confirmDeleteStep, setConfirmDeleteStep] = useState(false);
  
  // Edit modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState(null);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      setLoading(true);
      const result = await getCustomers(searchTerm);
      setCustomers(result);
      setLoading(false);
    }, 1000); // 1 second debounce

    return () => clearTimeout(delayDebounce); // Cleanup
  }, [searchTerm]);

  const handleDeleteClick = (id) => {
    setCustomerToDelete(id);
    setShowDeleteDialog(true);
    setDeleteError(null);
    setConfirmDeleteStep(false);
  };

  const handleEditClick = (customer) => {
    setCustomerToEdit(customer);
    setShowEditModal(true);
  };

  const handleDeleteCustomer = async () => {
    if (confirmDeleteStep) {
      try {
        await deleteCustomer(customerToDelete);
        setCustomers(customers.filter((c) => c.id !== customerToDelete));
        toast.success("Customer deleted successfully!");
        setShowDeleteDialog(false);
        setCustomerToDelete(null);
        setConfirmDeleteStep(false);
      } catch (error) {
        setDeleteError(error.message || "An error occurred while deleting the customer.");
        toast.error("Failed to delete customer.");
      }
    } else {
      setConfirmDeleteStep(true);
    }
  };

  const handleUpdateCustomer = async (customerId, formData) => {
    try {
      await editCustomer(customerId, formData);
      
      // Update the customer in the local state
      setCustomers(customers.map(customer => 
        customer.id === customerId 
          ? { ...customer, ...formData }
          : customer
      ));
      
      toast.success("Customer updated successfully!");
      setShowEditModal(false);
      setCustomerToEdit(null);
    } catch (error) {
      console.error("Error updating customer:", error);
      toast.error("Failed to update customer.");
      throw error; // Re-throw to let the modal handle loading state
    }
  };

  const handleCustomerAdded = async () => {
    const updatedCustomers = await getCustomers();
    setCustomers(updatedCustomers);
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="mb-6">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Customer References</CardTitle>
            <CardDescription>Manage and view all customer data.</CardDescription>
          </div>
          <AddCustomerDrawer
            trigger={<Button><Plus className="mr-2 h-4 w-4" /> Add Customer</Button>}
            onCustomerAdded={handleCustomerAdded}
          />
        </CardHeader>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search Customers</CardTitle>
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
          <CardTitle>Customer List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Status</TableHead>
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
              ) : customers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    No customers found
                  </TableCell>
                </TableRow>
              ) : (
                customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>{customer.address}</TableCell>
                    <TableCell>{customer.city}</TableCell>
                    <TableCell>{customer.country}</TableCell>
                    <TableCell>{customer.status}</TableCell>
                    <TableCell>{customer.category}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEditClick(customer)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleDeleteClick(customer.id)}
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

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Customer</DialogTitle>
            <DialogDescription>
              {confirmDeleteStep
                ? "Are you absolutely sure? This will permanently delete the customer."
                : "Are you sure you want to delete this customer? This action cannot be undone."}
            </DialogDescription>
          </DialogHeader>

          {deleteError && (
            <Alert variant="destructive" className="mt-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{deleteError}</AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>

            {!confirmDeleteStep ? (
              <Button variant="destructive" onClick={handleDeleteCustomer}>
                Delete
              </Button>
            ) : (
              <Button variant="destructive" onClick={handleDeleteCustomer}>
                Yes, Delete Permanently
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Customer Modal */}
      <EditCustomerModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setCustomerToEdit(null);
        }}
        onUpdate={handleUpdateCustomer}
        customer={customerToEdit}
      />
    </div>
  );
}