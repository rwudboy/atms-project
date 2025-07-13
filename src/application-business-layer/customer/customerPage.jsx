"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { 
  getCustomers, 
  deleteCustomer, 
  editCustomer 
} from "@/application-business-layer/usecases/customer";

// Utility Functions
const filterCustomers = (customers, searchTerm) => {
  if (!searchTerm.trim()) return customers;
  const lower = searchTerm.toLowerCase();
  return customers.filter((customer) =>
    customer.name?.toLowerCase().includes(lower) ||
    customer.city?.toLowerCase().includes(lower) ||
    customer.country?.toLowerCase().includes(lower)
  );
};

const formatDate = (dateString) => {
  return dateString ? new Date(dateString).toLocaleString() : "—";
};

const getStatusClassName = (status) => {
  return status === "inactive" 
    ? "bg-gray-100 text-gray-800" 
    : "bg-green-100 text-green-800";
};

export default function CustomerService() {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [allCustomers, setAllCustomers] = useState([]);
  const [selectedCustomerDetails, setSelectedCustomerDetails] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // Fetch Customers
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const result = await getCustomers();

      let customerData = [];
      if (result?.data?.code === 0 && result?.data?.status === true) {
        customerData = Array.isArray(result.data.data) ? result.data.data : [];
      }

      setAllCustomers(customerData);
      setCustomers(customerData);
    } catch (error) {
      console.error("Error fetching customers:", error);
      toast.error("Failed to fetch customer list.");
    } finally {
      setLoading(false);
    }
  };

  // Filter Customers
  useEffect(() => {
    const filteredCustomers = filterCustomers(allCustomers, searchTerm);
    setCustomers(filteredCustomers);
  }, [searchTerm, allCustomers]);

  // Handle Search Change
  const handleSearchChange = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
  };

  // View Customer Details
  const handleViewDetail = async (customer) => {
    try {
      setDetailsLoading(true);
      // Implement your get customer details logic here
      setSelectedCustomerDetails(customer);
      setShowDetails(true);
    } catch (error) {
      console.error("Error fetching customer details:", error);
      toast.error("Failed to fetch customer details.");
    } finally {
      setDetailsLoading(false);
    }
  };

  // Delete Customer
  const handleDeleteCustomer = async (customerId) => {
    try {
      const result = await deleteCustomer(customerId);
      
      if (result.success) {
        // Remove the deleted customer from the list
        setCustomers(customers.filter(c => c.id !== customerId));
        setAllCustomers(allCustomers.filter(c => c.id !== customerId));
        toast.success("Customer deleted successfully!");
      } else {
        toast.error(result.message || "Failed to delete customer.");
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
      toast.error("An error occurred while deleting the customer.");
    }
  };

  // Edit Customer
  const handleEditCustomer = async (customerId, updatedData) => {
    try {
      const result = await editCustomer(customerId, updatedData);
      
      if (result.success) {
        // Update the customer in the list
        setCustomers(customers.map(c => 
          c.id === customerId ? { ...c, ...updatedData } : c
        ));
        setAllCustomers(allCustomers.map(c => 
          c.id === customerId ? { ...c, ...updatedData } : c
        ));
        toast.success("Customer updated successfully!");
        return true;
      } else {
        toast.error(result.message || "Failed to update customer.");
        return false;
      }
    } catch (error) {
      console.error("Error updating customer:", error);
      toast.error("An error occurred while updating the customer.");
      return false;
    }
  };

  // Back to List
  const handleBackToList = () => {
    setShowDetails(false);
    setSelectedCustomerDetails(null);
  };

  return {
    customers,
    searchTerm,
    loading,
    allCustomers,
    showDetails,
    selectedCustomerDetails,
    detailsLoading,
    
    // Methods
    fetchCustomers,
    handleSearchChange,
    handleViewDetail,
    handleDeleteCustomer,
    handleEditCustomer,
    handleBackToList,
    
    // Utility Functions
    formatDate,
    getStatusClassName
  };
}