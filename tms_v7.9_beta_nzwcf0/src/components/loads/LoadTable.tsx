import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Id } from "../../../convex/_generated/dataModel";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from '@mui/material';
import { toast } from "sonner";

interface LoadTableProps {
  onEdit: (loadId: Id<"loads">) => void;
}

export function LoadTable({ onEdit }: LoadTableProps) {
  const profile = useQuery(api.users.getProfile);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [progressFilter, setProgressFilter] = useState<string | undefined>(undefined);

  const loads = useQuery(api.loads.listLoads, {
    status: statusFilter as any,
    progress: progressFilter as any,
  });

  const deleteLoad = useMutation(api.loads.deleteLoad);

  const handleDelete = async (loadId: Id<"loads">) => {
    if (window.confirm("Are you sure you want to delete this load?")) {
      try {
        await deleteLoad({ id: loadId });
        toast.success("Load deleted successfully");
      } catch (error) {
        toast.error("Failed to delete load: " + (error as Error).message);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New": return "bg-blue-500/20 text-blue-500";
      case "Active": return "bg-green-500/20 text-green-500";
      case "Canceled": return "bg-red-500/20 text-red-500";
      case "Closed": return "bg-gray-500/20 text-gray-500";
      default: return "bg-gray-500/20 text-gray-500";
    }
  };

  const getProgressColor = (progress: string) => {
    switch (progress) {
      case "Quoted": return "bg-yellow-500/20 text-yellow-500";
      case "Planning": return "bg-blue-500/20 text-blue-500";
      case "In-Transit": return "bg-purple-500/20 text-purple-500";
      case "Delivered": return "bg-green-500/20 text-green-500";
      default: return "bg-gray-500/20 text-gray-500";
    }
  };

  const canEdit = profile?.role !== "Support" && profile?.role !== "Accounting";
  const canDelete = profile?.role === "admin" || profile?.role === "manager";

  return (
    <div>
      <div className="flex gap-4 mb-4">
        <select
          value={statusFilter || ""}
          onChange={(e) => setStatusFilter(e.target.value || undefined)}
          className="px-4 py-2 rounded bg-gray-800 text-white"
        >
          <option value="">All Status</option>
          <option value="New">New</option>
          <option value="Active">Active</option>
          <option value="Canceled">Canceled</option>
          <option value="Closed">Closed</option>
        </select>
        <select
          value={progressFilter || ""}
          onChange={(e) => setProgressFilter(e.target.value || undefined)}
          className="px-4 py-2 rounded bg-gray-800 text-white"
        >
          <option value="">All Progress</option>
          <option value="Quoted">Quoted</option>
          <option value="Planning">Planning</option>
          <option value="In-Transit">In-Transit</option>
          <option value="Delivered">Delivered</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <div className="max-h-[600px] overflow-y-auto">
          <table className="w-full border-collapse">
            <thead className="sticky top-0 bg-black">
              <tr className="text-left border-b-2 border-[#FFD700]">
                <th className="p-4 text-[#FFD700]">Load ID</th>
                <th className="p-4 text-[#FFD700]">Customer</th>
                <th className="p-4 text-[#FFD700]">Status</th>
                <th className="p-4 text-[#FFD700]">Progress</th>
                <th className="p-4 text-[#FFD700]">Pickup</th>
                <th className="p-4 text-[#FFD700]">Delivery</th>
                <th className="p-4 text-[#FFD700]">Carrier</th>
                <th className="p-4 text-[#FFD700]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loads?.map((load) => (
                <tr key={load._id} className="border-b border-gray-700 hover:bg-gray-900">
                  <td className="p-4 text-white">{load.loadId}</td>
                  <td className="p-4 text-white">{load.customerBusinessName}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-sm ${getStatusColor(load.loadStatus)}`}>
                      {load.loadStatus}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-sm ${getProgressColor(load.loadProgress)}`}>
                      {load.loadProgress}
                    </span>
                  </td>
                  <td className="p-4 text-white">
                    {load.pickupCity}, {load.pickupState}
                  </td>
                  <td className="p-4 text-white">
                    {load.dropoffCity}, {load.dropoffState}
                  </td>
                  <td className="p-4 text-white">{load.carrierCompanyName}</td>
                  <td className="p-4">
                    {canEdit && (
                      <IconButton
                        size="small"
                        onClick={() => onEdit(load._id)}
                        sx={{ 
                          mr: 1,
                          color: '#3b82f6',
                          '&:hover': {
                            color: '#60a5fa',
                          }
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    )}
                    {canDelete && (
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(load._id)}
                        sx={{ 
                          color: '#ef4444',
                          '&:hover': {
                            color: '#f87171',
                          }
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
