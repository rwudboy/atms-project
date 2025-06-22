"use client";
import TaskModal from "@/interface-adapters/components/modals/unassign-task/unassign-task-modal";
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
import { Search } from "lucide-react";
import { toast } from "sonner";
import { getTasks } from "@/interface-adapters/usecases/unassign-task/get-task";

export default function UnassignTaskPage() {
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [allTasks, setAllTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);


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
      task.name?.toLowerCase().includes(lower)
    );

   


    setTasks(filtered);
  }, [searchTerm, allTasks]);

  const handleViewDetail = (taskId) => {
    setSelectedTaskId(taskId);
  setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="mb-6">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Task List</CardTitle>
            <CardDescription>View and claim available tasks.</CardDescription>
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
              placeholder="Search by task name..."
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
                <TableHead>Name</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    Loading tasks...
                  </TableCell>
                </TableRow>
              ) : tasks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    No tasks found
                  </TableCell>
                </TableRow>
              ) : (
                tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">{task.name || "Untitled"}</TableCell>
                    <TableCell>{new Date(task.created).toLocaleString()}</TableCell>
                    <TableCell>
                      {task.due_date
                        ? new Date(task.due_date).toLocaleString()
                        : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button onClick={() => handleViewDetail(task.id)}>Detail</Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {selectedTaskId && (
        <TaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          taskId={selectedTaskId}
        />
      )}
    </div>
  );
}
