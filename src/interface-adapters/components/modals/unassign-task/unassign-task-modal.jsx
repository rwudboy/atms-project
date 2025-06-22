"use client";

import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/interface-adapters/components/ui/dialog";
import { Button } from "@/interface-adapters/components/ui/button";
import { Badge } from "@/interface-adapters/components/ui/badge";
import { Separator } from "@/interface-adapters/components/ui/separator";
import { Calendar, Clock, User, AlertCircle } from "lucide-react";
import { getTaskById } from "@/interface-adapters/usecases/unassign-task/get-task-by-id";
import { Skeleton } from "@/interface-adapters/components/ui/skeleton";

export default function TaskModal({ isOpen, onClose, taskId, onClaim }) {
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(false);

    const formatDate = (dateString) =>
        new Date(dateString).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });

    const getPriorityColor = (priority) => {
        if (priority >= 80) return "destructive";
        if (priority >= 60) return "default";
        return "secondary";
    };

    const getPriorityLabel = (priority) => {
        if (priority >= 80) return "High";
        if (priority >= 60) return "Medium";
        return "Low";
    };

    useEffect(() => {
        if (!taskId || !isOpen) return;
        const fetchTask = async () => {
            setLoading(true);
            const detail = await getTaskById(taskId);
            setTask(detail);
            setLoading(false);
        };
        fetchTask();
    }, [taskId, isOpen]);

    if (!taskId) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5" />
                        Task Details
                    </DialogTitle>
                    <DialogDescription>
                        Complete information about {task.task_name}
                    </DialogDescription>
                </DialogHeader>

                {loading ? (
                    <div className="space-y-4">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-20" />
                    </div>
                ) : task ? (
                    <div className="space-y-6">
                        <div className="flex justify-between items-start">
                            <h2 className="text-lg font-semibold">{task.task_name}</h2>
                            <Badge variant={getPriorityColor(task.priority ?? 0)}>
                                {getPriorityLabel(task.priority ?? 0)} Priority
                            </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="font-medium">Assignee</p>
                                    <p className="text-muted-foreground">
                                        {task.assignee || "Unassigned"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="font-medium">Due Date</p>
                                    <p className="text-muted-foreground">
                                        {task.due_date ? formatDate(task.due_date) : "—"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="font-medium">Created</p>
                                    <p className="text-muted-foreground">
                                        {task.created ? formatDate(task.created) : "—"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <AlertCircle className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="font-medium">Priority Score</p>
                                    <p className="text-muted-foreground">
                                        {task.priority ?? 0}/100
                                    </p>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        <div>
                            <p className="font-medium mb-2">Description</p>
                            <p className="text-muted-foreground">
                                {task.description || "No description"}
                            </p>
                        </div>

                        <div>
                            <p className="font-medium mb-2">Comments</p>
                            {Array.isArray(task.comment) && task.comment.length > 0 ? (
                                <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                                    {task.comment.map((cmt, index) => (
                                        <li key={index}>{cmt}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-muted-foreground">No comment</p>
                            )}

                        </div>

                    </div>
                ) : (
                    <p className="text-sm text-red-500">Task not found</p>
                )}

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Close
                    </Button>
                    {!loading && task && (
                        <Button onClick={() => onClaim(task.task_name)}>Claim</Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
