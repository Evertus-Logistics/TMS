import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const create = mutation({
  args: {
    loadId: v.string(),
    date: v.string(),
    equipmentType: v.string(),
    weight: v.string(),
    equipmentLength: v.string(),
    commodity: v.string(),
    distance: v.string(),
    containerNumber: v.string(),
    tractorNumber: v.string(),
    carrierName: v.string(),
    carrierPOCName: v.string(),
    carrierPOCEmail: v.string(),
    carrierAddress: v.string(),
    dotNumber: v.string(),
    driverName: v.string(),
    mcNumber: v.string(),
    carrierPOCPhone: v.string(),
    notesAndReferences: v.string(),
    pickupCompanyName: v.string(),
    pickupAddress: v.string(),
    pickupCity: v.string(),
    pickupState: v.string(),
    pickupZip: v.string(),
    deliveryCompanyName: v.string(),
    deliveryAddress: v.string(),
    deliveryCity: v.string(),
    deliveryState: v.string(),
    deliveryZip: v.string(),
    note: v.string(),
    payItems: v.array(v.object({
      description: v.string(),
      notes: v.string(),
      quantity: v.number(),
      rate: v.number(),
      amount: v.number(),
    })),
    grandTotal: v.number(),
    signerName: v.string(),
    signature: v.string(),
    signDate: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.insert("bols", {
      ...args,
      createdBy: userId,
      createdAt: new Date().toISOString(),
    });
  },
});

export const list = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.query("bols")
      .order("desc")
      .collect();
  },
});

export const get = query({
  args: { id: v.id("bols") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.get(args.id);
  },
});

export const update = mutation({
  args: {
    id: v.id("bols"),
    loadId: v.string(),
    date: v.string(),
    equipmentType: v.string(),
    weight: v.string(),
    equipmentLength: v.string(),
    commodity: v.string(),
    distance: v.string(),
    containerNumber: v.string(),
    tractorNumber: v.string(),
    carrierName: v.string(),
    carrierPOCName: v.string(),
    carrierPOCEmail: v.string(),
    carrierAddress: v.string(),
    dotNumber: v.string(),
    driverName: v.string(),
    mcNumber: v.string(),
    carrierPOCPhone: v.string(),
    notesAndReferences: v.string(),
    pickupCompanyName: v.string(),
    pickupAddress: v.string(),
    pickupCity: v.string(),
    pickupState: v.string(),
    pickupZip: v.string(),
    deliveryCompanyName: v.string(),
    deliveryAddress: v.string(),
    deliveryCity: v.string(),
    deliveryState: v.string(),
    deliveryZip: v.string(),
    note: v.string(),
    payItems: v.array(v.object({
      description: v.string(),
      notes: v.string(),
      quantity: v.number(),
      rate: v.number(),
      amount: v.number(),
    })),
    grandTotal: v.number(),
    signerName: v.string(),
    signature: v.string(),
    signDate: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const { id, ...updates } = args;
    return await ctx.db.patch(id, updates);
  },
});

export const remove = mutation({
  args: { id: v.id("bols") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    await ctx.db.delete(args.id);
  },
});
