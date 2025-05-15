import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { formatDistanceToNow } from "date-fns";

export function TaskNotifications() {
  const notifications = useQuery(api.tasks.getNotifications) || [];
  const markRead = useMutation(api.tasks.markNotificationRead);

  const handleMarkRead = async (notificationId: any) => {
    try {
      await markRead({ notificationId });
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "assigned": return "border-blue-500";
      case "accepted": return "border-green-500";
      case "declined": return "border-red-500";
      case "completed": return "border-purple-500";
      default: return "border-gray-500";
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6 border-2 border-yellow-400 shadow-[0_0_10px_2px_#FFD700]">
      <h2 className="text-2xl font-bold text-black mb-4 [text-shadow:_0_0_5px_#FFD700,_0_0_10px_#FFC300,_0_0_15px_#FFA500]">
        Notifications
      </h2>
      <div className="space-y-4">
        {notifications.map((notification: any) => (
          <div
            key={notification._id}
            className={`bg-gray-800 rounded-lg p-4 border-l-4 ${getNotificationColor(
              notification.type
            )}`}
            onClick={() => handleMarkRead(notification._id)}
          >
            <p className="text-white">{notification.message}</p>
            <span className="text-sm text-gray-500">
              {formatDistanceToNow(notification.timestamp)} ago
            </span>
          </div>
        ))}
        {notifications.length === 0 && (
          <p className="text-gray-500 text-center">No new notifications</p>
        )}
      </div>
    </div>
  );
}
