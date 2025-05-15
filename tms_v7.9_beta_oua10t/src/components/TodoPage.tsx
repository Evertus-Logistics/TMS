import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { Id } from "../../convex/_generated/dataModel";
import { TaskMetrics } from "./tasks/TaskMetrics";
import { TaskList } from "./tasks/TaskList";
import { CreateTaskModal } from "./tasks/CreateTaskModal";
import { TaskNotifications } from "./tasks/TaskNotifications";

export function TodoPage() {
  const profile = useQuery(api.users.getProfile);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white [text-shadow:_0_0_5px_#FFD700,_0_0_10px_#FFC300,_0_0_15px_#FFA500] text-center flex-grow">
          TO DO
        </h1>
        <div className="text-right flex flex-col items-center gap-2">
          <img 
            src="https://effervescent-camel-645.convex.cloud/api/storage/05b48caa-f6b9-4de0-b356-b91e1164defe"
            alt="Logo"
            className="w-16 h-16 object-contain"
          />
          <div className="text-white text-1xl font-bold">
            Welcome, {profile?.name}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Metrics Section */}
        <div className="col-span-12">
          <TaskMetrics />
        </div>

        {/* Task Lists Section */}
        <div className="col-span-12 lg:col-span-8">
          <div className="bg-gray-900 rounded-lg p-6 border-2 border-yellow-400 shadow-[0_0_10px_2px_#FFD700]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-black [text-shadow:_0_0_5px_#FFD700,_0_0_10px_#FFC300,_0_0_15px_#FFA500]">
                Tasks
              </h2>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-4 py-2 bg-[#FFD700] text-black rounded hover:bg-[#FFC300] transition-colors"
              >
                Create Task
              </button>
            </div>
            <TaskList />
          </div>
        </div>

        {/* Notifications Section */}
        <div className="col-span-12 lg:col-span-4">
          <TaskNotifications />
        </div>
      </div>

      {isCreateModalOpen && (
        <CreateTaskModal
          open={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      )}
    </div>
  );
}
