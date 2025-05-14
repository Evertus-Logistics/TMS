import { v } from "convex/values";
import { mutation, query, QueryCtx, MutationCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { internal } from "./_generated/api";

// Get user's profile ID from their auth ID
async function getUserProfileId(ctx: QueryCtx | MutationCtx) {
  const userId = await getAuthUserId(ctx);
  if (!userId) throw new Error("Not authenticated");
  
  const profile = await ctx.db
    .query("userProfiles")
    .withIndex("by_userId", (q: any) => q.eq("userId", userId))
    .first();
  
  if (!profile) throw new Error("Profile not found");
  return profile._id;
}

export const createTask = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    priority: v.union(
      v.literal("Low"),
      v.literal("Medium"),
      v.literal("High"),
      v.literal("EMERGENCY")
    ),
    assigneeId: v.id("userProfiles"),
    dueDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const assignerId = await getUserProfileId(ctx);
    
    const taskId = await ctx.db.insert("tasks", {
      ...args,
      assignerId,
      status: "Assigned",
      startTime: Date.now(),
      isRead: false,
    });

    // Create notification for assignee
    await ctx.db.insert("notifications", {
      userId: args.assigneeId,
      taskId,
      type: "assigned",
      message: "You have been assigned a new task",
      isRead: false,
      timestamp: Date.now(),
    });

    return taskId;
  },
});

export const updateTaskStatus = mutation({
  args: {
    taskId: v.id("tasks"),
    status: v.union(
      v.literal("Pending"),
      v.literal("Completed"),
      v.literal("Cancelled")
    ),
  },
  handler: async (ctx, args) => {
    const userProfileId = await getUserProfileId(ctx);
    
    const task = await ctx.db.get(args.taskId);
    if (!task) throw new Error("Task not found");
    
    if (task.assigneeId !== userProfileId) {
      throw new Error("Not authorized to update this task");
    }

    const updates: any = { status: args.status };
    if (args.status === "Completed") {
      updates.completionTime = Date.now();
    }

    await ctx.db.patch(args.taskId, updates);

    // Create notification for assigner
    await ctx.db.insert("notifications", {
      userId: task.assignerId,
      taskId: args.taskId,
      type: args.status === "Cancelled" ? "declined" : 
            args.status === "Completed" ? "completed" : "accepted",
      message: `Task has been ${args.status.toLowerCase()}`,
      isRead: false,
      timestamp: Date.now(),
    });
  },
});

export const getMyTasks = query({
  args: {
    status: v.optional(v.union(
      v.literal("Assigned"),
      v.literal("Pending"),
      v.literal("Completed"),
      v.literal("Cancelled")
    )),
  },
  handler: async (ctx, args) => {
    const userProfileId = await getUserProfileId(ctx);
    
    let q = ctx.db
      .query("tasks")
      .withIndex("by_assignee", (q: any) => q.eq("assigneeId", userProfileId));
    
    if (args.status) {
      q = q.filter((q: any) => q.eq(q.field("status"), args.status));
    }
    
    return await q.collect();
  },
});

export const getAssignedTasks = query({
  args: {
    status: v.optional(v.union(
      v.literal("Assigned"),
      v.literal("Pending"),
      v.literal("Completed"),
      v.literal("Cancelled")
    )),
  },
  handler: async (ctx, args) => {
    const userProfileId = await getUserProfileId(ctx);
    
    let q = ctx.db
      .query("tasks")
      .withIndex("by_assigner", (q: any) => q.eq("assignerId", userProfileId));
    
    if (args.status) {
      q = q.filter((q: any) => q.eq(q.field("status"), args.status));
    }
    
    return await q.collect();
  },
});

export const getTaskMetrics = query({
  handler: async (ctx) => {
    const userProfileId = await getUserProfileId(ctx);
    
    const assignedToMe = await ctx.db
      .query("tasks")
      .withIndex("by_assignee", (q: any) => q.eq("assigneeId", userProfileId))
      .collect();

    const assignedByMe = await ctx.db
      .query("tasks")
      .withIndex("by_assigner", (q: any) => q.eq("assignerId", userProfileId))
      .collect();

    const metrics = {
      open: 0,
      incoming: 0,
      completed: 0,
      emergency: 0,
      averageCompletionTime: 0,
    };

    let completedTasks = 0;
    let totalCompletionTime = 0;

    for (const task of assignedToMe) {
      if (task.status === "Assigned") metrics.incoming++;
      if (["Assigned", "Pending"].includes(task.status)) metrics.open++;
      if (task.status === "Completed") {
        metrics.completed++;
        if (task.completionTime) {
          completedTasks++;
          totalCompletionTime += task.completionTime - task.startTime;
        }
      }
      if (task.priority === "EMERGENCY") metrics.emergency++;
    }

    metrics.averageCompletionTime = completedTasks > 0 
      ? totalCompletionTime / completedTasks 
      : 0;

    return metrics;
  },
});

export const getNotifications = query({
  handler: async (ctx) => {
    const userProfileId = await getUserProfileId(ctx);
    
    return await ctx.db
      .query("notifications")
      .withIndex("by_user_unread", (q: any) => 
        q.eq("userId", userProfileId).eq("isRead", false)
      )
      .collect();
  },
});

export const markNotificationRead = mutation({
  args: { notificationId: v.id("notifications") },
  handler: async (ctx, args) => {
    const userProfileId = await getUserProfileId(ctx);
    
    const notification = await ctx.db.get(args.notificationId);
    if (!notification || notification.userId !== userProfileId) {
      throw new Error("Notification not found or unauthorized");
    }
    
    await ctx.db.patch(args.notificationId, { isRead: true });
  },
});
