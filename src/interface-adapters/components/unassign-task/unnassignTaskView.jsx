// File: interface-adapters/components/unassign-task/UnassignTaskView.jsx
"use client";

import { Button } from "@/interface-adapters/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/interface-adapters/components/ui/card";
import { Input } from "@/interface-adapters/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/interface-adapters/components/ui/table";
import { Search, ArrowLeft } from "lucide-react";

export default function UnassignTaskView({
  tasks,
  searchTerm,
  loading,
  allTasks,
  showDetails,
  selectedTaskDetails,
  detailsLoading,
  onSearchChange,
  onViewDetail,
  onViewTaskDetail,
  onBackToList,
  isTaskOverdue,
  formatDate,
  getStatusClassName,
  getDelegationClassName
}) {
  if (showDetails) {
    return (
      <div className="container mx-auto py-10">
        <Card className="mb-6">
          <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Task Details</CardTitle>
              <CardDescription>Detailed view of tasks for the selected business key.</CardDescription>
            </div>
            <Button onClick={onBackToList} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to List
            </Button>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Task Details</CardTitle>
            <CardDescription>
              Showing {selectedTaskDetails.length} task(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task Name</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Assignee</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Delegation</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedTaskDetails.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      No task details found
                    </TableCell>
                  </TableRow>
                ) : (
                  selectedTaskDetails.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">{task.name || "Untitled"}</TableCell>
                      <TableCell>{task.owner || "—"}</TableCell>
                      <TableCell>{task.assignee || "—"}</TableCell>
                      <TableCell>{formatDate(task.created)}</TableCell>
                      <TableCell>
                        {task.due_date ? (
                          <div>
                            <div>{formatDate(task.due_date)}</div>
                            {isTaskOverdue(task.due_date) && (
                              <div className="text-sm text-red-600 font-medium mt-1">
                                Overdue
                              </div>
                            )}
                          </div>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          getDelegationClassName(task.delegation)
                        }`}>
                          {task.delegation || "—"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button onClick={() => onViewTaskDetail(task)}>
                          Detail
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="mb-6">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Unassigned Tasks</CardTitle>
            <CardDescription>View and manage your unassigned tasks.</CardDescription>
          </div>
        </CardHeader>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by task name or customer..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Available Project</CardTitle>
          <CardDescription>
            Showing {tasks.length} of {allTasks.length} tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Business Key</TableHead>
                <TableHead>Project Name</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    Loading tasks...
                  </TableCell>
                </TableRow>
              ) : tasks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No tasks found
                  </TableCell>
                </TableRow>
              ) : (
                tasks.map((task, index) => (
                  <TableRow key={task.businessKey || index}>
                    <TableCell className="font-medium">{task.businessKey || "—"}</TableCell>
                    <TableCell>{task.nama || "Untitled"}</TableCell>
                    <TableCell>{task.customer || "—"}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        getStatusClassName(task.status)
                      }`}>
                        {task.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        onClick={() => onViewDetail(task)}
                        disabled={detailsLoading}
                      >
                        {detailsLoading ? "Loading..." : "View"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}