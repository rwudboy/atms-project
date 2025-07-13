"use client";

import { useEffect } from "react";
import { Button } from "@/interface-adapters/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/interface-adapters/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/interface-adapters/components/ui/table";
import { Input } from "@/interface-adapters/components/ui/input";
import { Search, ArrowLeft } from "lucide-react";
import CustomerService from "@/application-business-layer/services/customerService";
import CustomerDetailsView from "./CustomerDetailsView"; // Optional: separate component for details

export default function CustomersPage() {
  const {
    customers,
    searchTerm,
    loading,
    allCustomers,
    showDetails,
    selectedCustomerDetails,
    detailsLoading,
    
    fetchCustomers,
    handleSearchChange,
    handleViewDetail,
    handleDeleteCustomer,
    handleEditCustomer,
    handleBackToList,
    
    formatDate,
    getStatusClassName
  } = CustomerService();

  // Fetch customers on component mount
  useEffect(() => {
    fetchCustomers();
  }, []);

  // Render Details View if showDetails is true
  if (showDetails && selectedCustomerDetails) {
    return (
      <CustomerDetailsView 
        customer={selectedCustomerDetails}
        onBackToList={handleBackToList}
        onEditCustomer={handleEditCustomer}
      />
    );
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Customers</CardTitle>
          <CardDescription>View and manage your customers</CardDescription>
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
              placeholder="Search by name, city, or country..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Customer List</CardTitle>
          <CardDescription>
            Showing {customers.length} of {allCustomers.length} customers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    Loading customers...
                  </TableCell>
                </TableRow>
              ) : customers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    No customers found
                  </TableCell>
                </TableRow>
              ) : (
                customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.city}</TableCell>
                    <TableCell>{customer.country}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClassName(customer.status)}`}>
                        {customer.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button 
                        onClick={() => handleViewDetail(customer)} 
                        disabled={detailsLoading}
                      >
                        {detailsLoading ? "Loading..." : "View"}
                      </Button>
                      <Button 
                        variant="destructive" 
                        onClick={() => handleDeleteCustomer(customer.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}