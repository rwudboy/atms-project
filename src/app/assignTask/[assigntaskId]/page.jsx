"use client";

import { useParams } from "next/navigation";
import AssignDetailedTask from "@/interface-adapters/components/assign-task/assignTaskDetail";

export default function AssignedTaskPageWrapper() {
  const { assigntaskId } = useParams();

  return <AssignDetailedTask taskId={assigntaskId} />;
}
