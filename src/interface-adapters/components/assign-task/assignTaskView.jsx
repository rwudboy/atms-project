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
import { Badge } from "@/interface-adapters/components/ui/badge";
import { Search, Eye } from "lucide-react";
import { Pagination, PaginationInfo } from "@/interface-adapters/components/ui/pagination";
import DiagramModal from "@/interface-adapters/components/modals/unassignTask/diagram-modal";

export default function AssignedTaskView({
  tasks,
  searchTerm,
  loading,
  currentPage,
  totalPages,
  totalItems,
  onSearchChange,
  onPageChange,
  onViewDetail,
  onViewDiagram,
  isDiagramModalOpen,
  diagramData,
  diagramLoading,
  onCloseModal,
  isTaskOverdue,
  formatTaskDate,
}) {
  return (
    <div className="container mx-auto py-10">
      <Card className="mb-6">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Assigned Tasks</CardTitle>
            <CardDescription>View and manage your assigned tasks.</CardDescription>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Task List</CardTitle>
          <PaginationInfo 
            currentPage={currentPage}
            pageSize={5}
            totalItems={totalItems}
          />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task Name</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : tasks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4">
                    No tasks found
                  </TableCell>
                </TableRow>
              ) : (
                tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">{task.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {formatTaskDate(task.due_date)}
                        {isTaskOverdue(task.due_date) && (
                          <Badge variant="destructive" className="text-xs">
                            Overdue
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewDiagram(task)}
                        disabled={diagramLoading}
                      >
                        {diagramLoading ? "Loading..." : "View Diagram"}
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onViewDetail(task)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          
          {/* Pagination Controls */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            className="mt-4"
          />
        </CardContent>
      </Card>

      {/* Diagram Modal */}
      <DiagramModal
        isOpen={isDiagramModalOpen}
        onClose={onCloseModal}
        responseData={diagramData}
        loading={diagramLoading}
      />
    </div>
  );
}