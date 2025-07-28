"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/interface-adapters/components/ui/dialog";
import { Label } from "@/interface-adapters/components/ui/label";
import { Input } from "@/interface-adapters/components/ui/input";
import { Button } from "@/interface-adapters/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/interface-adapters/lib/utils";
import { useState, useEffect } from "react";
import { getCustomers } from "@/framework-drivers/api/project-instance/get-customer";
import { createProjects } from "@/framework-drivers/api/project-instance/create-project";
import { toast } from "sonner";
import { Loader2 } from "lucide-react"; 

export default function ProjectInstanceModal({
  isOpen,
  onClose,
  selectedKey,
  projectName,
  setProjectName,
  contractNumber,
  setContractNumber,
  selectedCustomer,
  setSelectedCustomer,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // add this

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allCustomers, setAllCustomers] = useState([]);

  useEffect(() => {
    if (isOpen) {
      const fetchCustomers = async () => {
        setLoading(true);
        try {
          const result = await getCustomers("");
          const data = result?.data || []; // Extract 'data' array safely
          console.log(data)

          const mapped = data.map((cust) => ({
            value: cust.id,
            label: cust.name,
          }));

          setAllCustomers(mapped);
          setCustomers(mapped);
        } catch (error) {
          console.error("Failed to fetch customers", error);
          toast.error("Error fetching customers.");
        } finally {
          setLoading(false);
        }
      };

      fetchCustomers();
    }
  }, [isOpen]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (!term) {
      setCustomers(allCustomers);
    } else {
      const filtered = allCustomers.filter((customer) =>
        customer.label.toLowerCase().includes(term.toLowerCase())
      );
      setCustomers(filtered);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
     setIsSubmitting(true);
     
    const result = await createProjects({
      key: selectedKey,
      businessKey: contractNumber,
      name: projectName,
      customer: selectedCustomer,
    });

    if (result?.status === true) {
      toast.success(`Project ${projectName} started successfully`);
      onClose();
    } else {
      toast.error(`Failed to start project ${contractNumber}`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Start Project Instance</DialogTitle>
          <DialogDescription>
            Configure the project instance details before starting.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="key">Key</Label>
            <Input id="key" value={selectedKey} disabled className="bg-muted" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name-project">Name Project</Label>
            <Input
              id="name-project"
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter project name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contract">Business Key</Label>
            <Input
              id="contract"
              value={contractNumber}
              onChange={(e) => setContractNumber(e.target.value)}
              placeholder="Enter contract number"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="customer-search">Customer</Label>
            <Input
              id="customer-search"
              placeholder="Type to search..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />

            <div className="border rounded-md max-h-40 overflow-y-auto mt-2">
              {loading ? (
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  Loading...
                </div>
              ) : customers.length > 0 ? (
                customers.map((customer) => (
                  <div
                    key={customer.value}
                    className={cn(
                      "px-3 py-2 cursor-pointer hover:bg-muted flex items-center justify-between",
                      selectedCustomer === customer.value && "bg-muted"
                    )}
                    onClick={() => setSelectedCustomer(customer.value)}
                  >
                    <span>{customer.label}</span>
                    {selectedCustomer === customer.value && (
                      <Check className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  No customer found.
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
      <Button
  type="submit"
  disabled={!contractNumber || !selectedCustomer || isSubmitting}
>
  {isSubmitting ? (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Starting...
    </>
  ) : (
    "Start Process"
  )}
</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
