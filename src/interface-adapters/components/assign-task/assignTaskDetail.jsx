"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/interface-adapters/components/ui/button";
import { Badge } from "@/interface-adapters/components/ui/badge";
import { Separator } from "@/interface-adapters/components/ui/separator";
import {
  Avatar,
  AvatarFallback,
} from "@/interface-adapters/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/interface-adapters/components/ui/select";
import { X, Upload, Download } from "lucide-react";
import { toast } from "sonner";
import { getTaskById } from "@/application-business-layer/usecases/assign-task/get-detailed-task";
import {
  sendTaskFiles,
  sendDropdownValues,
} from "@/application-business-layer/usecases/resolve/upload";
import { getUserDetail } from "@/application-business-layer/usecases/token/getUserDetail";
import { UnclaimTask } from "@/application-business-layer/usecases/assign-task/unclaim-task";
import { Skeleton } from "@/interface-adapters/components/ui/skeleton";
import { Complete } from "@/application-business-layer/usecases/complete/complete";
import DelegateTaskDialog from "@/interface-adapters/components/modals/delegate/delegate-modal";

export default function AssignDetailedTask({ taskId }) {
  const router = useRouter();

  const [task, setTask] = useState(null);
  const [role, setRole] = useState(null);
  const [isDelegateOpen, setIsDelegateOpen] = useState(false);
  const [reportText, setReportText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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
      if (!taskId) return;
      setIsLoading(true);
      const result = await getTaskById(taskId);
      if (isMounted) {
        setTask(result || null);
        setIsLoading(false);

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
      }
    };

    const fetchRole = async () => {
      try {
        const { data } = await getUserDetail();
        const user = data.user;
        const roles = user?.role || [];
        const selectedRole = roles[0] || "guest";
        // Normalize role to uppercase
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

  const isCheckVariable = (variableKey) =>
    variableKey.toLowerCase().includes("check");

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

  return (
    <div className="container mx-auto py-10 max-w-6xl">
      {(isLoading || !task || role === null) && (
        <div className="space-y-4">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      )}

      {!isLoading && task && role !== null && (
        <div className="space-y-6">
          {/* Back & Delegate */}
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => router.push("/assignTask")}>
              ← Back to List
            </Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => setIsDelegateOpen(true)}>
              Delegate
            </Button>
          </div>

          {/* Title & Overdue Badge */}
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold">{task.task_name || "Task Detail"}</h1>
            {isTaskOverdue(task.due_date) && (
              <Badge variant="destructive" className="bg-red-600">
                Overdue
              </Badge>
            )}
          </div>

          {/* Task Info */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Task name</p>
                  <p className="font-medium">{task.task_name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Assigned to</p>
                  <p className="font-medium">{task.assignee || "Unassigned"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Due date</p>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{formatDate(task.due_date)}</p>
                    {isTaskOverdue(task.due_date) && (
                      <Badge variant="destructive" className="text-xs bg-red-600">
                        Overdue
                      </Badge>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Definition ID</p>
                  <p className="font-medium">{task.DefinitionId}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Instance ID</p>
                  <p className="font-medium">{task.InstanceId}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div>
            <h3 className="font-semibold text-base mb-3">Description</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {task.description || "No description provided."}
            </p>
          </div>

          {/* Required Documents */}
          {task.VariablesTask && Object.keys(task.VariablesTask).length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold text-base mb-4">Required Documents</h3>
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-muted/50 px-4 py-3 border-b">
                    <div className="grid grid-cols-2 gap-4 font-medium text-sm">
                      <span>Document</span>
                      <span>Actions</span>
                    </div>
                  </div>
                  <div className="divide-y">
                    {Object.entries(task.VariablesTask).map(([key, data]) => (
                      <div key={key} className="p-4">
                        <div className="grid grid-cols-2 gap-4 items-start">
                          <div>
                            <p className="font-medium text-sm mb-1">{key.replace(/_/g, " ")}</p>
                            {!isCheckVariable(key) && data.value && (
                              <p className="text-xs text-muted-foreground mt-1">
                                File available for download
                              </p>
                            )}
                            {isCheckVariable(key) && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Current status: {data.value || "Not set"}
                              </p>
                            )}
                          </div>
                          <div className="space-y-3">
                            {isCheckVariable(key) ? (
                              <Select
                                value={variableStrings[key] || ""}
                                onValueChange={(v) => handleStringValueChange(key, v)}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="approved">APPROVED</SelectItem>
                                  <SelectItem value="rejected">REJECTED</SelectItem>
                                </SelectContent>
                              </Select>
                            ) : (
                              <>
                                <input
                                  ref={(el) => (fileInputRefs.current[key] = el)}
                                  type="file"
                                  className="hidden"
                                  onChange={(e) => handleFileChange(e, key)}
                                />
                                {data.value ? (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full"
                                    onClick={() => handleDownload(key, data.value)}
                                    disabled={isDownloading[key]}
                                  >
                                    <Download className="h-4 w-4 mr-2" />
                                    {isDownloading[key] ? "Opening..." : "Download File"}
                                  </Button>
                                ) : !variableFiles[key]?.length ? (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full"
                                    onClick={() => handleAttachmentClick(key)}
                                  >
                                    <Upload className="h-4 w-4 mr-2" />
                                    Upload File
                                  </Button>
                                ) : (
                                  <div className="flex items-center justify-between p-2 bg-muted/30 rounded-md text-xs">
                                    <span className="truncate flex-1" title={variableFiles[key][0].name}>
                                      {variableFiles[key][0].name}
                                    </span>
                                    <div className="flex gap-2">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0"
                                        onClick={() => handleAttachmentClick(key)}
                                      >
                                        <Upload className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0"
                                        onClick={() => removeFile(key)}
                                      >
                                        <X className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Comments */}
          <div>
            <h3 className="font-semibold text-base mb-4">Comments</h3>
            {Array.isArray(task.comment) && task.comment.length > 0 ? (
              <div className="space-y-4">
                {task.comment.map((c, i) => (
                  <div key={i} className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {c.user
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("") || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{c.user || "Unknown"}</span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {c.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No comments</p>
            )}
          </div>

          {/* Resolve / Complete Button */}
          <div className="flex justify-end pt-4 gap-2">
            {task.delegition?.toUpperCase() === "RESOLVED" ? (
              <Button onClick={handleComplete} disabled={isSending}>
                {isSending ? "Completing..." : "Complete"}
              </Button>
            ) : (
              <Button onClick={handleSend} disabled={!hasDataToSend() || isSending}>
                {isSending
                  ? "Sending..."
                  : role === "MANAGER"
                    ? "Complete"
                    : "Resolve"}
              </Button>
            )}
          </div>
        </div>
      )}

      <DelegateTaskDialog
        taskId={taskId}
        open={isDelegateOpen}
        onOpenChange={setIsDelegateOpen}
      />
    </div>
  );
}