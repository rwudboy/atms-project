import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/interface-adapters/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/interface-adapters/components/ui/card";
import { Input } from "@/interface-adapters/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/interface-adapters/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/interface-adapters/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/interface-adapters/components/ui/alert";
import { Search, Plus, Trash2 } from "lucide-react";
import { getCustomers } from "@/interface-adapters/usecases/customer/get-customer";
import { deleteCustomer } from "@/interface-adapters/usecases/customer/delete-customer";
import AddCustomerDrawer from "@/interface-adapters/components/customer/customer-drawer";
import { toast } from "sonner";

export default function CustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [confirmDeleteStep, setConfirmDeleteStep] = useState(false);  // Add this state

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
    setConfirmDeleteStep(false);  // Reset confirmation step
  };

  const handleDeleteCustomer = async () => {
    if (confirmDeleteStep) {
      try {
        // Call deleteCustomer from usecase
        await deleteCustomer(customerToDelete);

        // Remove the deleted customer from the local state
        setCustomers(customers.filter((c) => c.uuid !== customerToDelete));

        // Show success notification
        toast.success("Customer deleted successfully!");
        setShowDeleteDialog(false);
        setCustomerToDelete(null);
        setConfirmDeleteStep(false);
      } catch (error) {
        // Handle error and show notification
        setDeleteError(error.message || "An error occurred while deleting the customer.");
        toast.error("Failed to delete customer.");
      }
    } else {
      setConfirmDeleteStep(true);
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
          {/* Add Customer Button with Drawer trigger */}
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
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : customers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No customers found
                  </TableCell>
                </TableRow>
              ) : (
                customers.map((customer) => (
                  <TableRow key={customer.uuid}>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>{customer.address}</TableCell>
                    <TableCell>{customer.city}</TableCell>
                    <TableCell>{customer.country}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(customer.uuid)}>
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
    </div>
  );
}
