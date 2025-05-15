import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Id } from "../../../convex/_generated/dataModel";

type TaskStatus = "Assigned" | "Pending" | "Completed" | "Cancelled";
type UpdateTaskStatus = "Pending" | "Completed" | "Cancelled";

export function TaskList() {
  const [filter, setFilter] = useState<"assigned" | "created">("assigned");
  const [statusFilter, setStatusFilter] = useState<TaskStatus | undefined>(undefined);

  const myTasks = useQuery(api.tasks.getMyTasks, {
    status: statusFilter,
  });
  const assignedTasks = useQuery(api.tasks.getAssignedTasks, {
    status: statusFilter,
  });

  const updateStatus = useMutation(api.tasks.updateTaskStatus);

  const tasks = filter === "assigned" ? myTasks : assignedTasks;

  const handleStatusChange = async (taskId: Id<"tasks">, newStatus: UpdateTaskStatus) => {
    try {
      await updateStatus({ taskId, status: newStatus });
    } catch (error) {
      console.error("Failed to update task status:", error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Low": return "bg-blue-500/20 text-blue-500";
      case "Medium": return "bg-yellow-500/20 text-yellow-500";
      case "High": return "bg-orange-500/20 text-orange-500";
      case "EMERGENCY": return "bg-red-500/20 text-red-500";
      default: return "bg-gray-500/20 text-gray-500";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Assigned": return "bg-yellow-500/20 text-yellow-500";
      case "Pending": return "bg-blue-500/20 text-blue-500";
      case "Completed": return "bg-green-500/20 text-green-500";
      case "Cancelled": return "bg-red-500/20 text-red-500";
      default: return "bg-gray-500/20 text-gray-500";
    }
  };

  return (
    <div>
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setFilter("assigned")}
          className={`px-4 py-2 rounded transition-colors ${
            filter === "assigned"
              ? "bg-[#FFD700] text-black"
              : "bg-gray-800 text-white hover:bg-gray-700"
          }`}
        >
          Assigned to Me
        </button>
        <button
          onClick={() => setFilter("created")}
          className={`px-4 py-2 rounded transition-colors ${
            filter === "created"
              ? "bg-[#FFD700] text-black"
              : "bg-gray-800 text-white hover:bg-gray-700"
          }`}
        >
          Created by Me
        </button>
        <select
          value={statusFilter || ""}
          onChange={(e) => setStatusFilter(e.target.value as TaskStatus | undefined)}
          className="px-4 py-2 rounded bg-gray-800 text-white"
        >
          <option value="">All Status</option>
          <option value="Assigned">Assigned</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      <div className="space-y-4">
        {tasks?.map((task: any) => (
          <div
            key={task._id}
            className="bg-gray-800 rounded-lg p-4 border border-gray-700"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-white font-semibold">{task.title}</h3>
              <div className="flex gap-2">
                <span className={`px-2 py-1 rounded text-sm ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
                <span className={`px-2 py-1 rounded text-sm ${getStatusColor(task.status)}`}>
                  {task.status}
                </span>
              </div>
            </div>
            <p className="text-gray-400 mb-4">{task.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                Created {formatDistanceToNow(task.startTime)} ago
              </span>
              {filter === "assigned" && task.status === "Assigned" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleStatusChange(task._id, "Pending")}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleStatusChange(task._id, "Cancelled")}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Decline
                  </button>
                </div>
              )}
              {filter === "assigned" && task.status === "Pending" && (
                <button
                  onClick={() => handleStatusChange(task._id, "Completed")}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Complete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
