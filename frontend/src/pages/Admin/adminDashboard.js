import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

const COLORS = ["#34D399", "#60A5FA", "#FBBF24", "#F87171"];

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalUsers: 0,
    revenueChartData: [],
  });

  const fetchDashboardData = useCallback(async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/dashboard-data`
      );
      setDashboardData(res.data);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const {
    totalOrders,
    totalRevenue,
    totalProducts,
    totalUsers,
    revenueChartData,
  } = dashboardData;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <Card title="Total Orders" value={totalOrders} />
        <Card
          title="Total Revenue"
          value={`₹ ${totalRevenue.toLocaleString()}`}
        />
        <Card title="Total Products" value={totalProducts} />
        <Card title="Total Users" value={totalUsers} />
      </div>

      {/* Revenue Chart */}
      <div className="bg-white shadow-md rounded p-6 w-full md:w-1/2 mx-auto">
        <h2 className="text-xl font-semibold mb-4">Revenue Breakdown</h2>
        {revenueChartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart
              margin={{
                top: 10,
                right: 20,
                bottom: 60, // <-- Add more bottom space between chart and legend
                left: 20,
              }}
            >
             <Pie
  data={revenueChartData}
  cx="50%"
  cy="55%"
  innerRadius={70}
  outerRadius={100}
  dataKey="value"
  label
  paddingAngle={5}          // Gap between slices
>
  {revenueChartData.map((entry, index) => (
    <Cell key={index} fill={COLORS[index % COLORS.length]} />
  ))}
</Pie>

              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500">No revenue data available.</p>
        )}
      </div>
    </div>
  );
};

const Card = ({ title, value }) => (
  <div className="bg-white shadow-md rounded p-4">
    <h2 className="text-gray-500 text-sm">{title}</h2>
    <p className="text-2xl font-semibold">{value}</p>
  </div>
);

export default AdminDashboard;
