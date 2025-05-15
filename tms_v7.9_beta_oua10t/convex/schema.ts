import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
  bols: defineTable({
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
    
    createdBy: v.id("users"),
    createdAt: v.string(),
  }).index("by_loadId", ["loadId"]),
});
