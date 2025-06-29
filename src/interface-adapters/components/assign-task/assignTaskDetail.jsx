"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/interface-adapters/components/ui/button";
import { Badge } from "@/interface-adapters/components/ui/badge";
import { Textarea } from "@/interface-adapters/components/ui/textarea";
import { Separator } from "@/interface-adapters/components/ui/separator";
import { Avatar, AvatarFallback } from "@/interface-adapters/components/ui/avatar";
import { Paperclip, X } from "lucide-react";
import { toast } from "sonner";
import { getTaskById } from "@/interface-adapters/usecases/assign-task/get-detailed-task";
import { sendTaskFiles } from "@/interface-adapters/usecases/assign-task/post-task";
import { UnclaimTask } from "@/interface-adapters/usecases/assign-task/unclaim-task"; // Add this import
import { Skeleton } from "@/interface-adapters/components/ui/skeleton";
import DelegateTaskDialog from "@/interface-adapters/components/modals/delegate/delegate-modal";

export default function AssignDetailedTask({ taskId }) {
  const router = useRouter();
  const [task, setTask] = useState(null);
  const [isDelegateOpen, setIsDelegateOpen] = useState(false);
  const [reportText, setReportText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [isUnclaiming, setIsUnclaiming] = useState(false); // Add loading state for unclaim
  const fileInputRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const fetchTask = async () => {
      if (!taskId) return;
      setIsLoading(true);
      const result = await getTaskById(taskId);
      if (isMounted) {
        setTask(result || null);
        setIsLoading(false);
      }
    };

    fetchTask();

    return () => {
      isMounted = false;
    };
  }, [taskId]);

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

  // Add unclaim handler
  const handleUnclaim = async () => {
    if (!taskId) return;
    
    setIsUnclaiming(true);
    try {
      const result = await UnclaimTask(taskId);
      
      if (result.status) {
        toast.success(result.message || "Task unclaimed successfully");
        // Refresh task data after successful unclaim
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

  const handleSend = async () => {
    if (files.length === 0) {
      toast.error("Please attach at least one file");
      return;
    }

    const variables = task?.VariablesTask || {};
    const firstVariableKey = Object.keys(variables)[0];

    if (!firstVariableKey) {
      toast.error("No variable field found in task data");
      return;
    }

    setIsSending(true);
    try {
      const result = await sendTaskFiles(taskId, files, firstVariableKey);

      if (result?.success) {
        toast.success(result.message || "Files sent successfully");
        setFiles([]);
      } else {
        toast.error(result.message || "Failed to send files");
      }
    } catch (error) {
      toast.error("Unexpected error occurred");
    } finally {
      setIsSending(false);
    }
  };

  const handleAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    const newFiles = [...files, ...selectedFiles];
    setFiles(newFiles);

    if (selectedFiles.length === 1) {
      toast.success(`Added: ${selectedFiles[0].name}`);
    } else {
      toast.success(`Added ${selectedFiles.length} files`);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (indexToRemove) => {
    const newFiles = files.filter((_, index) => index !== indexToRemove);
    setFiles(newFiles);
    toast.success("File removed");
  };

  const isAttachmentRequired =
    task?.VariablesTask?.requireDocument?.value !== undefined;

  const reportValue =
    task?.VariablesTask?.Requirement_Specification_Report?.value || "";

  const isTaskAssigned = task?.assignee && task.assignee !== "Unassigned";

  return (
    <div className="container mx-auto py-10">
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
            <Button variant="outline" onClick={() => router.push("/assignTask")}>
              ← Back to List
            </Button>
            <div className="flex gap-2">
              {/* Add Unclaim button - only show if task is assigned */}
              {isTaskAssigned && (
                <Button
                  size="sm"
                  variant="outline"
                  className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                  onClick={handleUnclaim}
                  disabled={isUnclaiming}
                >
                  {isUnclaiming ? "Unclaiming..." : "Unclaim"}
                </Button>
              )}
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => setIsDelegateOpen(true)}
              >
                Delegate
              </Button>
            </div>
          </div>

          <div>
            <h1 className="text-xl font-semibold">{task.task_name || "Task Detail"}</h1>
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
                  <p className="font-medium">{formatDate(task.due_date)}</p>
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

            <div className="space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                multiple
                onChange={handleFileChange}
                disabled={!isAttachmentRequired}
              />
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={handleAttachmentClick}
                disabled={!isAttachmentRequired}
              >
                <Paperclip className="h-4 w-4 mr-2" />
                Add Attachment ({files.length})
              </Button>

              {files.length > 0 && (
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-md text-xs"
                    >
                      <span className="truncate flex-1">{file.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 ml-2"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold text-base mb-3">Description</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {task.description || "No description provided."}
            </p>
          </div>

          {reportValue && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold text-base mb-3">Report from Variables</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {reportValue}
                </p>
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
                        {comment.author?.split(" ").map((n) => n[0]).join("") || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">
                          {comment.author || "Unknown"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {comment.time || "—"}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {comment.content || ""}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No comments</p>
            )}
          </div>

          <div className="flex justify-end pt-4">
            <Button
              variant="secondary"
              onClick={handleSend}
              disabled={files.length === 0 || isSending}
            >
              {isSending ? "Sending..." : "Send"}
            </Button>
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