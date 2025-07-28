// File: application-business-layer/assignTask/AssignDetailedTaskContainer.jsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getTaskById } from "@/framework-drivers/api/assign-task/get-detailed-task";
import {
  sendTaskFiles,
  sendDropdownValues,
} from "@/framework-drivers/api/resolve/upload";
import { UnclaimTask } from "@/framework-drivers/api/assign-task/unclaim-task";
import { Complete } from "@/framework-drivers/api/complete/complete";
import AssignDetailedTaskView from "@/interface-adapters/components/assign-task/assignTaskDetails";
import DelegateTaskDialog from "@/interface-adapters/components/modals/delegate/delegate-modal";
import { useAuth } from "@/interface-adapters/context/AuthContext";

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
  const { user, loading: authLoading } = useAuth();

  const [task, setTask] = useState(null);
  const [role, setRole] = useState(null);
  const [delegition, setDelegition] = useState(null);
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

  useEffect(() => {
    let isMounted = true;

    const fetchTaskAndSetRole = async () => {
      if (!taskId) {
        if (isMounted) setIsLoading(false);
        return;
      }

      if (user) {
        const userRoles = user.role || [];
        setRole(userRoles.toUpperCase());
      }

      try {
        setIsLoading(true);
        const result = await getTaskById(taskId);
        const delegationData = result.delegition;
        if (!isMounted) return;

        setDelegition(delegationData);
        setTask(result || null);

        if (result?.VariablesTask) {
          const initialFiles = {};
          const initialStrings = {};
          const initialDownloadStates = {};

          Object.keys(result.VariablesTask).forEach((key) => {
            initialFiles[key] = [];

            if (isCheckVariable(key)) {
              initialStrings[key] =
                result.VariablesTask[key].value?.toLowerCase() || "";
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

    if (!authLoading) {
      fetchTaskAndSetRole();
    }

    return () => {
      isMounted = false;
    };
  }, [taskId, user, authLoading]);

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
    const hasFiles = Object.values(variableFiles).some(
      (files) => files.length > 0
    );

    const allDropdownValues = {};

    Object.entries(task?.VariablesTask || {}).forEach(([key, data]) => {
      if (isCheckVariable(key)) {
        const currentValue =
          variableStrings[key] || data.value?.toLowerCase() || "";

        allDropdownValues[key] = {
          type: "String",
          value: currentValue,
          valueInfo: {},
        };
      }
    });

    console.log("All dropdown values to send:", allDropdownValues);

    const hasDropdowns = Object.keys(allDropdownValues).length > 0;
    const hasDownloads = hasDownloadedFiles;

    if (!hasFiles && !hasDropdowns && !hasDownloads) {
      toast.error(
        "Please attach at least one file, select dropdown values, or download files"
      );
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
        promises.push(sendDropdownValues(taskId, allDropdownValues));
      }

      const results = await Promise.all(promises);
      const success = results.find((r) => r?.user?.success || r?.success);

      if (success) {
        toast.success(success.user?.message || success.message || "Sent successfully");

        setVariableFiles(
          Object.fromEntries(Object.keys(variableFiles).map((k) => [k, []]))
        );

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
    const url = `${process.env.NEXT_PUBLIC_API_URL}/inbox?fileName=${encodeURIComponent(
      val
    )}`;
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
        instanceId={task?.InstanceId}
        open={isDelegateOpen}
        onOpenChange={setIsDelegateOpen}
      />
    </>
  );
}