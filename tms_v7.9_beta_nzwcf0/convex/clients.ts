import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const listClients = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    return await ctx.db.query("clients").collect();
  },
});

export const createClient = mutation({
  args: {
    businessType: v.union(
      v.literal("Carrier"),
      v.literal("Shipper"),
      v.literal("Freight-Forwarder"),
      v.literal("Co-Broker")
    ),
    businessName: v.string(),
    streetAddress: v.string(),
    city: v.string(),
    state: v.string(),
    zip: v.string(),
    country: v.string(),
    ein: v.string(),
    dot: v.optional(v.string()),
    mc: v.optional(v.string()),
    pocName: v.string(),
    pocDob: v.string(),
    pocPhone: v.string(),
    companyPhone: v.optional(v.string()),
    companyEmail: v.optional(v.string()),
    accountsPayableEmail: v.optional(v.string()),
    factorable: v.boolean(),
    creditApproved: v.number(),
    creditUsed: v.number(),
    documentsStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.insert("clients", args);
  },
});

export const updateClient = mutation({
  args: {
    id: v.id("clients"),
    businessType: v.optional(v.union(
      v.literal("Carrier"),
      v.literal("Shipper"),
      v.literal("Freight-Forwarder"),
      v.literal("Co-Broker")
    )),
    businessName: v.optional(v.string()),
    streetAddress: v.optional(v.string()),
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    zip: v.optional(v.string()),
    country: v.optional(v.string()),
    ein: v.optional(v.string()),
    dot: v.optional(v.string()),
    mc: v.optional(v.string()),
    pocName: v.optional(v.string()),
    pocDob: v.optional(v.string()),
    pocPhone: v.optional(v.string()),
    companyPhone: v.optional(v.string()),
    companyEmail: v.optional(v.string()),
    accountsPayableEmail: v.optional(v.string()),
    factorable: v.optional(v.boolean()),
    creditApproved: v.optional(v.number()),
    creditUsed: v.optional(v.number()),
    documentsStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, updates);
  },
});

export const deleteClient = mutation({
  args: { id: v.id("clients") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});
