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
import { Search, Eye } from "lucide-react";
import { toast } from "sonner";

import { getProjects } from "@/framework-drivers/api/project-instance/get-project";
import { getCustomers } from "@/framework-drivers/api/customer/get-customer";
import { getDiagram } from "@/framework-drivers/api/project-instance/get-diagram";
import ProjectInstanceModal from "@/interface-adapters/components/modals/project-instance/project-instance-modal";
import DiagramModal from "@/interface-adapters/components/modals/project-instance/diagram-modal";

export default function ProjectInstancePage() {
  const [instances, setInstances] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [allInstances, setAllInstances] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInstance, setSelectedInstance] = useState(null);

  const [selectedKey, setSelectedKey] = useState("");
  const [projectName, setProjectName] = useState("");
  const [contractNumber, setContractNumber] = useState("");
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [customerOpen, setCustomerOpen] = useState(false);

  // Diagram modal states
  const [isDiagramModalOpen, setIsDiagramModalOpen] = useState(false);
  const [diagramData, setDiagramData] = useState(null);
  const [diagramLoading, setDiagramLoading] = useState(false);

  const handleClaim = (instance) => {
    setSelectedInstance(instance);
    setSelectedKey(instance.key || "");
    setProjectName(instance.name || "");
    setContractNumber("");
    setSelectedCustomer("");
    setIsModalOpen(true);
  };

  const handleViewDiagram = async (instance) => {
    try {
      setDiagramLoading(true);
      setIsDiagramModalOpen(true);
      
      const result = await getDiagram(instance.id);
      
      // Store the entire response, not just the bpmxl
      setDiagramData(result);
      
      // Check if the response is successful
      if (!result || result.code !== 0 || !result.status || !result.bpmxl) {
        toast.error("Failed to load diagram");
        setIsDiagramModalOpen(false);
      }
    } catch (error) {
      console.error("Error loading diagram:", error);
      toast.error("Failed to load diagram");
      setIsDiagramModalOpen(false);
    } finally {
      setDiagramLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedInstance(null);
  };

  const closeDiagramModal = () => {
    setIsDiagramModalOpen(false);
    setDiagramData(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success(`Project "${projectName}" started with contract #${contractNumber}`);
    closeModal();
  };

  useEffect(() => {
    const fetchInstances = async () => {
      try {
        setLoading(true);
        const result = await getProjects();
        const projectData = Array.isArray(result)
          ? result
          : Array.isArray(result.data)
          ? result.data
          : [];
        setAllInstances(projectData);
        setInstances(projectData);
      } catch (error) {
        console.error("Error fetching project instances:", error);
        toast.error("Failed to fetch project instances.");
      } finally {
        setLoading(false);
      }
    };

    fetchInstances();
  }, []);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await getCustomers();
        const options = data.map((c) => ({
          label: c.name,
          value: c.id,
        }));
        setCustomers(options);
      } catch (error) {
        console.error("Failed to fetch customers:", error);
        toast.error("Could not load customers.");
      }
    };

    fetchCustomers();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setInstances(allInstances);
      return;
    }

    const lower = searchTerm.toLowerCase();
    const filtered = allInstances.filter((instance) => {
      const nameMatch = instance.name?.toLowerCase().includes(lower);
      const keyMatch = instance.key?.toLowerCase().includes(lower);
      const descMatch = instance.description?.toLowerCase().includes(lower);
      return nameMatch || keyMatch || descMatch;
    });

    setInstances(filtered);
  }, [searchTerm, allInstances]);

  return (
    <div className="container mx-auto py-10">
      <Card className="mb-6">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Project Instances</CardTitle>
            <CardDescription>View available project instances.</CardDescription>
          </div>
        </CardHeader>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search Project Instances</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by name or key..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Project Instance List</CardTitle>
          <CardDescription>
            Showing {instances.length} of {allInstances.length} project instances
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Key</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Resource</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    Loading project instances...
                  </TableCell>
                </TableRow>
              ) : instances.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No project instances found
                  </TableCell>
                </TableRow>
              ) : (
                instances.map((instance) => (
                  <TableRow key={instance.id}>
                    <TableCell className="font-medium">{instance.name || "Unnamed"}</TableCell>
                    <TableCell>{instance.key}</TableCell>
                    <TableCell>
                      {instance.version}
                      {instance.versionTag ? ` (${instance.versionTag})` : ""}
                    </TableCell>
                    <TableCell>{instance.resource}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDiagram(instance)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button size="sm" onClick={() => handleClaim(instance)}>
                          Start
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

      {/* Project Instance Modal */}
      <ProjectInstanceModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        selectedKey={selectedKey}
        projectName={projectName}
        setProjectName={setProjectName}
        contractNumber={contractNumber}
        setContractNumber={setContractNumber}
        customers={customers}
        selectedCustomer={selectedCustomer}
        setSelectedCustomer={setSelectedCustomer}
        customerOpen={customerOpen}
        setCustomerOpen={setCustomerOpen}
      />

      {/* Diagram Modal - Updated props */}
      <DiagramModal
        isOpen={isDiagramModalOpen}
        onClose={closeDiagramModal}
        responseData={diagramData}
        loading={diagramLoading}
      />
    </div>
  );
}