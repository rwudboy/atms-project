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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/interface-adapters/components/ui/select";
import { X, Upload, Download } from "lucide-react";
import { toast } from "sonner";
import { getTaskById } from "@/application-business-layer/usecases/assign-task/get-detailed-task";
import { sendTaskFiles,sendDropdownValues } from "@/application-business-layer/usecases/resolve/upload";
import { UnclaimTask } from "@/application-business-layer/usecases/assign-task/unclaim-task";
import { Skeleton } from "@/interface-adapters/components/ui/skeleton";
import { Complete } from "@/application-business-layer/usecases/complete/complete";
import DelegateTaskDialog from "@/interface-adapters/components/modals/delegate/delegate-modal";

export default function AssignDetailedTask({ taskId }) {
  const router = useRouter();
  const [task, setTask] = useState(null);
  const [isDelegateOpen, setIsDelegateOpen] = useState(false);
  const [reportText, setReportText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasDownloadedFiles, setHasDownloadedFiles] = useState(false);
  const [variableFiles, setVariableFiles] = useState({});
  const [variableStrings, setVariableStrings] = useState({}); // New state for string values
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

    fetchTask();

    return () => {
      isMounted = false;
    };
  }, [taskId]);

  // Helper function to check if a variable is a "Check" type
  const isCheckVariable = (variableKey) => {
    return variableKey.toLowerCase().includes('check');
  };

  // Helper function to check if variable has files to upload or strings to send
  const hasDataToSend = () => {
    const hasFiles = Object.values(variableFiles).some((files) => files.length > 0);
    const hasStrings = Object.entries(variableStrings).some(([key, value]) => {
      const originalValue = task?.VariablesTask?.[key]?.value || "";
      return isCheckVariable(key) && value !== originalValue && value !== "";
    });
    return hasFiles || hasStrings || hasDownloadedFiles;
  };

const handleSend = async () => {
  const hasFiles = Object.values(variableFiles).some((files) => files.length > 0);
  
  // Get only the changed dropdown values (Check variables that have been modified)
  const changedDropdowns = {};
  Object.entries(variableStrings).forEach(([key, value]) => {
    const originalValue = task?.VariablesTask?.[key]?.value || "";
    if (isCheckVariable(key) && value !== originalValue && value !== "") {
      changedDropdowns[key] = value;
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

    // Handle file uploads
    if (hasFiles) {
      Object.entries(variableFiles)
        .filter(([_, files]) => files.length > 0)
        .forEach(([variableKey, files]) => {
          promises.push(sendTaskFiles(taskId, files, variableKey));
        });
    }

    // Handle dropdown values
    if (hasDropdowns) {
      promises.push(sendDropdownValues(taskId, changedDropdowns));
    }

    const results = await Promise.all(promises);

    // Handle success/error based on results
    const successResult = results.find(result => result?.user?.success || result?.success);
    if (successResult) {
      toast.success(successResult.user?.message || successResult.message || "Files and values sent successfully");

      // Reset files
      setVariableFiles(Object.fromEntries(Object.keys(variableFiles).map(k => [k, []])));
      
      // Reset dropdown values to their new values (don't clear them, just update the task)
      const updatedTask = await getTaskById(taskId);
      setTask(updatedTask || null);
      
      // Update variableStrings with the new task values
      if (updatedTask?.VariablesTask) {
        const newStrings = {};
        Object.keys(updatedTask.VariablesTask).forEach((key) => {
          newStrings[key] = updatedTask.VariablesTask[key].value || "";
        });
        setVariableStrings(newStrings);
      }

      router.push("/assignTask");
      return;
    }

    // Error handling
    const errorResult = results.find(result => result?.message);
    if (errorResult) {
      toast.error(errorResult.message);
      return;
    }

    toast.error("Some uploads failed");
  } catch (error) {
    toast.error(error?.message || "Unexpected error occurred");
  } finally {
    setIsSending(false);
  }
};

  const handleStringValueChange = (variableKey, value) => {
    setVariableStrings(prev => ({
      ...prev,
      [variableKey]: value
    }));
  };

  // ... (keep all other existing handler functions unchanged)

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPriorityLabel = (priority) => {
    if (priority >= 80) return "High";
    if (priority >= 60) return "Medium";
    return "Low";
  };

  const isTaskOverdue = (dueDate) => {
    if (!dueDate) return false;
    const now = new Date();
    const due = new Date(dueDate);
    return due < now;
  };

  const handleComplete = async () => {
    if (!taskId) return;

    setIsSending(true);
    try {
      const result = await Complete(taskId);
      
      if (result?.success) {
        toast.success(result.message || "Task completed successfully");
        router.push("/assignTask");
      } else {
        toast.error(result?.message || "Failed to complete task");
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Unexpected error occurred";
      toast.error(errorMessage);
    } finally {
      setIsSending(false);
    }
  };

  const handleUnclaim = async () => {
    if (!taskId) return;

    setIsUnclaiming(true);
    try {
      const result = await UnclaimTask(taskId);
      if (result.status) {
        toast.success(result.message || "Task unclaimed successfully");
        const updatedTask = await getTaskById(taskId);
        setTask(updatedTask || null);
        router.push(`/assignTask`);
      } else {
        toast.error(result.message || "Failed to unclaim task");
      }
    } catch (error) {
      toast.error("Unexpected error occurred while unclaiming task");
    } finally {
      setIsUnclaiming(false);
    }
  };

  const handleAttachmentClick = (variableKey) => {
    if (fileInputRefs.current[variableKey]) {
      fileInputRefs.current[variableKey]?.click();
    }
  };

  const handleFileChange = (e, variableKey) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    setVariableFiles((prev) => ({
      ...prev,
      [variableKey]: [selectedFile],
    }));

    toast.success(`Added: ${selectedFile.name} to ${formatVariableName(variableKey)}`);

    if (fileInputRefs.current[variableKey]) {
      fileInputRefs.current[variableKey].value = "";
    }
  };

  const removeFile = (variableKey) => {
    setVariableFiles((prev) => ({
      ...prev,
      [variableKey]: [],
    }));
    toast.success(`File removed from ${formatVariableName(variableKey)}`);
  };

  const handleDownload = (variableKey, value) => {
    if (!value) return;

    try {
      const fileName = value;
      const downloadUrl = `${process.env.NEXT_PUBLIC_API_URL}/inbox?fileName=${encodeURIComponent(fileName)}`;

      window.open(downloadUrl, '_blank');
      setHasDownloadedFiles(true);

      toast.success(`File ${formatVariableName(variableKey)} has been successfully downloaded`);
    } catch (error) {
      toast.error(`Failed to open file: ${error.message}`);
    }
  };

  const formatVariableName = (variableName) => {
    return variableName.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const reportValue = task?.VariablesTask?.Project_Initialization_Report?.value || "";

  return (
    <div className="container mx-auto py-10 max-w-6xl">
      {isLoading || !task ? (
        <div className="space-y-4">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => router.push("/assignTask")}
            >
              ← Back to List
            </Button>
            <div className="flex gap-2">
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => setIsDelegateOpen(true)}
              >
                Delegate
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold">
              {task.task_name || "Task Detail"}
            </h1>
            {isTaskOverdue(task.due_date) && (
              <Badge variant="destructive" className="bg-red-600">
                Overdue
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <h3 className="font-semibold text-base mb-4">Task Details</h3>
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
                  <p className="text-muted-foreground mb-1">Priority</p>
                  <Badge variant="secondary" className="w-fit">
                    {getPriorityLabel(task.priority ?? 0)}
                  </Badge>
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

          <div>
            <h3 className="font-semibold text-base mb-3">Description</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {task.description || "No description provided."}
            </p>
          </div>

          {/* Variable File Upload/Download Section */}
          {task?.VariablesTask && Object.keys(task.VariablesTask).length > 0 && (
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
                    {Object.entries(task.VariablesTask).map(([variableKey, variableData]) => (
                      <div key={variableKey} className="p-4">
                        <div className="grid grid-cols-2 gap-4 items-start">
                          <div>
                            <p className="font-medium text-sm mb-1">{formatVariableName(variableKey)}</p>
                            {variableData.value && !isCheckVariable(variableKey) && (
                              <p className="text-xs text-muted-foreground mt-1">
                                File available for download
                              </p>
                            )}
                            {isCheckVariable(variableKey) && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Current status: {variableData.value || "Not set"}
                              </p>
                            )}
                          </div>
                          <div className="space-y-3">
                            {isCheckVariable(variableKey) ? (
                              // Render dropdown for Check variables
                              <Select
                                value={variableStrings[variableKey] || ""}
                                onValueChange={(value) => handleStringValueChange(variableKey, value)}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="APPROVED">APPROVED</SelectItem>
                                  <SelectItem value="REJECTED">REJECTED</SelectItem>
                                </SelectContent>
                              </Select>
                            ) : (
                              // Render file upload/download for non-Check variables
                              <>
                                <input
                                  ref={(el) => {
                                    if (el) fileInputRefs.current[variableKey] = el;
                                  }}
                                  type="file"
                                  className="hidden"
                                  onChange={(e) => handleFileChange(e, variableKey)}
                                />

                                {/* Show download button if variable has a value */}
                                {variableData.value ? (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDownload(variableKey, variableData.value)}
                                    disabled={isDownloading[variableKey]}
                                    className="w-full"
                                  >
                                    <Download className="h-4 w-4 mr-2" />
                                    {isDownloading[variableKey] ? "Opening..." : "Download File"}
                                  </Button>
                                ) : (
                                  /* Otherwise show upload functionality */
                                  (!variableFiles[variableKey] || variableFiles[variableKey].length === 0) ? (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleAttachmentClick(variableKey)}
                                      className="w-full"
                                    >
                                      <Upload className="h-4 w-4 mr-2" />
                                      Upload File
                                    </Button>
                                  ) : (
                                    /* Show selected file for upload */
                                    <div className="flex items-center justify-between p-2 bg-muted/30 rounded-md text-xs">
                                      <span className="truncate flex-1" title={variableFiles[variableKey][0].name}>
                                        {variableFiles[variableKey][0].name}
                                      </span>
                                      <div className="flex gap-2">
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-6 w-6 p-0"
                                          onClick={() => handleAttachmentClick(variableKey)}
                                        >
                                          <Upload className="h-3 w-3" />
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-6 w-6 p-0"
                                          onClick={() => removeFile(variableKey)}
                                        >
                                          <X className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    </div>
                                  )
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

          <div>
            <h3 className="font-semibold text-base mb-4">Comments</h3>
            {Array.isArray(task.comment) && task.comment.length > 0 ? (
              <div className="space-y-4">
                {task.comment.map((comment, index) => (
                  <div key={index} className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {comment.user
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("") || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">
                          {comment.user || "Unknown"}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {comment.description || ""}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No comments</p>
            )}
          </div>
          <div className="flex justify-end pt-4 gap-2">
            {task?.delegition?.toUpperCase() === "RESOLVED" ? (
              <Button onClick={handleComplete} disabled={isSending}>
                {isSending ? "Completing..." : "Complete"}
              </Button>
            ) : (
              <Button
                onClick={handleSend}
                disabled={!hasDataToSend() || isSending}
              >
                {isSending ? "Sending..." : "Resolve"}
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