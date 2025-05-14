import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export function LoadMetrics() {
  const metrics = useQuery(api.loads.getLoadMetrics);

  if (!metrics) return null;

  const MetricCard = ({ title, value, color }: { title: string; value: number; color: string }) => (
    <div className="bg-black rounded-full p-6 border-2 border-[#FFD700] shadow-[0_0_15px_#FFD700] hover:shadow-[0_0_25px_#FFD700] transition-shadow duration-300">
      <div className="flex flex-col items-center justify-center text-center">
        <h3 className="text-[#FFD700] text-sm font-semibold mb-2 [text-shadow:_0_0_5px_#FFD700]">{title}</h3>
        <p className={`text-2xl font-bold ${color} [text-shadow:_0_0_10px_currentColor]`}>{value}</p>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <MetricCard
        title="Loads Quoted"
        value={metrics.quoted}
        color="text-blue-500"
      />
      <MetricCard
        title="Active Loads"
        value={metrics.active}
        color="text-yellow-500"
      />
      <MetricCard
        title="Loads Completed"
        value={metrics.completed}
        color="text-green-500"
      />
    </div>
  );
}
