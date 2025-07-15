"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getTasks } from "@/application-business-layer/usecases/unassign-task/get-task";
import { getTaskByBusinessKey } from "@/application-business-layer/usecases/unassign-task/get-task-by-bk";
import { getTaskById } from "@/application-business-layer/usecases/unassign-task/get-task-by-id";
import UnassignTaskView from "@/interface-adapters/components/unassign-task/unnassignTaskView";
import { getDiagram } from "@/application-business-layer/usecases/unassign-task/get-diagram";
import DiagramModal from "@/interface-adapters/components/modals/unassignTask/diagram-modal";

// Business Functions
const filterTasks = (tasks, searchTerm) => {
  if (!searchTerm.trim()) return tasks;
  const lower = searchTerm.toLowerCase();
  return tasks.filter((task) =>
    task.nama?.toLowerCase().includes(lower) ||
    task.customer?.toLowerCase().includes(lower)
  );
};

const isTaskOverdue = (dueDate) => {
  if (!dueDate) return false;
  const now = new Date();
  const due = new Date(dueDate);
  return due < now;
};

const formatDate = (dateString) => {
  return dateString ? new Date(dateString).toLocaleString() : "—";
};

const generateTaskSlug = (taskName) => {
  return taskName?.toLowerCase().replace(/\s+/g, "-") || "task";
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

export default function UnassignTaskPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTaskForDiagram, setSelectedTaskForDiagram] = useState(null);
  const [diagramLoading, setDiagramLoading] = useState(false);
  const [isDiagramModalOpen, setIsDiagramModalOpen] = useState(false);
  const [diagramData, setDiagramData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allTasks, setAllTasks] = useState([]);
  const [selectedTaskDetails, setSelectedTaskDetails] = useState([]);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const result = await getTasks();

        let taskData = [];
        if (result?.data?.code === 0 && result?.data?.status === true) {
          taskData = Array.isArray(result.data.data) ? result.data.data : [];
        }

        setAllTasks(taskData);
        setTasks(taskData);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        toast.error("Failed to fetch task list.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  useEffect(() => {
    const filteredTasks = filterTasks(allTasks, searchTerm);
    setTasks(filteredTasks);
  }, [searchTerm, allTasks]);

  const handleSearchChange = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
  };

  const handleViewDetail = async (task) => {
    try {
      setDetailsLoading(true);
      const result = await getTaskByBusinessKey(task.businessKey);
      console.log("memeg",result)

      if (result.status && result.data) {
        const taskData = Array.isArray(result.data) ? result.data : [];
        setSelectedTaskDetails(taskData);
        setShowDetails(true);
      } else {
        toast.error("Failed to fetch task details.");
      }
    } catch (error) {
      console.error("Error fetching task details:", error);
      toast.error("Failed to fetch task details.");
    } finally {
      setDetailsLoading(false);
    }
  };

const handleViewDiagram = async (instance) => {
  try {
    setDiagramLoading(true);
    setSelectedTaskForDiagram(instance);
    const result = await getDiagram(instance.id);
    console.log("Diagram Response:", result);

    if (result?.data?.bpm) {
      const diagramPayload = {
        bpm: result.data.bpm,
        active: result.data.active ?? null,
        tahap: result.data.tahap??null, // optional
      };

      setDiagramData(diagramPayload);
      console.log(diagramData)
      setIsDiagramModalOpen(true);
    } else {
      toast.error("Diagram data is missing.");
    }
  } catch (error) {
    console.error("Error loading diagram:", error);
    toast.error("Failed to load diagram");
  } finally {
    setDiagramLoading(false);
  }
};


const handleCloseModal = () => {
  setIsDiagramModalOpen(false);
};

  const handleViewTaskDetail = async (task) => {
    setDetailsLoading(true);
    const result = await getTaskByBusinessKey(task.businessKey);

      const taskId = task.id;
      const taskName = task.name || "task";
      const slug = taskName.toLowerCase().replace(/\s+/g, "-");
      router.push(`/unassignTask/${taskId}__${slug}`);
   
};

  const handleBackToList = () => {
    setShowDetails(false);
    setSelectedTaskDetails([]);
  };

  return (
    <UnassignTaskView
      tasks={tasks}
      searchTerm={searchTerm}
      loading={loading}
      allTasks={allTasks}
      showDetails={showDetails}
      selectedTaskDetails={selectedTaskDetails}
      detailsLoading={detailsLoading}
      onSearchChange={handleSearchChange}
      onViewDetail={handleViewDetail}
      onViewTaskDetail={handleViewTaskDetail}
      onBackToList={handleBackToList}
      onViewDiagram={handleViewDiagram}
      isModalOpen={isModalOpen}
      selectedTaskForDiagram={selectedTaskForDiagram}
      isTaskOverdue={isTaskOverdue}
      responseData={diagramData}
      formatDate={formatDate}
      getStatusClassName={getStatusClassName}
      getDelegationClassName={getDelegationClassName}
isDiagramModalOpen={isDiagramModalOpen}
    diagramData={diagramData}
    diagramLoading={diagramLoading}
    onCloseModal={handleCloseModal}
    task={selectedTaskForDiagram}
    />
  );
}
