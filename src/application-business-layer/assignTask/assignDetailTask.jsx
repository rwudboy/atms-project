// File: application-business-layer/assignTask/AssignDetailedTaskContainer.jsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getTaskById } from "@/application-business-layer/usecases/assign-task/get-detailed-task";
import {
  sendTaskFiles,
  sendDropdownValues,
} from "@/application-business-layer/usecases/resolve/upload";
import { getUserDetail } from "@/application-business-layer/usecases/token/getUserDetail";
import { UnclaimTask } from "@/application-business-layer/usecases/assign-task/unclaim-task";
import { Complete } from "@/application-business-layer/usecases/complete/complete";
import AssignDetailedTaskView from "@/interface-adapters/components/assign-task/assignTaskDetails";
import DelegateTaskDialog from "@/interface-adapters/components/modals/delegate/delegate-modal";

// Business logic functions
const isCheckVariable = (variableKey) =>
  variableKey?.toLowerCase().includes("check");

const formatDate = (dStr) =>
  dStr
    ? new Date(dStr).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

const isTaskOverdue = (due) => (due ? new Date(due) < new Date() : false);

export default function AssignDetailedTaskContainer({ taskId }) {
  
  const router = useRouter();
  const [task, setTask] = useState(null);
  const [role, setRole] = useState(null);
  const [isDelegateOpen, setIsDelegateOpen] = useState(false);
  const [reportText, setReportText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [hasDownloadedFiles, setHasDownloadedFiles] = useState(false);
  const [variableFiles, setVariableFiles] = useState({});
  const [variableStrings, setVariableStrings] = useState({});
  const [isSending, setIsSending] = useState(false);
  const [isDownloading, setIsDownloading] = useState({});
  const [isUnclaiming, setIsUnclaiming] = useState(false);

  const fileInputRefs = useRef({});
  const downloadLinkRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const fetchTask = async () => {
      if (!taskId) {
        return;
      }
      
      try {
        setIsLoading(true);
        const result = await getTaskById(taskId);
        
        if (!isMounted) return;
        
        setTask(result || null);
        
        // Initialize file state and string state for each variable
        if (result?.VariablesTask) {
          const initialFiles = {};
          const initialStrings = {};
          const initialDownloadStates = {};
          
          Object.keys(result.VariablesTask).forEach((key) => {
            initialFiles[key] = [];
            initialStrings[key] = result.VariablesTask[key].value || "";
            initialDownloadStates[key] = false;
          });
          
          setVariableFiles(initialFiles);
          setVariableStrings(initialStrings);
          setIsDownloading(initialDownloadStates);
        }
      } catch (error) {
        console.error("Error fetching task:", error);
        toast.error("Failed to load task details");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    const fetchRole = async () => {
      try {
        const { data } = await getUserDetail();
        const user = data.user;
        const roles = user?.role || [];
        const selectedRole = roles[0] || "guest";
        const capitalizedRole = selectedRole.toUpperCase();
        
        if (isMounted) {
          setRole(capitalizedRole);
        }
      } catch (error) {
        console.error("Error fetching user detail:", error);
      }
    };

    fetchTask();
    fetchRole();

    return () => {
      isMounted = false;
    };
  }, [taskId]);

  const hasDataToSend = () => {
    const hasFiles = Object.values(variableFiles).some(
      (files) => files.length > 0
    );
    const hasStrings = Object.entries(variableStrings).some(
      ([key, value]) => {
        const original = task?.VariablesTask?.[key]?.value || "";
        return isCheckVariable(key) && value !== original && value !== "";
      }
    );
    return hasFiles || hasStrings || hasDownloadedFiles;
  };

  const handleSend = async () => {
    const hasFiles = Object.values(variableFiles).some((files) => files.length > 0);
    const changedDropdowns = {};

    Object.entries(variableStrings).forEach(([key, value]) => {
      const original = task?.VariablesTask?.[key]?.value || "";
      if (isCheckVariable(key) && value !== original && value !== "") {
        changedDropdowns[key] = { type: "String", value: value, valueInfo: {} };
      }
    });

    const hasDropdowns = Object.keys(changedDropdowns).length > 0;

    if (!hasFiles && !hasDropdowns && !hasDownloadedFiles) {
      toast.error("Please attach at least one file, select dropdown values, or download files");
      return;
    }

    setIsSending(true);
    try {
      const promises = [];
      if (hasFiles) {
        Object.entries(variableFiles)
          .filter(([, files]) => files.length > 0)
          .forEach(([key, files]) => {
            promises.push(sendTaskFiles(taskId, files, key));
          });
      }
      if (hasDropdowns) {
        promises.push(sendDropdownValues(taskId, changedDropdowns));
      }

      const results = await Promise.all(promises);
      const success = results.find((r) => r?.user?.success || r?.success);
      if (success) {
        toast.success(success.user?.message || success.message || "Sent successfully");
        setVariableFiles(Object.fromEntries(Object.keys(variableFiles).map((k) => [k, []])));
        const updated = await getTaskById(taskId);
        setTask(updated || null);
        if (updated?.VariablesTask) {
          const newStrings = {};
          Object.keys(updated.VariablesTask).forEach((k) => {
            newStrings[k] = updated.VariablesTask[k].value || "";
          });
          setVariableStrings(newStrings);
        }
        router.push("/assignTask");
        return;
      }
      const err = results.find((r) => r?.message);
      if (err) {
        toast.error(err.message);
        return;
      }
      toast.error("Some uploads failed");
    } catch (e) {
      toast.error(e?.message || "Unexpected error occurred");
    } finally {
      setIsSending(false);
    }
  };

  const handleStringValueChange = (key, value) => {
    setVariableStrings((prev) => ({ ...prev, [key]: value }));
  };

  const handleComplete = async () => {
    setIsSending(true);
    try {
      const result = await Complete(taskId);
      if (result?.success) {
        toast.success(result.message || "Task completed successfully");
        router.push("/assignTask");
      } else {
        toast.error(result.message || "Failed to complete task");
      }
    } catch (e) {
      toast.error(e?.response?.data?.message || "Unexpected error");
    } finally {
      setIsSending(false);
    }
  };

  const handleUnclaim = async () => {
    setIsUnclaiming(true);
    try {
      const result = await UnclaimTask(taskId);
      if (result.status) {
        toast.success(result.message || "Task unclaimed successfully");
        const updated = await getTaskById(taskId);
        setTask(updated || null);
        router.push("/assignTask");
      } else {
        toast.error(result.message || "Failed to unclaim task");
      }
    } catch (e) {
      toast.error("Unexpected error while unclaiming task");
    } finally {
      setIsUnclaiming(false);
    }
  };

  const handleAttachmentClick = (key) => fileInputRefs.current[key]?.click();

  const handleFileChange = (e, key) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setVariableFiles((prev) => ({ ...prev, [key]: [file] }));
    toast.success(`Added: ${file.name} to ${key.replace(/_/g, " ")}`);
    fileInputRefs.current[key].value = "";
  };

  const removeFile = (key) => {
    setVariableFiles((prev) => ({ ...prev, [key]: [] }));
    toast.success(`File removed from ${key.replace(/_/g, " ")}`);
  };

  const handleDownload = (key, val) => {
    if (!val) return;
    const url = `${process.env.NEXT_PUBLIC_API_URL}/inbox?fileName=${encodeURIComponent(val)}`;
    window.open(url, "_blank");
    setHasDownloadedFiles(true);
    toast.success(`Downloaded ${key.replace(/_/g, " ")}`);
  };

  const handleNavigateBack = () => router.push("/assignTask");
  
  const handleDelegateOpen = () => setIsDelegateOpen(true);

  return (
    <>
      <AssignDetailedTaskView
        task={task}
        role={role}
        isLoading={isLoading}
        hasDownloadedFiles={hasDownloadedFiles}
        variableFiles={variableFiles}
        variableStrings={variableStrings}
        isSending={isSending}
        isDownloading={isDownloading}
        isUnclaiming={isUnclaiming}
        fileInputRefs={fileInputRefs}
        onNavigateBack={handleNavigateBack}
        onOpenDelegate={handleDelegateOpen}
        onStringValueChange={handleStringValueChange}
        onSend={handleSend}
        onComplete={handleComplete}
        onUnclaim={handleUnclaim}
        onAttachmentClick={handleAttachmentClick}
        onFileChange={handleFileChange}
        onRemoveFile={removeFile}
        onDownload={handleDownload}
        formatDate={formatDate}
        isTaskOverdue={isTaskOverdue}
        isCheckVariable={isCheckVariable}
        hasDataToSend={hasDataToSend}
      />

      <DelegateTaskDialog
        taskId={taskId}
        open={isDelegateOpen}
        onOpenChange={setIsDelegateOpen}
      />
    </>
  );
}