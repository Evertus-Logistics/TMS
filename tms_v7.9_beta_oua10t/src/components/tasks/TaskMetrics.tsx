import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export function TaskMetrics() {
  const metrics = useQuery(api.tasks.getTaskMetrics);

  if (!metrics) return null;

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const MetricCard = ({ title, value, color }: { title: string; value: string | number; color: string }) => (
    <div className="bg-black rounded-full p-6 border-2 border-[#FFD700] shadow-[0_0_15px_#FFD700] hover:shadow-[0_0_25px_#FFD700] transition-shadow duration-300">
      <div className="flex flex-col items-center justify-center text-center">
        <h3 className="text-[#FFD700] text-sm font-semibold mb-2 [text-shadow:_0_0_5px_#FFD700]">{title}</h3>
        <p className={`text-2xl font-bold ${color} [text-shadow:_0_0_10px_currentColor]`}>{value}</p>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
      <MetricCard
        title="Open Tasks"
        value={metrics.open}
        color="text-blue-500"
      />
      <MetricCard
        title="Incoming Tasks"
        value={metrics.incoming}
        color="text-yellow-500"
      />
      <MetricCard
        title="Completed Tasks"
        value={metrics.completed}
        color="text-green-500"
      />
      <MetricCard
        title="Emergency Tasks"
        value={metrics.emergency}
        color="text-red-500"
      />
      <MetricCard
        title="Avg. Completion Time"
        value={formatTime(metrics.averageCompletionTime)}
        color="text-purple-500"
      />
    </div>
  );
}
