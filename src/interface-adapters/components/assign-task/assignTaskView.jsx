"use client";

import { useState } from "react";
import { Button } from "@/interface-adapters/components/ui/button";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from "@/interface-adapters/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/interface-adapters/components/ui/table";
import { Input } from "@/interface-adapters/components/ui/input";
import { Search, ArrowLeft } from "lucide-react";
import DiagramModal from "@/interface-adapters/components/modals/unassignTask/diagram-modal";

export default function AssignTaskView({
  tasks,
  searchTerm,
  loading,
  allTasks,
  showDetails,
  setIsDiagramModalOpen,
  selectedTaskDetails,
  detailsLoading,
  onSearchChange,
  onViewDetail,
  onViewTaskDetail,
  onBackToList,
  onViewDiagram,
  isDiagramModalOpen,
  diagramData,
  diagramLoading,
  onCloseModal,
  isTaskOverdue,
  formatDate,
  selectedTaskForDiagram,
  getStatusClassName,
  getDelegationClassName,
  viewButtonLoading = {},
  detailButtonLoading = {},
}) {
  // Sort tasks alphabetically by project name (nama)
  const sortedTasks = [...tasks].sort((a, b) => {
    const nameA = (a.nama || "").toLowerCase();
    const nameB = (b.nama || "").toLowerCase();
    return nameA.localeCompare(nameB);
  });

  // Button with notification badge component
  const ButtonWithBadge = ({ children, notificationCount, ...props }) => (
    <div className="relative inline-block">
      <Button {...props}>
        {children}
      </Button>
      {notificationCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
          {notificationCount}
        </span>
      )}
    </div>
  );

  if (showDetails) {
    return (
      <div className="container mx-auto py-10">
        <Card className="mb-6">
          <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Task Details</CardTitle>
              <CardDescription>Details of tasks under the selected business key.</CardDescription>
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
            <CardDescription>{selectedTaskDetails.length} task(s)</CardDescription>
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
                              <div className="text-sm text-red-600 font-medium mt-1">Overdue</div>
                            )}
                          </div>
                        ) : "—"}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDelegationClassName(task.delegation)}`}>
                          {task.delegation || "—"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <ButtonWithBadge 
                          onClick={() => onViewDiagram(task)} 
                          variant="outline"
                          notificationCount={task.Resolve || task.resolve || 0}
                        >
                          View Diagram
                        </ButtonWithBadge>
                        <ButtonWithBadge 
                          onClick={() => onViewTaskDetail(task)} 
                          disabled={detailButtonLoading[task.id]}
                          notificationCount={task.Resolve || task.resolve || 0}
                        >
                          {detailButtonLoading[task.id] ? "Loading..." : "Detail"}
                        </ButtonWithBadge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <DiagramModal
          isOpen={isDiagramModalOpen}
          onClose={onCloseModal}
          responseData={diagramData}
          loading={diagramLoading}
          task={selectedTaskForDiagram}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Assign Tasks</CardTitle>
          <CardDescription>View and manage your assign tasks.</CardDescription>
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
          <CardDescription>Showing {sortedTasks.length} of {allTasks.length} tasks</CardDescription>
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
                  <TableCell colSpan={5} className="text-center py-4">Loading tasks...</TableCell>
                </TableRow>
              ) : sortedTasks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">No tasks found</TableCell>
                </TableRow>
              ) : (
                sortedTasks.map((task, index) => {
                  const taskId = task.businessKey || index;
                  const isButtonLoading = viewButtonLoading[taskId];
                  const resolveCount = task.Resolve || task.resolve || 0;
                  
                  return (
                    <TableRow key={taskId}>
                      <TableCell className="font-medium">{task.businessKey || "—"}</TableCell>
                      <TableCell>{task.nama || "Untitled"}</TableCell>
                      <TableCell>{task.customer || "—"}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClassName(task.status)}`}>
                          {task.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <ButtonWithBadge 
                          onClick={() => onViewDetail(task)} 
                          disabled={isButtonLoading}
                          notificationCount={resolveCount}
                        >
                          {isButtonLoading ? "Loading..." : "View"}
                        </ButtonWithBadge>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}