
"use client";

import { useParams } from "next/navigation";
import AssignDetailedTask from "@/application-business-layer/assignTask/assignDetailTask";

export default function TaskPageWrapper() {
  const { taskid } = useParams();
  const taskId = taskid?.split("__")[0];

  if (!taskId) {
    return <div className="p-4 text-sm text-muted-foreground">Loading task...</div>;
  }

  return <AssignDetailedTask taskId={taskId} />;
}
