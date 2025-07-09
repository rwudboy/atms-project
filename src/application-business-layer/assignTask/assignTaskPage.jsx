// File: application-business-layer/assignTask/AssignedTaskPage.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getTasks } from "@/application-business-layer/usecases/assign-task/get-task";
import AssignedTaskView from "@/interface-adapters/components/assign-task/assignTaskView";
import usePagination from "@/framework-drivers/hooks/usePagination";

// Business Functions
const filterTasksByName = (tasks, searchTerm) => {
  if (!searchTerm.trim()) return tasks;
  const lower = searchTerm.toLowerCase();
  return tasks.filter(task => 
    task.name?.toLowerCase().includes(lower)
  );
};

const generateTaskSlug = (taskName) => {
  if (!taskName) return "task";
  return taskName.toLowerCase().replace(/\s+/g, "-");
};

const isTaskOverdue = (dueDate) => {
  if (!dueDate) return false;
  const now = new Date();
  const due = new Date(dueDate);
  return due < now;
};

const formatTaskDate = (dateString) => {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleString();
};

const getTaskDetailUrl = (task) => {
  const slug = generateTaskSlug(task.name);
  return `/assignTask/${task.id}__${slug}`;
};

// Page Component
export default function AssignedTaskPage() {
  const router = useRouter();
  const [allTasks, setAllTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Use the pagination hook (5 items per page)
  const {
    currentPage,
    totalPages,
    currentItems: displayTasks,
    totalItems,
    handlePageChange,
    resetPage
  } = usePagination(filteredTasks, 5);

  // Fetch tasks on component mount
  useEffect(() => {
    const fetchAndSetTasks = async () => {
      try {
        setLoading(true);
        const tasksData = await getTasks(); 
        setAllTasks(tasksData);
        setFilteredTasks(tasksData);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        toast.error("Failed to fetch task list.");
      } finally {
        setLoading(false);
      }
    };

    fetchAndSetTasks();
  }, []);

  // Filter tasks based on search term
  useEffect(() => {
    const filtered = filterTasksByName(allTasks, searchTerm);
    setFilteredTasks(filtered);
    resetPage(); // Reset to first page when search changes
  }, [searchTerm, allTasks, resetPage]);

  const handleSearchChange = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
  };

  const handleViewDetail = (task) => {
    const url = getTaskDetailUrl(task);
    router.push(url);
  };

  return (
    <AssignedTaskView
      tasks={displayTasks}
      searchTerm={searchTerm}
      loading={loading}
      currentPage={currentPage}
      totalPages={totalPages}
      totalItems={totalItems}
      onSearchChange={handleSearchChange}
      onPageChange={handlePageChange}
      onViewDetail={handleViewDetail}
      isTaskOverdue={isTaskOverdue}
      formatTaskDate={formatTaskDate}
    />
  );
}