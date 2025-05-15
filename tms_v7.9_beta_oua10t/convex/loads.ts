import { v } from "convex/values";
import { mutation, query, QueryCtx, MutationCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";

// Helper function to get user's profile and check permissions
async function getUserProfileAndPermissions(ctx: QueryCtx | MutationCtx) {
  const userId = await getAuthUserId(ctx);
  if (!userId) throw new Error("Not authenticated");

  const profile = await ctx.db
    .query("userProfiles")
    .withIndex("by_userId", (q) => q.eq("userId", userId))
    .first();

  if (!profile) throw new Error("Profile not found");

  const isAdmin = profile.role === "admin";
  const isManager = profile.role === "manager";
  const isAgent = ["Broker Sales Agent", "Carrier Sales Agent"].includes(profile.role);
  const isSupport = ["Support", "Accounting"].includes(profile.role);

  return { profile, isAdmin, isManager, isAgent, isSupport };
}

// Add the new toggle invoice status mutation
export const toggleInvoiceStatus = mutation({
  args: {
    id: v.id("loads"),
    isPaid: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { isAdmin, isManager, isSupport } = await getUserProfileAndPermissions(ctx);

    // Only admin, manager, or support can toggle invoice status
    if (!isAdmin && !isManager && !isSupport) {
      throw new Error("Not authorized to update invoice status");
    }

    const load = await ctx.db.get(args.id);
    if (!load) throw new Error("Load not found");

    // Update the dateClientPaid field
    return await ctx.db.patch(args.id, {
      dateClientPaid: args.isPaid ? new Date().toISOString().split('T')[0] : undefined,
    });
  },
});

export const getAllLoads = query({
  handler: async (ctx) => {
    const { profile, isAdmin, isManager, isSupport } = await getUserProfileAndPermissions(ctx);

    let q = ctx.db.query("loads");

    if (!isAdmin && !isManager && !isSupport) {
      q = q.filter((q) => q.eq(q.field("assignedAgentId"), profile._id));
    }

    return await q.collect();
  },
});

export const get = query({
  args: { id: v.id("loads") },
  handler: async (ctx, args) => {
    const { profile, isAdmin, isManager } = await getUserProfileAndPermissions(ctx) as {
      profile: { _id: Id<"userProfiles"> };
      isAdmin: boolean;
      isManager: boolean;
    };

    const load = await ctx.db.get(args.id);
    if (!load) throw new Error("Load not found");

    if (!isAdmin && !isManager && load.assignedAgentId !== profile._id) {
      throw new Error("Not authorized to view this load");
    }

    return load;
  },
});

export const listLoads = query({
  args: {
    status: v.optional(
      v.union(v.literal("New"), v.literal("Active"), v.literal("Canceled"), v.literal("Closed"))
    ),
    progress: v.optional(
      v.union(
        v.literal("Quoted"),
        v.literal("Planning"),
        v.literal("In-Transit"),
        v.literal("Delivered")
      )
    ),
  },
  handler: async (ctx, args) => {
    const { profile, isAdmin, isManager } = await getUserProfileAndPermissions(ctx) as {
      profile: { _id: Id<"userProfiles"> };
      isAdmin: boolean;
      isManager: boolean;
    };

    let q = ctx.db.query("loads");

    if (args.status) {
      q = q.filter((q) => q.eq(q.field("loadStatus"), args.status));
    }

    if (args.progress) {
      q = q.filter((q) => q.eq(q.field("loadProgress"), args.progress));
    }

    if (!isAdmin && !isManager) {
      q = q.filter((q) => q.eq(q.field("assignedAgentId"), profile._id));
    }

    return await q.collect();
  },
});

export const createLoad = mutation({
  args: {
    customerBusinessName: v.string(),
    lastDateFree: v.optional(v.string()),
    loadStatus: v.union(
      v.literal("New"),
      v.literal("Active"),
      v.literal("Canceled"),
      v.literal("Closed")
    ),
    loadProgress: v.union(
      v.literal("Quoted"),
      v.literal("Planning"),
      v.literal("In-Transit"),
      v.literal("Delivered")
    ),
    loadCommodity: v.string(),
    trailerNumber: v.optional(v.string()),
    trailerType: v.union(
      v.literal("Van"),
      v.literal("Flatbed"),
      v.literal("Reefer"),
      v.literal("Container"),
      v.literal("Other")
    ),
    layovers: v.boolean(),
    assignedAgentId: v.id("userProfiles"),
    branch: v.union(
      v.literal("Nasif's Team"),
      v.literal("Roy's Team"),
      v.literal("Andrew's Team"),
      v.literal("Ali's Team")
    ),
    pickupBuildingName: v.string(),
    pickupStreetAddress: v.string(),
    pickupCity: v.string(),
    pickupState: v.string(),
    pickupZip: v.string(),
    pickupDate: v.string(),
    pickupTime: v.string(),
    dropoffBuildingName: v.string(),
    dropoffStreetAddress: v.string(),
    dropoffCity: v.string(),
    dropoffState: v.string(),
    dropoffZip: v.string(),
    dropoffDate: v.string(),
    dropoffTime: v.string(),
    carrierCompanyName: v.string(),
    carrierStatus: v.string(),
    carrierStreetAddress: v.string(),
    carrierCity: v.string(),
    carrierState: v.string(),
    carrierZip: v.string(),
    carrierPOC: v.string(),
    carrierPOCPhone: v.string(),
    carrierPOCEmail: v.string(),
    truckNumber: v.optional(v.string()),
    chassisNumber: v.optional(v.string()),
    clientRateCon: v.number(),
    carrierPayout: v.number(),
    agentPayout: v.number(),
    grossProfit: v.number(),
    netProfit: v.number(),
    totalFinalInvoice: v.number(),
    totalWeight: v.number(),
    actualWeight: v.number(),
    auxCharges: v.array(
      v.object({
        reason: v.string(),
        quantity: v.number(),
        charge: v.number(),
      })
    ),
    dateQuotedToClient: v.optional(v.string()),
    dateDelivered: v.optional(v.string()),
    dateInvoicedClient: v.optional(v.string()),
    dateCarrierPaid: v.optional(v.string()),
    dateAgentPaid: v.optional(v.string()),
    dateClientPaid: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { profile, isAdmin, isManager, isAgent } = await getUserProfileAndPermissions(ctx);

    if (!isAdmin && !isManager && !isAgent) {
      throw new Error("Not authorized to create loads");
    }

    const loadCount = await ctx.db.query("loads").collect().then((loads) => loads.length + 1);

    const loadId = `L${String(loadCount).padStart(6, "0")}`;
    const trackingNumber = `TN${String(loadCount).padStart(6, "0")}`;

    return await ctx.db.insert("loads", {
      loadId,
      loadCount,
      trackingNumber,
      ...args,
    });
  },
});

export const updateLoad = mutation({
  args: {
    id: v.id("loads"),
    customerBusinessName: v.string(),
    lastDateFree: v.optional(v.string()),
    loadStatus: v.union(
      v.literal("New"),
      v.literal("Active"),
      v.literal("Canceled"),
      v.literal("Closed")
    ),
    loadProgress: v.union(
      v.literal("Quoted"),
      v.literal("Planning"),
      v.literal("In-Transit"),
      v.literal("Delivered")
    ),
    loadCommodity: v.string(),
    trailerNumber: v.optional(v.string()),
    trailerType: v.union(
      v.literal("Van"),
      v.literal("Flatbed"),
      v.literal("Reefer"),
      v.literal("Container"),
      v.literal("Other")
    ),
    layovers: v.boolean(),
    assignedAgentId: v.id("userProfiles"),
    branch: v.union(
      v.literal("Nasif's Team"),
      v.literal("Roy's Team"),
      v.literal("Andrew's Team"),
      v.literal("Ali's Team")
    ),
    pickupBuildingName: v.string(),
    pickupStreetAddress: v.string(),
    pickupCity: v.string(),
    pickupState: v.string(),
    pickupZip: v.string(),
    pickupDate: v.string(),
    pickupTime: v.string(),
    dropoffBuildingName: v.string(),
    dropoffStreetAddress: v.string(),
    dropoffCity: v.string(),
    dropoffState: v.string(),
    dropoffZip: v.string(),
    dropoffDate: v.string(),
    dropoffTime: v.string(),
    carrierCompanyName: v.string(),
    carrierStatus: v.string(),
    carrierStreetAddress: v.string(),
    carrierCity: v.string(),
    carrierState: v.string(),
    carrierZip: v.string(),
    carrierPOC: v.string(),
    carrierPOCPhone: v.string(),
    carrierPOCEmail: v.string(),
    truckNumber: v.optional(v.string()),
    chassisNumber: v.optional(v.string()),
    clientRateCon: v.number(),
    carrierPayout: v.number(),
    agentPayout: v.number(),
    grossProfit: v.number(),
    netProfit: v.number(),
    totalFinalInvoice: v.number(),
    totalWeight: v.number(),
    actualWeight: v.number(),
    auxCharges: v.array(
      v.object({
        reason: v.string(),
        quantity: v.number(),
        charge: v.number(),
      })
    ),
    dateQuotedToClient: v.optional(v.string()),
    dateDelivered: v.optional(v.string()),
    dateInvoicedClient: v.optional(v.string()),
    dateCarrierPaid: v.optional(v.string()),
    dateAgentPaid: v.optional(v.string()),
    dateClientPaid: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { profile, isAdmin, isManager } = await getUserProfileAndPermissions(ctx) as {
      profile: { _id: Id<"userProfiles"> };
      isAdmin: boolean;
      isManager: boolean;
    };

    const load = await ctx.db.get(args.id);
    if (!load) throw new Error("Load not found");

    if (!isAdmin && !isManager && load.assignedAgentId !== profile._id) {
      throw new Error("Not authorized to update this load");
    }

    const { id, ...updates } = args;
    return await ctx.db.patch(id, updates);
  },
});

export const deleteLoad = mutation({
  args: { id: v.id("loads") },
  handler: async (ctx, args) => {
    const { isAdmin, isManager } = await getUserProfileAndPermissions(ctx);

    if (!isAdmin && !isManager) {
      throw new Error("Not authorized to delete loads");
    }

    await ctx.db.delete(args.id);
  },
});

export const getLoadMetrics = query({
  handler: async (ctx) => {
    const { profile, isAdmin, isManager } = await getUserProfileAndPermissions(ctx) as {
      profile: { _id: Id<"userProfiles"> };
      isAdmin: boolean;
      isManager: boolean;
    };

    let q = ctx.db.query("loads");

    if (!isAdmin && !isManager) {
      q = q.filter((q) => q.eq(q.field("assignedAgentId"), profile._id));
    }

    const loads = await q.collect();

    return {
      quoted: loads.filter((l) => l.loadProgress === "Quoted").length,
      active: loads.filter((l) => l.loadStatus === "Active").length,
      completed: loads.filter((l) => l.loadProgress === "Delivered").length,
    };
  },
});
