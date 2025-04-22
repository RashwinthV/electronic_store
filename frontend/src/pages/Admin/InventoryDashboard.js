import React, { useEffect, useState } from "react";
import axios from "axios";
import InventoryAlerts from "./Inventoryalert";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#00C49F"];

const InventoryDashboard = () => {
  const [inventoryData, setInventoryData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_IMAGE_URL}/admin/allproducts`)
      .then((res) => setInventoryData(res.data))
      .catch((err) => console.error("Error fetching inventory:", err));
  }, []);

  const inStock = inventoryData.filter((item) => item.stock > 0).length;
  const outOfStock = inventoryData.length - inStock;

  const stockChartData = [
    { name: "In Stock", value: inStock },
    { name: "Out of Stock", value: outOfStock },
  ];

  const categoryCounts = inventoryData.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {});

  const categoryChartData = Object.entries(categoryCounts).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  //   const categoryChartData = Object.entries(
  //     inventoryData.reduce((acc, item) => {
  //       acc[item.category] = (acc[item.category] || 0) + 1;
  //       return acc;
  //     }, {})
  //   ).map(([name, value]) => ({ name, value }));

  const inventoryAlerts = inventoryData.filter(
    (item) => item.stock === 0 || item.stock <= 5
  );

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Inventory Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-blue-100 p-4 rounded shadow text-center">
          <h3 className="text-lg font-semibold">Total Products</h3>
          <p className="text-2xl">{inventoryData.length}</p>
        </div>
        <div className="bg-green-100 p-4 rounded shadow text-center">
          <h3 className="text-lg font-semibold">In-Stock Products</h3>
          <p className="text-2xl">{inStock}</p>
        </div>
      </div>

      {/* Charts */}
      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product by Category Donut */}
        <div className="h-[500px] bg-white rounded shadow p-4 flex flex-col items-center justify-center">
          <h3 className="text-lg font-semibold mb-4 text-center">
            Product Distribution by Category
          </h3>
          <ResponsiveContainer height="100%">
            <PieChart
              margin={{
                top: 10,
                right: 20,
                bottom: 60, 
                left: 20,
              }}
            >
              <Pie
                data={categoryChartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={110}
                paddingAngle={5}
                label={({ name, value }) => `${name}: ${value}`}
              >
                {categoryChartData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={10} />{" "}
              {/* Control legend height */}
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Stock Status Donut */}
        <div className="h-[500px] bg-white rounded shadow p-4 flex flex-col items-center justify-center">
        <h3 className="text-lg font-semibold mb-4 text-center">
            Stock Status
          </h3>
          <ResponsiveContainer height="100%">
            <PieChart
              margin={{
                top: 10,
                right: 20,
                bottom: 60, 
                left: 20,
              }}
            >
              {" "}
              <Pie
                data={stockChartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                paddingAngle={3}
                labelLine
                label={({ name, value }) => `${name}: ${value}`}
              >
                {stockChartData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Inventory Alerts */}
      <InventoryAlerts
        inventoryAlerts={inventoryAlerts}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default InventoryDashboard;
