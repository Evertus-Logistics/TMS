import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

const PAYMENT_OPTIONS = [
  "Standard",
  "Net30",
  "Quick-Pay 5%",
] as const;

const PAYMENT_METHODS = [
  "ACH",
  "Paper-Check",
  "Wire $25-$90 fee",
  "Zelle 5% fee",
  "Cashapp or Venmo 7% Fee",
] as const;

const STATUS_OPTIONS = [
  "Approved",
  "DO NOT USE",
] as const;

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("carriers").collect();
  },
});

export const get = query({
  args: { id: v.id("carriers") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    carrierCompanyName: v.string(),
    carrierStreetAddress: v.string(),
    carrierCity: v.string(),
    carrierState: v.string(),
    carrierZip: v.string(),
    carrierPOC: v.string(),
    carrierPOCPhone: v.string(),
    carrierPOCEmail: v.string(),
    truckNumber: v.optional(v.string()),
    chassisNumber: v.optional(v.string()),
    mcNumber: v.string(),
    dotNumber: v.string(),
    einNumber: v.string(),
    paymentOption: v.union(
      ...PAYMENT_OPTIONS.map(opt => v.literal(opt))
    ),
    paymentMethod: v.union(
      ...PAYMENT_METHODS.map(method => v.literal(method))
    ),
    website: v.optional(v.string()),
    saferScoreLink: v.string(),
    status: v.union(
      ...STATUS_OPTIONS.map(status => v.literal(status))
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    return await ctx.db.insert("carriers", {
      ...args,
      userId,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("carriers"),
    carrierCompanyName: v.string(),
    carrierStreetAddress: v.string(),
    carrierCity: v.string(),
    carrierState: v.string(),
    carrierZip: v.string(),
    carrierPOC: v.string(),
    carrierPOCPhone: v.string(),
    carrierPOCEmail: v.string(),
    truckNumber: v.optional(v.string()),
    chassisNumber: v.optional(v.string()),
    mcNumber: v.string(),
    dotNumber: v.string(),
    einNumber: v.string(),
    paymentOption: v.union(
      ...PAYMENT_OPTIONS.map(opt => v.literal(opt))
    ),
    paymentMethod: v.union(
      ...PAYMENT_METHODS.map(method => v.literal(method))
    ),
    website: v.optional(v.string()),
    saferScoreLink: v.string(),
    status: v.union(
      ...STATUS_OPTIONS.map(status => v.literal(status))
    ),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, updates);
  },
});

export const remove = mutation({
  args: { id: v.id("carriers") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const uploadW9 = mutation({
  args: {
    carrierId: v.id("carriers"),
    fileId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.carrierId, {
      w9FileId: args.fileId,
    });
  },
});

export const uploadSupportingDocs = mutation({
  args: {
    carrierId: v.id("carriers"),
    fileId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.carrierId, {
      supportingDocsFileId: args.fileId,
    });
  },
});
