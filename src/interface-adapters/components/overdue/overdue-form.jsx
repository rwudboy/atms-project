"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/interface-adapters/components/ui/button";
import { Input } from "@/interface-adapters/components/ui/input";
import { Badge } from "@/interface-adapters/components/ui/badge";
import { Search } from "lucide-react";
import { getOverdue } from "@/interface-adapters/usecases/overdue/overdue-usecase";
import { ClaimTask } from "@/interface-adapters/usecases/unassign-task/claim-task"; // your claim logic
import { toast } from "sonner";

export default function OverdueTasksPage() {
  const [tasks, setTasks] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchTasks() {
      const data = await getOverdue();
      const filtered = data.filter((task) => task.due !== null);
      setTasks(filtered);
    }

    fetchTasks();
  }, []);

  const handleClaim = async (taskId) => {
    const result = await ClaimTask(taskId);
    if (result.status) {
      toast.success(result.message || "Task claimed successfully");
    } else {
      toast.error(result.message || "Failed to claim task");
    }
  };

  const handleViewDetail = (task) => {
    const slug = task.name?.toLowerCase().replace(/\s+/g, "-") || "task";
    router.push(`/unassignTask/${task.id}__${slug}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Overdue Tasks</h1>
          <p className="text-gray-600">List of tasks that have passed their due date</p>
        </div>

        {/* Overdue Task List Section */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Overdue Task List</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input placeholder="Search task..." className="pl-10 w-64" />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Task Name</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Created At</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Due Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Delegation</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => (
                    <tr key={task.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4 font-medium text-gray-900">{task.name}</td>
                      <td className="py-4 px-4 text-gray-600">
                        {new Date(task.created).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-gray-600">
                            {new Date(task.due).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                          <Badge variant="destructive" className="w-fit text-xs font-bold">
                            OVERDUE!
                          </Badge>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-600">
                        {task.delegationState || "Pending"}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-col gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-16 bg-transparent"
                            onClick={() => handleViewDetail(task)}
                          >
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-16 bg-transparent"
                            onClick={() => handleClaim(task.id)}
                          >
                            Claim
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {tasks.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-6 text-gray-500">
                        No overdue tasks with a due date.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
