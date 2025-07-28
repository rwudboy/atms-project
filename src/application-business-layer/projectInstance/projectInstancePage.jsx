"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Search, Eye, ShieldAlert } from "lucide-react";

// UI Components
import { Card, CardHeader, CardTitle, CardDescription } from "@/interface-adapters/components/ui/card";

// Auth Context
import { useAuth } from "@/interface-adapters/context/AuthContext";

// Use Cases
import { getProjects } from "@/framework-drivers/api/project-instance/get-project";
import { getCustomers } from "@/framework-drivers/api/project-instance/get-customer";
import { getDiagram } from "@/framework-drivers/api/project-instance/get-diagram";

// Child Components
import ProjectInstanceSearch from "@/interface-adapters/components/project-instance/ProjectInstanceSearch";
import ProjectInstanceList from "@/interface-adapters/components/project-instance/ProjectInstanceList";
import ProjectInstanceModal from "@/interface-adapters/components/modals/project-instance/project-instance-modal";
import DiagramModal from "@/interface-adapters/components/modals/project-instance/diagram-modal";

export default function ProjectInstancePage() {
  // --- AUTH MANAGEMENT ---
  const { user } = useAuth();
  const isStaff = user?.role?.toLowerCase() === "staff";

  // --- STATE MANAGEMENT ---
  const [instances, setInstances] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [allInstances, setAllInstances] = useState([]);

  // Modal states
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

  // --- HANDLERS & LOGIC ---
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
      setDiagramData(result);
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

  // --- DATA FETCHING ---
  useEffect(() => {
    const fetchInstances = async () => {
      try {
        setLoading(true);
        const projectData = await getProjects();
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
        const options = data.map((c) => ({ label: c.name, value: c.id }));
        setCustomers(options);
      } catch (error) {
        console.error("Failed to fetch customers:", error);
      }
    };
    fetchCustomers();
  }, []);

  // --- FILTERING LOGIC ---
  useEffect(() => {
    if (!searchTerm.trim()) {
      setInstances(allInstances);
      return;
    }
    const lower = searchTerm.toLowerCase();
    const filtered = allInstances.filter((instance) =>
      instance.name?.toLowerCase().includes(lower) ||
      instance.key?.toLowerCase().includes(lower) ||
      instance.description?.toLowerCase().includes(lower)
    );
    setInstances(filtered);
  }, [searchTerm, allInstances]);

  // --- RENDER ---

  // Show access denied for staff users with the same style as customer page
  if (isStaff) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader className="text-center">
            <ShieldAlert className="mx-auto h-12 w-12 text-destructive opacity-75 mb-2" />
            <CardTitle>Access Denied</CardTitle>
            <CardDescription className="pt-2">
              Staff members do not have permission to access the Project Instances page. 
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
        <CardHeader>
          <CardTitle>Project Instances</CardTitle>
          <CardDescription>View available project instances.</CardDescription>
        </CardHeader>
      </Card>

      <ProjectInstanceSearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <ProjectInstanceList
        loading={loading}
        instances={instances}
        totalInstances={allInstances.length}
        onClaim={handleClaim}
        onViewDiagram={handleViewDiagram}
      />

      {/* Modals are kept here as they are controlled by this page's state */}
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

      <DiagramModal
        isOpen={isDiagramModalOpen}
        onClose={closeDiagramModal}
        responseData={diagramData}
        loading={diagramLoading}
      />
    </div>
  );
}