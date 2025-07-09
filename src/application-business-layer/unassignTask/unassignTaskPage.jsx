// File: application-business-layer/unassignTask/UnassignTaskPage.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getTasks } from "@/application-business-layer/usecases/unassign-task/get-task";
import { getTaskByBusinessKey } from "@/application-business-layer/usecases/unassign-task/get-task-by-bk";
import UnassignTaskView from "@/interface-adapters/components/unassign-task/unnassignTaskView";

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

const getTaskDetailUrl = (task) => {
  const slug = generateTaskSlug(task.name);
  return `/unassignTask/${task.id}__${slug}`;
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
      
      // Handle the nested response structure
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

  const handleViewTaskDetail = (task) => {
    const url = getTaskDetailUrl(task);
    router.push(url);
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
      isTaskOverdue={isTaskOverdue}
      formatDate={formatDate}
      getStatusClassName={getStatusClassName}
      getDelegationClassName={getDelegationClassName}
    />
  );
}