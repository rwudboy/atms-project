"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { getTasks } from "@/application-business-layer/usecases/assign-task/get-task";
import { getTaskByBusinessKey } from "@/application-business-layer/usecases/unassign-task/get-task-by-bk";
import { getTaskById } from "@/application-business-layer/usecases/unassign-task/get-task-by-id";
import { getDiagram } from "@/application-business-layer/usecases/unassign-task/get-diagram";

import AssignTaskView from "@/interface-adapters/components/assign-task/assignTaskView";

// Helper functions
const filterTasks = (tasks, searchTerm) => {
  if (!searchTerm.trim()) return tasks;
  const lower = searchTerm.toLowerCase();
  return tasks.filter(
    (task) =>
      task.nama?.toLowerCase().includes(lower) ||
      task.customer?.toLowerCase().includes(lower)
  );
};

const isTaskOverdue = (dueDate) => {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date();
};

const formatDate = (dateString) => {
  return dateString ? new Date(dateString).toLocaleString() : "—";
};

const getStatusClassName = (status) => {
  return status === "incative" 
    ? "bg-gray-100 text-gray-800" 
    : "bg-green-100 text-green-800";
};

const getDelegationClassName = (delegation) => {
  if (delegation === "PENDING") return "bg-yellow-100 text-yellow-800";
  return delegation 
    ? "bg-green-100 text-green-800" 
    : "bg-gray-100 text-gray-800";
};

export default function AssignTaskPage() {
  const router = useRouter();

  // State
  const [tasks, setTasks] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedTaskDetails, setSelectedTaskDetails] = useState([]);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const [isDiagramModalOpen, setIsDiagramModalOpen] = useState(false);
  const [diagramData, setDiagramData] = useState(null);
  const [diagramLoading, setDiagramLoading] = useState(false);
  const [selectedTaskForDiagram, setSelectedTaskForDiagram] = useState(null);

  // Per-button loading maps
  const [viewButtonLoading, setViewButtonLoading] = useState({});
  const [detailButtonLoading, setDetailButtonLoading] = useState({});

  // Fetch tasks on mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const result = await getTasks();

        if (result?.data?.code === 0 && result?.data?.status === true) {
          const data = Array.isArray(result.data.data) ? result.data.data : [];
          setAllTasks(data);
          setTasks(data);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
        toast.error("Failed to fetch task list");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Filter tasks based on search term
  useEffect(() => {
    setTasks(filterTasks(allTasks, searchTerm));
  }, [searchTerm, allTasks]);

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  // Handle view details
  const handleViewDetail = async (task) => {
    const taskKey = task.businessKey || task.id;
    setViewButtonLoading((prev) => ({ ...prev, [taskKey]: true }));
    
    try {
      const result = await getTaskByBusinessKey(task.businessKey);
      if (result?.status && result?.data) {
        const data = Array.isArray(result.data) ? result.data : [];
        setSelectedTaskDetails(data);
        setShowDetails(true);
      } else {
        toast.error("Failed to fetch task details");
      }
    } catch (error) {
      console.error("Error fetching task details:", error);
      toast.error("Failed to fetch task details");
    } finally {
      setViewButtonLoading((prev) => ({ ...prev, [taskKey]: false }));
    }
  };

  // Handle diagram modal
  const handleViewDiagram = async (task) => {
  setDiagramLoading(true);
  setSelectedTaskForDiagram(task);

  try {
    const result = await getDiagram(task.id);
    console.log("Diagram Response:", result);

    if (result?.data?.bpm) {
      const rawBpmn = result.data.bpm;
      const tahap = result.data.tahap ?? "—";

      // 🔁 Replace ${tahap} in the BPMN XML
      const updatedBpmn = rawBpmn.replace(/\$\{tahap\}/g, tahap);

      const payload = {
        bpm: updatedBpmn,
        active: result.data.active ?? null,
        tahap,
      };

      setDiagramData(payload);
      setIsDiagramModalOpen(true);
    } else {
      toast.error("Diagram data is missing");
    }
  } catch (err) {
    console.error("Error fetching diagram:", err);
    toast.error("Failed to load diagram");
  } finally {
    setDiagramLoading(false);
  }
};

  const handleCloseModal = () => {
    setIsDiagramModalOpen(false);
  };

  // Handle task detail navigation
  const handleViewTaskDetail = async (task) => {
    const taskKey = task.id;
    setDetailButtonLoading((prev) => ({ ...prev, [taskKey]: true }));
    
    try {
      const taskName = task.name || "task";
      const slug = taskName.toLowerCase().replace(/\s+/g, "-");
      router.push(`/task/${taskKey}__${slug}`);
    } catch (error) {
      console.error("Error navigating to task detail:", error);
      toast.error("Unable to navigate to task detail");
    } finally {
      setDetailButtonLoading((prev) => ({ ...prev, [taskKey]: false }));
    }
  };

  const handleBackToList = () => {
    setShowDetails(false);
    setSelectedTaskDetails([]);
  };

  return (
    <AssignTaskView
      tasks={tasks}
      allTasks={allTasks}
      searchTerm={searchTerm}
      loading={loading}
      showDetails={showDetails}
      selectedTaskDetails={selectedTaskDetails}
      detailsLoading={detailsLoading}
      onSearchChange={handleSearchChange}
      onViewDetail={handleViewDetail}
      onViewTaskDetail={handleViewTaskDetail}
      onBackToList={handleBackToList}
      onViewDiagram={handleViewDiagram}
      isDiagramModalOpen={isDiagramModalOpen}
      diagramData={diagramData}
      diagramLoading={diagramLoading}
      onCloseModal={handleCloseModal}
      selectedTaskForDiagram={selectedTaskForDiagram}
      getStatusClassName={getStatusClassName}
      getDelegationClassName={getDelegationClassName}
      isTaskOverdue={isTaskOverdue}
      formatDate={formatDate}
      viewButtonLoading={viewButtonLoading}
      detailButtonLoading={detailButtonLoading}
    />
  );
}