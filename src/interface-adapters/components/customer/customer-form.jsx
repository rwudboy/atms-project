import { useState, useEffect } from "react";
import { Button } from "@/interface-adapters/components/ui/button";
import { Badge } from "@/interface-adapters/components/ui/badge";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription
} from "@/interface-adapters/components/ui/card";
import { Input } from "@/interface-adapters/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/interface-adapters/components/ui/table";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle
} from "@/interface-adapters/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/interface-adapters/components/ui/alert";
import { Search, Plus, Trash2, Edit, ShieldAlert } from "lucide-react";
import { getCustomers } from "@/application-business-layer/usecases/customer/get-customer";
import { deleteCustomer } from "@/application-business-layer/usecases/customer/delete-customer";
import { editCustomer } from "@/application-business-layer/usecases/customer/edit-customer";
import AddCustomerDrawer from "@/interface-adapters/components/customer/customer-drawer";
import EditCustomerModal from "@/interface-adapters/components/modals/customer/edit-customer";
import { toast } from "sonner";
import { useAuth } from "@/interface-adapters/context/AuthContext"; // Import AuthContext

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [confirmDeleteStep, setConfirmDeleteStep] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState(null);
  
  // Get user role from AuthContext
  const { user, loading: authLoading } = useAuth();
  const isStaff = user?.role?.toLowerCase() === "staff";

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      const result = await getCustomers();
      setCustomers(result);
      setLoading(false);
    };
    
    // Only fetch customers if user is not staff or if auth is still loading
    if (!isStaff || authLoading) {
      fetchCustomers();
    }
  }, [isStaff, authLoading]);

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
      setCustomers(customers.map(customer =>
        customer.id === customerId ? { ...customer, ...formData } : customer
      ));
      toast.success("Customer updated successfully!");
      setShowEditModal(false);
      setCustomerToEdit(null);
    } catch (error) {
      toast.error("Failed to update customer.");
      throw error;
    }
  };

  const handleCustomerAdded = async () => {
    const updatedCustomers = await getCustomers();
    setCustomers(updatedCustomers);
  };

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // If still loading auth, show a loading state
  if (authLoading) {
    return (
      <div className="container mx-auto py-10">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Customer References</CardTitle>
            <CardDescription>Loading user permissions...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // If user is staff, show access denied
  if (isStaff) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader className="text-center">
            <ShieldAlert className="mx-auto h-12 w-12 text-destructive opacity-75 mb-2" />
            <CardTitle>Access Denied</CardTitle>
            <CardDescription className="pt-2">
              Staff members do not have permission to access the Customer page. 
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Regular content for non-staff users
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
          <CardTitle>Search Customer</CardTitle>
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
                  <TableCell colSpan={7} className="text-center py-4">Loading...</TableCell>
                </TableRow>
              ) : filteredCustomers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">No customers found</TableCell>
                </TableRow>
              ) : (
                filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>{customer.address}</TableCell>
                    <TableCell>{customer.city}</TableCell>
                    <TableCell>{customer.country}</TableCell>
                    <TableCell>
                      <Badge
                        variant={customer.status?.toLowerCase() === "active" ? "success" : "default"}
                        className="uppercase"
                      >
                        {customer.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{customer.category}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditClick(customer)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(customer.id)}>
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
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteCustomer}>
              {confirmDeleteStep ? "Yes, Delete Permanently" : "Delete"}
            </Button>
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