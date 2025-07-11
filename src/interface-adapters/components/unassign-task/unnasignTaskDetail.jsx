"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/interface-adapters/components/ui/button";
import { Badge } from "@/interface-adapters/components/ui/badge";
import { Textarea } from "@/interface-adapters/components/ui/textarea";
import { Separator } from "@/interface-adapters/components/ui/separator";
import { Avatar, AvatarFallback } from "@/interface-adapters/components/ui/avatar";
import { Paperclip } from "lucide-react";
import { toast } from "sonner";
import { getTaskById } from "@/application-business-layer/usecases/unassign-task/get-task-by-id";
import { ClaimTask } from "@/application-business-layer/usecases/unassign-task/claim-task";
import { Skeleton } from "@/interface-adapters/components/ui/skeleton";

export default function UnassignDetailedTask({ taskId }) {
  const router = useRouter();
  const [task, setTask] = useState(null);
  const [reportText, setReportText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      if (!taskId) return;
      setIsLoading(true);
      const result = await getTaskById(taskId);
      setTask(result);
      setIsLoading(false);
    };
    fetchTask();
  }, [taskId]);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
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

  const handleClaim = async () => {
    const result = await ClaimTask(taskId);
    if (result.status) {
      toast.success(`Task "${task.task_name}" successfully claimed!`);
      router.push("/unassignTask"); // navigate back to the list
    } else {
      toast.error(result.message || "Failed to claim task.");
    }
  };

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
          {/* Back Button */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => router.push("/unassignTask")}
            >
              ← Back to List
            </Button>
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
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold text-base mb-3">Description</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {task.description || "No description provided."}
            </p>
          </div>

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
                        <span className="text-xs text-muted-foreground">
                          {/* No time field provided in API */}
                          -
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

          <div className="flex justify-end pt-4">
            <Button variant="secondary" onClick={handleClaim}>
              Claim
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
