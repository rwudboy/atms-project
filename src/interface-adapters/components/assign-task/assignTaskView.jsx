"use client";

import { Button } from "@/interface-adapters/components/ui/button";
import { Badge } from "@/interface-adapters/components/ui/badge";
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
import { Search } from "lucide-react";

export default function AssignedTaskView({
  tasks,
  searchTerm,
  loading,
  allTasks,
  onSearchChange,
  onViewDetail,
  isTaskOverdue,
  formatTaskDate,
}) {
  return (
    <div className="container mx-auto py-10">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Assigned Task List</CardTitle>
          <CardDescription>View your currently assigned tasks.</CardDescription>
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
              placeholder="Search by task name..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Assigned Tasks</CardTitle>
          <CardDescription>
            Showing {tasks.length} of {allTasks.length} tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Due Date</TableHead>
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
                tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">
                      {task.name || "Untitled"}
                    </TableCell>
                    <TableCell>{task.assignee || "—"}</TableCell>
                    <TableCell>
                      {formatTaskDate(task.created)}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>
                          {formatTaskDate(task.due_date)}
                        </span>
                        {isTaskOverdue(task.due_date) && (
                          <Badge
                            variant="destructive"
                            className="bg-red-600 text-xs mt-1 w-fit"
                          >
                            Overdue
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button onClick={() => onViewDetail(task)}>
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