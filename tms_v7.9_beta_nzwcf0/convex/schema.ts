import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

const applicationTables = {
  userProfiles: defineTable({
    userId: v.id("users"),
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    loadId: v.optional(v.string()),
    manager: v.optional(
      v.union(
        v.literal("Hector"),
        v.literal("Roy"),
        v.literal("Nasif"),
        v.literal("Ali"),
        v.literal("Andrew")
      )
    ),
    role: v.union(
      v.literal("admin"),
      v.literal("manager"),
      v.literal("Broker Sales Agent"),
      v.literal("Carrier Sales Agent"),
      v.literal("Support"),
      v.literal("Accounting")
    ),
    status: v.union(v.literal("active"), v.literal("inactive")),
    commissionRate: v.optional(v.number()),
    salary: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    imageStorageId: v.optional(v.id("_storage")),
  })
    .index("by_userId", ["userId"])
    .index("by_email", ["email"])
    .index("by_status", ["status"])
    .index("by_role", ["role"]),

  loads: defineTable({
    loadId: v.string(),
    loadCount: v.number(),
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
    trackingNumber: v.string(),
    layovers: v.boolean(),
    assignedAgentId: v.id("userProfiles"),
    branch: v.union(
      v.literal("Nasif's Team"),
      v.literal("Roy's Team"),
      v.literal("Andrew's Team"),
      v.literal("Ali's Team")
    ),
    // Pickup Info
    pickupBuildingName: v.string(),
    pickupStreetAddress: v.string(),
    pickupCity: v.string(),
    pickupState: v.string(),
    pickupZip: v.string(),
    pickupDate: v.string(),
    pickupTime: v.string(),
    // Delivery Info
    dropoffBuildingName: v.string(),
    dropoffStreetAddress: v.string(),
    dropoffCity: v.string(),
    dropoffState: v.string(),
    dropoffZip: v.string(),
    dropoffDate: v.string(),
    dropoffTime: v.string(),
    // Carrier Info
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
    // Financial Info
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
    // Accounting Info
    dateQuotedToClient: v.optional(v.string()),
    dateDelivered: v.optional(v.string()),
    dateInvoicedClient: v.optional(v.string()),
    dateCarrierPaid: v.optional(v.string()),
    dateAgentPaid: v.optional(v.string()),
    dateClientPaid: v.optional(v.string()),
    // Notes
    notes: v.optional(v.string()),
  })
    .index("by_assignedAgent", ["assignedAgentId"])
    .index("by_loadStatus", ["loadStatus"])
    .index("by_loadProgress", ["loadProgress"])
    .index("by_branch", ["branch"]),

  tasks: defineTable({
    title: v.string(),
    description: v.string(),
    priority: v.union(
      v.literal("Low"),
      v.literal("Medium"),
      v.literal("High"),
      v.literal("EMERGENCY")
    ),
    status: v.union(
      v.literal("Assigned"),
      v.literal("Pending"),
      v.literal("Completed"),
      v.literal("Cancelled")
    ),
    assignerId: v.id("userProfiles"),
    assigneeId: v.id("userProfiles"),
    dueDate: v.optional(v.string()),
    startTime: v.number(),
    completionTime: v.optional(v.number()),
    isRead: v.boolean(),
  })
    .index("by_assignee", ["assigneeId", "status"])
    .index("by_assigner", ["assignerId", "status"])
    .index("by_status", ["status"])
    .index("by_priority", ["priority"]),

  notifications: defineTable({
    userId: v.id("userProfiles"),
    taskId: v.id("tasks"),
    type: v.union(
      v.literal("assigned"),
      v.literal("accepted"),
      v.literal("declined"),
      v.literal("completed")
    ),
    message: v.string(),
    isRead: v.boolean(),
    timestamp: v.number(),
  }).index("by_user_unread", ["userId", "isRead"]),

  clients: defineTable({
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
  })
    .index("by_businessName", ["businessName"])
    .index("by_businessType", ["businessType"]),

  locations: defineTable({
    buildingName: v.string(),
    streetAddress: v.string(),
    city: v.string(),
    state: v.string(),
    zip: v.string(),
    country: v.string(),
    phone: v.string(),
    hoursOfOperation: v.string(),
  })
    .index("by_buildingName", ["buildingName"])
    .index("by_city", ["city"]),

  carriers: defineTable({
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
    w9FileId: v.optional(v.id("_storage")),
    supportingDocsFileId: v.optional(v.id("_storage")),
    paymentOption: v.string(),
    paymentMethod: v.string(),
    website: v.optional(v.string()),
    saferScoreLink: v.string(),
    status: v.string(),
    userId: v.id("users"),
  }).index("by_user", ["userId"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
