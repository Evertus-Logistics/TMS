import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { useEffect, useState } from 'react';
import { USAMap3D } from './USAMap3D';
import React from 'react';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const quotes: string[] = [
  "Dream big. Start small. Act now. #Let'sMakeMoneyTogether",
  "Your dream doesn't work unless you do. #Let'sMakeMoneyTogether",
  "Chase the vision, not the money. #Let'sMakeMoneyTogether",
  "If you can see it, you can be it. #Let'sMakeMoneyTogether",
  "Success is the child of daring and persistence. #Let'sMakeMoneyTogether",
  "Dreams don't die—people quit. #Let'sMakeMoneyTogether",
  "One step every day turns dreams into destiny. #Let'sMakeMoneyTogether",
  "A goal is a dream with a deadline. #Let'sMakeMoneyTogether",
  "Don't wait for permission to live your vision. #Let'sMakeMoneyTogether",
  "Your comfort zone will kill your dreams. #Let'sMakeMoneyTogether",
  "Every 'no' brings you closer to a 'yes'. #Let'sMakeMoneyTogether",
  "Fear is temporary. Regret is forever. #Let'sMakeMoneyTogether",
  "You miss 100% of the shots you don't take. #Let'sMakeMoneyTogether",
  "The worst they can say is no. The best is life-changing. #Let'sMakeMoneyTogether",
  "Confidence grows with every attempt. #Let'sMakeMoneyTogether",
  "Don't take rejection personally—take it professionally. #Let'sMakeMoneyTogether",
  "Clients don't reject you—they reject timing. #Let'sMakeMoneyTogether",
  "Rejection is redirection. #Let'sMakeMoneyTogether",
  "Each 'no' builds resilience. #Let'sMakeMoneyTogether",
  "You're not selling—you're offering a solution. #Let'sMakeMoneyTogether",
  "Grind now so you can glide later. #Let'sMakeMoneyTogether",
  "Work like others won't, live like others can't. #Let'sMakeMoneyTogether",
  "Sacrifice comfort for freedom. #Let'sMakeMoneyTogether",
  "Success loves the stubborn. #Let'sMakeMoneyTogether",
  "Early mornings build early retirements. #Let'sMakeMoneyTogether",
  "While they sleep, you build. #Let'sMakeMoneyTogether",
  "Temporary hustle, permanent freedom. #Let'sMakeMoneyTogether",
  "Earn now. Play later. Forever. #Let'sMakeMoneyTogether",
  "Outwork yesterday's self. #Let'sMakeMoneyTogether",
  "Late nights, bright future. #Let'sMakeMoneyTogether",
  "Discipline beats motivation. #Let'sMakeMoneyTogether",
  "The harder you work, the luckier you get. #Let'sMakeMoneyTogether",
  "Be relentless or be replaced. #Let'sMakeMoneyTogether",
  "When you feel like quitting, remember why you started. #Let'sMakeMoneyTogether",
  "The grind is ugly. The result is beautiful. #Let'sMakeMoneyTogether",
  "No one sees the work—just the lifestyle. #Let'sMakeMoneyTogether",
  "If it were easy, everyone would do it. #Let'sMakeMoneyTogether",
  "Winners show up even when it hurts. #Let'sMakeMoneyTogether",
  "Excuses don't retire—effort does. #Let'sMakeMoneyTogether",
  "Commit to the process, not the praise. #Let'sMakeMoneyTogether",
  "Design the life you want to wake up to. #Let'sMakeMoneyTogether",
  "Build a life you don't need a vacation from. #Let'sMakeMoneyTogether",
  "Success is living on your terms. #Let'sMakeMoneyTogether",
  "Freedom is earned—not given. #Let'sMakeMoneyTogether",
  "Create a legacy, not a paycheck. #Let'sMakeMoneyTogether",
  "Live like few today, to live like none tomorrow. #Let'sMakeMoneyTogether",
  "Hustle until your reality matches your vision. #Let'sMakeMoneyTogether",
  "Turn ambition into action. #Let'sMakeMoneyTogether",
  "Don't envy the life—build it. #Let'sMakeMoneyTogether",
  "It's your dream. Make it real. #Let'sMakeMoneyTogether"
];

export default function Dashboard() {
  const metrics = useQuery(api.dashboard.getDashboardMetrics);
  const profile = useQuery(api.users.getProfile);
  const [flash, setFlash] = useState(false);

  // Get daily quote based on the day of the year
  const getDailyQuote = () => {
    const today = new Date();
    const start = new Date(today.getFullYear(), 0, 0);
    const diff = today.getTime() - start.getTime();
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
    return quotes[dayOfYear % quotes.length];
  };

  useEffect(() => {
    const incomingTasks = metrics?.incomingTasks ?? 0;
    if (incomingTasks > 0) {
      const interval = setInterval(() => {
        setFlash(prev => !prev);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [metrics?.incomingTasks]);

  // Cleanup charts on unmount
  useEffect(() => {
    return () => {
      // Destroy all chart instances when component unmounts
      const charts = Object.values(ChartJS.instances);
      charts.forEach(chart => chart.destroy());
    };
  }, []);

  if (!metrics) return null;

  const months = Object.keys(metrics.monthlyRevenue).sort();
  const revenueData = months.map(month => metrics.monthlyRevenue[month]);

  const chartData = {
    labels: months.map(month => {
      const [year, monthNum] = month.split('-');
      return new Date(parseInt(year), parseInt(monthNum) - 1).toLocaleString('default', { month: 'short' });
    }),
    datasets: [
      {
        label: 'Monthly Revenue',
        data: revenueData,
        borderColor: '#FFD700',
        backgroundColor: 'rgba(255, 215, 0, 0.5)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'white',
        },
      },
      title: {
        display: true,
        text: 'Monthly Revenue',
        color: 'white',
      },
    },
    scales: {
      y: {
        ticks: { color: 'white' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
      },
      x: {
        ticks: { color: 'white' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
      },
    },
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: 'white',
          font: {
            size: 12
          }
        }
      }
    },
    cutout: '70%'
  };

  // Branch performance donut data
  const branchDonutData = {
    labels: ['Top Branch', 'Other Branches'],
    datasets: [{
      data: [
        metrics.branchPerformance?.[metrics.topBranch] || 0,
        Object.values(metrics.branchPerformance || {}).reduce((a, b) => a + b, 0) - 
        (metrics.branchPerformance?.[metrics.topBranch] || 0)
      ],
      backgroundColor: [
        '#FFD700',
        'rgba(255, 215, 0, 0.2)'
      ],
      borderColor: [
        '#B8860B',
        '#B8860B'
      ],
      borderWidth: 1
    }]
  };

  // Agent performance donut data
  const agentDonutData = {
    labels: ['Top Agent', 'Other Agents'],
    datasets: [{
      data: [
        metrics.topPerformer?.completedLoads || 0,
        metrics.completedLoads - (metrics.topPerformer?.completedLoads || 0)
      ],
      backgroundColor: [
        '#FFD700',
        'rgba(255, 215, 0, 0.2)'
      ],
      borderColor: [
        '#B8860B',
        '#B8860B'
      ],
      borderWidth: 1
    }]
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <p className="text-gray-400 text-sm italic mb-2">"{getDailyQuote()}" -Hector Martinez, C.E.O</p>
        <h1 className="text-2xl font-bold text-white [text-shadow:_0_0_5px_#FFD700,_0_0_10px_#FFC300,_0_0_15px_#FFA500]">
          Welcome, {profile?.name || 'User'}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
        <div className="bg-gray-900 p-6 rounded-lg border-2 border-yellow-400 shadow-[0_0_10px_2px_#FFD700]">
          <h3 className="text-[#FFD700] text-sm font-semibold mb-2">Total Revenue</h3>
          <p className="text-white text-2xl font-bold">${metrics.totalRevenue.toLocaleString()}</p>
        </div>

        <div className="bg-gray-900 p-6 rounded-lg border-2 border-yellow-400 shadow-[0_0_10px_2px_#FFD700]">
          <h3 className="text-[#FFD700] text-sm font-semibold mb-2">Pending Invoices</h3>
          <p className="text-white text-2xl font-bold">{metrics.pendingInvoices}</p>
        </div>

        <div className="bg-gray-900 p-6 rounded-lg border-2 border-yellow-400 shadow-[0_0_10px_2px_#FFD700]">
          <h3 className="text-[#FFD700] text-sm font-semibold mb-2">Active Loads</h3>
          <p className="text-white text-2xl font-bold">{metrics.activeLoads}</p>
        </div>

        <div className="bg-gray-900 p-6 rounded-lg border-2 border-yellow-400 shadow-[0_0_10px_2px_#FFD700]">
          <h3 className="text-[#FFD700] text-sm font-semibold mb-2">Completed Loads</h3>
          <p className="text-white text-2xl font-bold">{metrics.completedLoads}</p>
        </div>

        <div className="bg-gray-900 p-6 rounded-lg border-2 border-yellow-400 shadow-[0_0_10px_2px_#FFD700]">
          <h3 className="text-[#FFD700] text-sm font-semibold mb-2">Pending Tasks</h3>
          <p className="text-white text-2xl font-bold">{metrics.pendingTasks}</p>
        </div>

        <div 
          className={`bg-gray-900 p-6 rounded-lg border-2 transition-all duration-500 ${
            metrics.incomingTasks > 0
              ? flash 
                ? 'border-yellow-400 shadow-[0_0_10px_2px_#FFD700]'
                : 'border-blue-400 shadow-[0_0_10px_2px_#4299E1]'
              : 'border-yellow-400 shadow-[0_0_10px_2px_#FFD700]'
          }`}
        >
          <h3 className={`text-sm font-semibold mb-2 transition-colors duration-500 ${
            metrics.incomingTasks > 0
              ? flash 
                ? 'text-[#FFD700]'
                : 'text-blue-400'
              : 'text-[#FFD700]'
          }`}>
            Incoming Tasks
          </h3>
          <p className={`text-2xl font-bold transition-colors duration-500 ${
            metrics.incomingTasks > 0
              ? flash 
                ? 'text-white'
                : 'text-blue-200'
              : 'text-white'
          }`}>
            {metrics.incomingTasks}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-900 p-6 rounded-lg border-2 border-yellow-400 shadow-[0_0_10px_2px_#FFD700]">
          <h3 className="text-[#FFD700] text-lg font-semibold mb-4">Top Performers</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <p className="text-white text-sm mb-1">Leader in Completed Loads</p>
                <p className="text-2xl font-bold text-[#FFD700]">{metrics.topPerformer?.name || 'N/A'}</p>
                <p className="text-white text-sm">
                  {metrics.topPerformer?.completedLoads || 0} loads - ${metrics.topPerformer?.revenue.toLocaleString() || 0}
                </p>
              </div>
              <div>
                <p className="text-white text-sm mb-1">Top Performing Branch</p>
                <p className="text-2xl font-bold text-[#FFD700]">{metrics.topBranch}</p>
              </div>
            </div>
            <div className="h-48">
              <Doughnut data={agentDonutData} options={donutOptions} />
            </div>
          </div>
        </div>

        <div className="bg-gray-900 p-6 rounded-lg border-2 border-yellow-400 shadow-[0_0_10px_2px_#FFD700]">
          <h3 className="text-[#FFD700] text-lg font-semibold mb-4">Needs Improvement</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              {metrics.bottomPerformers.map((performer, index) => (
                <div key={index}>
                  <p className="text-white text-sm mb-1">{performer.role}</p>
                  <p className="text-xl font-bold text-[#FFD700]">{performer.name}</p>
                  <p className="text-white text-sm">
                    {performer.completedLoads} loads - ${performer.revenue.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
            <div className="h-48">
              <Doughnut data={branchDonutData} options={donutOptions} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-900 p-6 rounded-lg border-2 border-yellow-400 shadow-[0_0_10px_2px_#FFD700]">
          <Line data={chartData} options={chartOptions} />
        </div>

        <div className="bg-gray-900 p-6 rounded-lg border-2 border-yellow-400 shadow-[0_0_10px_2px_#FFD700]">
          <h3 className="text-[#FFD700] text-sm font-semibold mb-4">Live Deliveries</h3>
          <USAMap3D />
        </div>
      </div>
    </div>
  );
}
