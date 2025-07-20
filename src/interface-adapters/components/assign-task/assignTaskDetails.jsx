// File: interface-adapters/components/assign-task/AssignDetailedTaskView.jsx
"use client";

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
import { Skeleton } from "@/interface-adapters/components/ui/skeleton";
import { X, Upload, Download } from "lucide-react";

export default function AssignDetailedTaskView({
  task,
  role,
  isLoading,
  hasDownloadedFiles,
  variableFiles,
  variableStrings,
  isSending,
  isDownloading,
  isUnclaiming,
  fileInputRefs,
  onNavigateBack,
  onOpenDelegate,
  onStringValueChange,
  onSend,
  onComplete,
  onUnclaim,
  onAttachmentClick,
  onFileChange,
  onRemoveFile,
  onDownload,
  formatDate,
  isTaskOverdue,
  isCheckVariable,
  hasDataToSend,
  taskId
}) {
  // Filter out null, undefined, or empty comments
  const validComments = Array.isArray(task?.comment) 
    ? task.comment.filter(c => 
        c && 
        c.description && 
        c.description.trim() !== "" && 
        c.description !== null && 
        c.description !== undefined
      )
    : [];

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
            <Button variant="outline" onClick={onNavigateBack}>
              ← Back to List
            </Button>
            {role === "MANAGER" && (
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={onOpenDelegate}>
                Delegate
              </Button>
            )}
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
                                value={
                                  variableStrings[key] || 
                                  (data.value ? data.value.toLowerCase() : "") || 
                                  ""
                                }
                                onValueChange={(v) => onStringValueChange(key, v)}
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
                                  onChange={(e) => onFileChange(e, key)}
                                />
                                {data.value ? (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full"
                                    onClick={() => onDownload(key, data.value)}
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
                                    onClick={() => onAttachmentClick(key)}
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
                                        onClick={() => onAttachmentClick(key)}
                                      >
                                        <Upload className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0"
                                        onClick={() => onRemoveFile(key)}
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
            <h3 className="font-semibold text-base mb-4">Note</h3>
            {validComments.length > 0 ? (
              <div className="space-y-4">
                {validComments.map((c, i) => (
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
              <p className="text-sm text-muted-foreground">No note from manager</p>
            )}
          </div>

          {/* Resolve / Complete Button */}
          <div className="flex justify-end pt-4 gap-2">
            {/* Case 3: Manager + non-null variables + null delegation = "Select Dropdown" */}
            {role === "MANAGER" &&
              !task?.delegition &&
              task?.VariablesTask &&
              Object.entries(task.VariablesTask).some(([key]) => key.startsWith("Check_")) ? (
              <Button onClick={onSend}>
                {isSending ? "Sending..." : "Complete"}
              </Button>
            ) : /* Case 2: Manager + RESOLVED delegation = "Complete" */
              (role === "MANAGER" && task.delegition?.toUpperCase() === "RESOLVED") ? (
                <Button onClick={onComplete} disabled={isSending}>
                  {isSending ? "Completing..." : "Complete"}
                </Button>
              ) : /* Case 1: Staff + PENDING delegation = "Resolve" (default case) */
                (
                  <Button
                    onClick={onSend}
                    disabled={!hasDataToSend() || isSending}
                  >
                    {isSending
                      ? "Sending..."
                      : role === "MANAGER"
                      ? "Complete"
                      : "Resolve"}
                  </Button>
                )
            }
          </div>
        </div>
      )}
    </div>
  );
}