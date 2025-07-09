"use client";

import { useParams } from "next/navigation";
import UnassignDetailedTask from "@/interface-adapters/components/unassign-task/unnasignTaskDetail";

export default function UnassignedTaskPageWrapper() {
  const { unassigntaskId } = useParams();
  const taskId = unassigntaskId?.split("__")[0];

  return <UnassignDetailedTask taskId={taskId} />;
}
