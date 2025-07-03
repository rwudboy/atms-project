"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { toast } from "sonner";
import { getTasks } from "@/interface-adapters/usecases/unassign-task/get-task";
import { getTaskByBusinessKey } from "@/interface-adapters/usecases/unassign-task/get-task-by-bk";

export default function UnassignTaskPage() {
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [allTasks, setAllTasks] = useState([]);
  const [selectedTaskDetails, setSelectedTaskDetails] = useState([]);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const result = await getTasks();
        const taskData = Array.isArray(result)
          ? result
          : Array.isArray(result.data)
            ? result.data
            : [];
        setAllTasks(taskData);
        setTasks(taskData);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        toast.error("Failed to fetch task list.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setTasks(allTasks);
      return;
    }

    const lower = searchTerm.toLowerCase();
    const filtered = allTasks.filter((task) =>
      task.nama?.toLowerCase().includes(lower) ||
      task.customer?.toLowerCase().includes(lower)
    );

    setTasks(filtered);
  }, [searchTerm, allTasks]);

  const handleViewDetail = async (task) => {
    try {
      setDetailsLoading(true);
      const result = await getTaskByBusinessKey(task.businessKey);
      
      if (result.status && result.data) {
        const taskData = Array.isArray(result.data) ? result.data : [];
        setSelectedTaskDetails(taskData);
        setShowDetails(true);
      } else {
        toast.error("Failed to fetch task details.");
      }
    } catch (error) {
      console.error("Error fetching task details:", error);
      toast.error("Failed to fetch task details.");
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleViewTaskDetail = (task) => {
    const slug = task.name?.toLowerCase().replace(/\s+/g, "-") || "task";
    router.push(`/unassignTask/${task.id}__${slug}`);
  };

  const handleBackToList = () => {
    setShowDetails(false);
    setSelectedTaskDetails([]);
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    const now = new Date();
    const due = new Date(dueDate);
    return due < now;
  };

  if (showDetails) {
    return (
      <div className="container mx-auto py-10">
        <Card className="mb-6">
          <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Task Details</CardTitle>
              <CardDescription>Detailed view of tasks for the selected business key.</CardDescription>
            </div>
            <Button onClick={handleBackToList} variant="outline">
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
                      <TableCell>{task.created ? new Date(task.created).toLocaleString() : "—"}</TableCell>
                      <TableCell>
                        {task.due_date ? (
                          <div>
                            <div>{new Date(task.due_date).toLocaleString()}</div>
                            {isOverdue(task.due_date) && (
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
                          task.delegation === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : task.delegation
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          {task.delegation || "—"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button onClick={() => handleViewTaskDetail(task)}>
                          View
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
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Available Tasks</CardTitle>
          <CardDescription>
            Showing {tasks.length} of {allTasks.length} tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Business Key</TableHead>
                <TableHead>Task Name</TableHead>
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
                        task.status === "incative" 
                          ? "bg-gray-100 text-gray-800" 
                          : "bg-green-100 text-green-800"
                      }`}>
                        {task.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        onClick={() => handleViewDetail(task)}
                        disabled={detailsLoading}
                      >
                        {detailsLoading ? "Loading..." : "Detail"}
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