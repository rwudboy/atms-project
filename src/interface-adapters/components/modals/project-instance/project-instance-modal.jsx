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
import { getCustomers } from "@/interface-adapters/usecases/customer/get-customer";
import { createProjects } from "@/interface-adapters/usecases/project-instance/create-project";
import { toast } from "sonner"; 

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
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      setLoading(true);
      const result = await getCustomers(searchTerm);
      const mapped = result.map((cust) => ({
        value: cust.id,
        label: cust.name,
      }));
      setCustomers(mapped);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await createProjects({
      key: selectedKey,
      businessKey: contractNumber,
      name: projectName,
      customer: selectedCustomer,
    });

    if (result?.status === true) {
      toast.success(`Project ${contractNumber} started successfully`);
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
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter project name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contract">Contract Number</Label>
            <Input
              id="contract"
              value={contractNumber}
              onChange={(e) => setContractNumber(e.target.value)}
              placeholder="Enter contract number"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="customer-search">Search Customer</Label>
            <Input
              id="customer-search"
              placeholder="Type to search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
              disabled={!contractNumber || !selectedCustomer}
            >
              Start Process
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
