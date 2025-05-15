import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getAllProfiles = query({
  args: {
    search: v.optional(v.string()),
    role: v.optional(v.union(
      v.literal("admin"),
      v.literal("manager"),
      v.literal("Broker Sales Agent"),
      v.literal("Carrier Sales Agent"),
      v.literal("Support"),
      v.literal("Accounting")
    )),
    status: v.optional(v.union(
      v.literal("active"),
      v.literal("inactive")
    )),
  },
  handler: async (ctx, args) => {
    let q = ctx.db.query("userProfiles");
    
    if (args.role) {
      q = q.filter((q) => q.eq(q.field("role"), args.role));
    }
    
    if (args.status) {
      q = q.filter((q) => q.eq(q.field("status"), args.status));
    }
    
    // Get all profiles first, then filter by search term in memory
    const profiles = await q.collect();
    
    if (args.search) {
      const searchLower = args.search.toLowerCase();
      return profiles.filter(
        profile => 
          profile.name.toLowerCase().includes(searchLower) ||
          profile.email.toLowerCase().includes(searchLower) ||
          profile.loadId?.toLowerCase().includes(searchLower)
      );
    }
    
    return profiles;
  },
});

export const getProfile = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    
    return await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();
  },
});

export const initializeFirstUser = mutation({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");
    
    // Check if profile already exists
    const existingProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();
    
    if (existingProfile) return existingProfile;
    
    // Create new profile
    return await ctx.db.insert("userProfiles", {
      userId,
      name: user.name || "New User",
      email: user.email || "",
      role: "admin", // First user is always admin
      status: "active",
      loadId: "L000001", // First user gets first load ID
    });
  },
});

export const createProfile = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    manager: v.optional(v.union(
      v.literal("Hector"),
      v.literal("Roy"),
      v.literal("Nasif"),
      v.literal("Ali"),
      v.literal("Andrew")
    )),
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
    loadId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Only admins can create profiles
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    const adminProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();
    
    if (!adminProfile || adminProfile.role !== "admin") {
      throw new Error("Not authorized");
    }
    
    // Generate next load ID if not provided
    let loadId = args.loadId;
    if (!loadId) {
      const profiles = await ctx.db.query("userProfiles").collect();
      const nextNumber = profiles.length + 1;
      loadId = `L${String(nextNumber).padStart(6, '0')}`;
    }
    
    return await ctx.db.insert("userProfiles", {
      ...args,
      userId,
      loadId,
    });
  },
});

export const updateProfile = mutation({
  args: {
    id: v.id("userProfiles"),
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    manager: v.optional(v.union(
      v.literal("Hector"),
      v.literal("Roy"),
      v.literal("Nasif"),
      v.literal("Ali"),
      v.literal("Andrew")
    )),
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
    loadId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    
    // Only admins can update profiles
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    const adminProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();
    
    if (!adminProfile || adminProfile.role !== "admin") {
      throw new Error("Not authorized");
    }
    
    return await ctx.db.patch(id, updates);
  },
});

export const deleteProfile = mutation({
  args: { id: v.id("userProfiles") },
  handler: async (ctx, args) => {
    // Only admins can delete profiles
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    const adminProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();
    
    if (!adminProfile || adminProfile.role !== "admin") {
      throw new Error("Not authorized");
    }
    
    await ctx.db.delete(args.id);
  },
});

export const uploadProfileImage = mutation({
  args: {
    id: v.id("userProfiles"),
    fileId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    // Get signed URL for the uploaded file
    const url = await ctx.storage.getUrl(args.fileId);
    if (!url) throw new Error("Failed to get file URL");
    
    return await ctx.db.patch(args.id, {
      imageUrl: url,
      imageStorageId: args.fileId,
    });
  },
});

export const getAvailableUsers = query({
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    const profiles = await ctx.db.query("userProfiles").collect();
    
    const usedEmails = new Set(profiles.map(p => p.email));
    return users
      .filter(user => user.email && !usedEmails.has(user.email))
      .map(user => user.email);
  },
});
