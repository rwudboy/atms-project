// File: application-business-layer/assignTask/AssignedTaskPage.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getTasks } from "@/application-business-layer/usecases/assign-task/get-task";
import AssignedTaskView from "@/interface-adapters/components/assign-task/assignTaskView";

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
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [allTasks, setAllTasks] = useState([]);

  useEffect(() => {
    const fetchAndSetTasks = async () => {
      try {
        setLoading(true);
        const tasksData = await getTasks(); 
        setAllTasks(tasksData);
        setTasks(tasksData);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        toast.error("Failed to fetch task list.");
      } finally {
        setLoading(false);
      }
    };

    fetchAndSetTasks();
  }, []);

  useEffect(() => {
    const filteredTasks = filterTasksByName(allTasks, searchTerm);
    setTasks(filteredTasks);
  }, [searchTerm, allTasks]);

  const handleSearchChange = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
  };

  const handleViewDetail = (task) => {
    const url = getTaskDetailUrl(task);
    router.push(url);
  };

  return (
    <AssignedTaskView
      tasks={tasks}
      searchTerm={searchTerm}
      loading={loading}
      allTasks={allTasks}
      onSearchChange={handleSearchChange}
      onViewDetail={handleViewDetail}
      isTaskOverdue={isTaskOverdue}
      formatTaskDate={formatTaskDate}
    />
  );
}