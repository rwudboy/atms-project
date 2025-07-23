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
  const [delegition, setdelegition] = useState(null);
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
        const delegition = result.delegition;
        setdelegition(delegition);
        if (!isMounted) return;
        
        setTask(result || null);
        
        // Initialize file state and string state for each variable
        if (result?.VariablesTask) {
          const initialFiles = {};
          const initialStrings = {};
          const initialDownloadStates = {};
          
          Object.keys(result.VariablesTask).forEach((key) => {
            initialFiles[key] = [];
            
            // For dropdown variables, ensure the value is set
            if (isCheckVariable(key)) {
              // Use the current value or default to an empty string
              initialStrings[key] = result.VariablesTask[key].value?.toLowerCase() || "";
            } else {
              initialStrings[key] = result.VariablesTask[key].value || "";
            }
            
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

    const hasChangedDropdowns = Object.entries(variableStrings).some(
      ([key, value]) => {
        if (!isCheckVariable(key)) return false;
        const original = task?.VariablesTask?.[key]?.value?.toLowerCase() || "";
        return value !== original && value !== "";
      }
    );

    return hasFiles || hasChangedDropdowns || hasDownloadedFiles;
  };

  const handleSend = async () => {
    const hasFiles = Object.values(variableFiles).some((files) => files.length > 0);
    
    // Get all dropdown variables, regardless of whether they've changed
    const allDropdownValues = {};
    
    Object.entries(task?.VariablesTask || {}).forEach(([key, data]) => {
      if (isCheckVariable(key)) {
        // Use the current value from variableStrings, or fall back to the original value
        const currentValue = variableStrings[key] || data.value?.toLowerCase() || "";
        
        // Always include dropdown values, even if they haven't changed
        allDropdownValues[key] = { 
          type: "String", 
          value: currentValue, 
          valueInfo: {} 
        };
      }
    });

    // Log the payload for debugging
    console.log("All dropdown values to send:", allDropdownValues);
    
    const hasDropdowns = Object.keys(allDropdownValues).length > 0;
    const hasDownloads = hasDownloadedFiles;

    // Check if we have any data to send
    if (!hasFiles && !hasDropdowns && !hasDownloads) {
      toast.error("Please attach at least one file, select dropdown values, or download files");
      return;
    }

    setIsSending(true);
    try {
      const promises = [];
      
      // Handle file uploads
      if (hasFiles) {
        Object.entries(variableFiles)
          .filter(([, files]) => files.length > 0)
          .forEach(([key, files]) => {
            promises.push(sendTaskFiles(taskId, files, key));
          });
      }
      
      // Always send dropdown values if they exist
      if (hasDropdowns) {
        promises.push(sendDropdownValues(taskId, allDropdownValues));
      }

      // Process results
      const results = await Promise.all(promises);
      const success = results.find((r) => r?.user?.success || r?.success);
      
      if (success) {
        toast.success(success.user?.message || success.message || "Sent successfully");
        
        // Reset files
        setVariableFiles(Object.fromEntries(Object.keys(variableFiles).map((k) => [k, []])));
        
        // Refresh task data
        const updated = await getTaskById(taskId);
        setTask(updated || null);
        
        if (updated?.VariablesTask) {
          const newStrings = {};
          Object.keys(updated.VariablesTask).forEach((k) => {
            newStrings[k] = updated.VariablesTask[k].value || "";
          });
          setVariableStrings(newStrings);
        }
        
        router.push("/task");
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
        router.push("/task");
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
        router.push("/task");
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

  const handleNavigateBack = () => router.push("/task");
  
  const handleDelegateOpen = () => {
    setIsDelegateOpen(true);
  };

  return (
    <>
      <AssignDetailedTaskView
        task={task}
        role={role}
        delegition={delegition}
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
        instanceId={task?.InstanceId} // Pass the Instance ID
        open={isDelegateOpen}
        onOpenChange={setIsDelegateOpen}
      />
    </>
  );
}