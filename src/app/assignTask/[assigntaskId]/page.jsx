"use client";

import { useParams } from "next/navigation";
import AssignDetailedTask from "@/application-business-layer/assignTask/assignDetailTask";

export default function AssignedTaskPageWrapper() {
  const { assigntaskId } = useParams();

  // Safely extract the ID from "uuid__task-name"
  const taskId = assigntaskId?.split("__")[0];

  return <AssignDetailedTask taskId={taskId} />;
}
