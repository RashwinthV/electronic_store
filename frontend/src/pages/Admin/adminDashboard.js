import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import {
  FaExclamationCircle,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { toast } from "react-toastify";

const COLORS = ["#34D399", "#60A5FA", "#FBBF24", "#F87171"];
const ITEMS_PER_PAGE = 5;

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalUsers: 0,
    inventoryAlerts: [],
    totalInventoryAlerts: 0,
    revenueChartData: [],
  });

  const [currentPage, setCurrentPage] = useState(1);

  const fetchDashboardData = useCallback(async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/dashboard-data?page=${currentPage}&limit=${ITEMS_PER_PAGE}`
      );
      setDashboardData(res.data);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const {
    totalOrders,
    totalRevenue,
    totalProducts,
    totalUsers,
    inventoryAlerts,
    totalInventoryAlerts,
    revenueChartData,
  } = dashboardData;

  const totalPages = Math.ceil(totalInventoryAlerts / ITEMS_PER_PAGE);

  const handleClick = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_IMAGE_URL}/mail/send-stock-report`
      );
      toast.success(res.data.message); // ✅ or show toast
    } catch (error) {
      console.error("Error sending report:", error);
      toast.error("Failed to send report");
    }
  };

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
            <PieChart>
              <Pie
                data={revenueChartData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                dataKey="value"
                label
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

      {/* Inventory Alerts */}
      <div className="bg-white shadow-md rounded-lg p-6 mt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Inventory Alerts
          </h2>

          <button
            onClick={handleClick}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold text-sm md:text-base px-4 py-2 rounded-md shadow transition duration-300"
          >
            Get Stock Report
          </button>
        </div>

        {inventoryAlerts.length === 0 ? (
          <p className="text-gray-500">
            ✅ All products are sufficiently stocked.
          </p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left font-medium text-gray-600">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left font-medium text-gray-600">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left font-medium text-gray-600">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {[...inventoryAlerts]
                    .sort((a, b) => {
                      const getPriority = (item) => {
                        if (item.stock > 0 && item.stock <= 5) return 0; // Low stock
                        if (item.stock === 0) return 1; // Out of stock
                        return 2; // In stock
                      };
                      return getPriority(a) - getPriority(b);
                    })
                    .map((item, index) => {
                      const isCritical = item.stock === 0;
                      const isLow = item.stock > 0 && item.stock <= 5;

                      const statusBadge = isCritical
                        ? "bg-red-100 text-red-600"
                        : isLow
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-green-100 text-green-600";

                      const statusText = isCritical
                        ? "Out of Stock"
                        : isLow
                        ? "Low Stock"
                        : "In Stock";

                      const Icon = isCritical
                        ? FaExclamationCircle
                        : isLow
                        ? FaExclamationTriangle
                        : FaCheckCircle;

                      const iconColor = isCritical
                        ? "text-red-500"
                        : isLow
                        ? "text-yellow-500"
                        : "text-green-500";

                      const stockColor = isCritical
                        ? "text-red-600 font-semibold"
                        : isLow
                        ? "text-yellow-600 font-medium"
                        : "text-green-600";

                      return (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-3 font-medium text-gray-900">
                            <div className="flex items-center gap-2">
                              {isCritical && (
                                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping inline-block"></span>
                              )}
                              {item.productName}
                            </div>
                          </td>
                          <td className={`px-6 py-3 ${stockColor}`}>
                            <div className="flex items-center gap-2">
                              <Icon className={iconColor} />
                              {item.stock}
                            </div>
                          </td>
                          <td className="px-6 py-3">
                            <span
                              className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${statusBadge}`}
                            >
                              {statusText}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-4 gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="px-3 py-1 border rounded text-sm disabled:opacity-50"
              >
                Prev
              </button>
              <span className="px-3 py-1 text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="px-3 py-1 border rounded text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
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
