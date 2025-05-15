import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getDashboardMetrics = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const loads = await ctx.db.query("loads").collect();
    const tasks = await ctx.db.query("tasks").collect();
    const users = await ctx.db.query("userProfiles").collect();

    const totalRevenue = loads.reduce((sum, load) => sum + (load.totalFinalInvoice || 0), 0);
    const pendingInvoices = loads.filter(load => !load.dateClientPaid && load.dateInvoicedClient).length;
    const activeLoads = loads.filter(load => load.loadStatus === "Active").length;
    const completedLoads = loads.filter(load => load.loadProgress === "Delivered").length;
    const pendingTasks = tasks.filter(task => task.status === "Pending").length;
    const incomingTasks = tasks.filter(task => task.status === "Assigned").length;

    // Calculate monthly revenue
    const monthlyRevenue = loads.reduce((acc, load) => {
      if (load.dateInvoicedClient) {
        const month = load.dateInvoicedClient.slice(0, 7); // YYYY-MM
        acc[month] = (acc[month] || 0) + (load.totalFinalInvoice || 0);
      }
      return acc;
    }, {} as Record<string, number>);

    // Calculate top performer
    const userCompletedLoads = users.map(user => {
      const userLoads = loads.filter(load => 
        load.assignedAgentId === user._id && 
        load.loadProgress === "Delivered"
      );
      return {
        name: user.name,
        completedLoads: userLoads.length,
        revenue: userLoads.reduce((sum, load) => sum + (load.totalFinalInvoice || 0), 0)
      };
    });

    const topPerformer = userCompletedLoads.sort((a, b) => b.completedLoads - a.completedLoads)[0];

    // Calculate branch performance
    const branchPerformance = loads.reduce((acc, load) => {
      if (load.branch && load.loadProgress === "Delivered") {
        acc[load.branch] = (acc[load.branch] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const topBranch = Object.entries(branchPerformance)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || "N/A";

    // Calculate bottom performers (only sales agents)
    const salesAgents = users.filter(user => 
      user.role === "Broker Sales Agent" || user.role === "Carrier Sales Agent"
    ).map(user => {
      const userLoads = loads.filter(load => 
        load.assignedAgentId === user._id && 
        load.loadProgress === "Delivered"
      );
      return {
        name: user.name,
        role: user.role,
        completedLoads: userLoads.length,
        revenue: userLoads.reduce((sum, load) => sum + (load.totalFinalInvoice || 0), 0)
      };
    }).sort((a, b) => a.completedLoads - b.completedLoads);

    const bottomPerformers = salesAgents.slice(0, 3);

    return {
      totalRevenue,
      pendingInvoices,
      activeLoads,
      completedLoads,
      pendingTasks,
      incomingTasks,
      monthlyRevenue,
      topPerformer,
      topBranch,
      branchPerformance,
      bottomPerformers
    };
  }
});
