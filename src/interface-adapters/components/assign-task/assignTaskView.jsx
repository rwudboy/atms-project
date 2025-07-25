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
import { Search, ArrowLeft, Building, Briefcase } from "lucide-react"; // Added Building and Briefcase icons
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
  const [diagramButtonLoading, setDiagramButtonLoading] = useState({});
  const [taskDetailLoading, setTaskDetailLoading] = useState({});

  // Sort tasks alphabetically by project name (nama)
  const sortedTasks = [...tasks].sort((a, b) => {
    const nameA = (a.nama || "").toLowerCase();
    const nameB = (b.nama || "").toLowerCase();
    return nameA.localeCompare(nameB);
  });

  // Get project and customer information from the first task in details
  const projectName = selectedTaskDetails[0]?.projek || "—";
  const customerName = selectedTaskDetails[0]?.customer || "—";

  // Button with notification badge component
const ButtonWithBadge = ({ children, resolve = 0, pending = 0, ...props }) => (
  <div className="relative inline-block">
    <Button {...props}>
      {children}
    </Button>

    {/* Resolve badge - green (top-left) */}
    {resolve > 0 && (
      <span className="absolute -top-2 -left-2 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold shadow">
        {resolve}
      </span>
    )}

    {/* Pending badge - red (top-right) */}
    {pending > 0 && (
      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold shadow">
        {pending}
      </span>
    )}
  </div>
);

  // Handle view diagram with loading state
  const handleViewDiagram = async (task) => {
    setDiagramButtonLoading(prev => ({ ...prev, [task.id]: true }));
    try {
      await onViewDiagram(task);
    } finally {
      setDiagramButtonLoading(prev => ({ ...prev, [task.id]: false }));
    }
  };

  // Handle task detail with loading state for route navigation
  const handleViewTaskDetail = async (task) => {
    setTaskDetailLoading(prev => ({ ...prev, [task.id]: true }));
    try {
      await onViewTaskDetail(task);
      // Note: Loading state will persist until component unmounts due to route change
      // This is intentional as user will navigate away from this page
    } catch (error) {
      // Only reset loading state if there's an error and user stays on page
      setTaskDetailLoading(prev => ({ ...prev, [task.id]: false }));
      console.error("Error navigating to task detail:", error);
    }
  };

  if (showDetails) {
    return (
      <div className="container mx-auto py-10">
        <Card className="mb-6">
          <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-2 w-full">
              <CardTitle>Task Details</CardTitle>
              <CardDescription>Details of tasks.</CardDescription>
              
              {/* Project and Customer Info Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-sm">
                <div className="flex items-center">
                  <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-muted-foreground mr-2">Project:</span>
                  <span className="font-medium">{projectName}</span>
                </div>
                <div className="flex items-center">
                  <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-muted-foreground mr-2">Customer:</span>
                  <span className="font-medium">{customerName}</span>
                </div>
              </div>
            </div>
            
            <Button onClick={onBackToList} variant="outline" className="md:self-start">
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
                          onClick={() => handleViewDiagram(task)} 
                          variant="outline"
                          disabled={diagramButtonLoading[task.id]}
                        >
                          {diagramButtonLoading[task.id] ? "Loading..." : "View Diagram"}
                        </ButtonWithBadge>
                        <ButtonWithBadge 
                          onClick={() => handleViewTaskDetail(task)} 
                          disabled={taskDetailLoading[task.id] || detailButtonLoading[task.id]}
                        >
                          {(taskDetailLoading[task.id] || detailButtonLoading[task.id]) ? "Loading..." : "Detail"}
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
          <CardTitle>Tasks</CardTitle>
          <CardDescription>View and manage your tasks.</CardDescription>
        </CardHeader>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search Project</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by project name"
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
                  
                  return (
                    <TableRow key={taskId}>
                      <TableCell className="font-medium">{task.businessKey || "—"}</TableCell>
                      <TableCell>{task.nama || "Untitled"}</TableCell>
                      <TableCell>{task.customer || "—"}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClassName(task.status)}`}>
                          {task.status ? task.status.toUpperCase() : "—"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <ButtonWithBadge 
                          onClick={() => onViewDetail(task)} 
                          disabled={isButtonLoading}
                          resolve={task.Resolve || 0}
  pending={task.pending || 0}
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