import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { FaFire } from "react-icons/fa";
import axios from "axios";
import dayjs from "dayjs";

const SalesAnalysis = () => {
  const [salesData, setSalesData] = useState([]);
  const [compareData, setCompareData] = useState([]);
  const [topProduct, setTopProduct] = useState(null);
  const [filterType, setFilterType] = useState("month");
  const [selectedDate, setSelectedDate] = useState(dayjs().format("YYYY-MM"));
  const selectedMonthLabel = dayjs(selectedDate).format("MMMM");
  const previousMonthLabel = dayjs(selectedDate)
    .subtract(1, filterType === "month" ? "month" : "year")
    .format("MMMM");

  useEffect(() => {
    const now = dayjs();
    if (filterType === "month") {
      setSelectedDate(now.format("YYYY-MM"));
    } else {
      setSelectedDate(now.format("YYYY"));
    }
  }, [filterType]);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_IMAGE_URL}/admin/sales`
        );
        const allSales = res.data;

        let current = [],
          previous = [];

        if (filterType === "month") {
          const currentMonth = dayjs(selectedDate).format("YYYY-MM");
          const prevMonth = dayjs(selectedDate)
            .subtract(1, "month")
            .format("YYYY-MM");

          current = allSales.filter((item) =>
            item?.date?.startsWith(currentMonth)
          );
          previous = allSales.filter((item) =>
            item?.date?.startsWith(prevMonth)
          );
        } else {
          const currentYear = dayjs(selectedDate).format("YYYY");
          const prevYear = dayjs(selectedDate)
            .subtract(1, "year")
            .format("YYYY");

          current = allSales.filter((item) =>
            item?.date?.startsWith(currentYear)
          );
          previous = allSales.filter((item) =>
            item?.date?.startsWith(prevYear)
          );
        }

        setSalesData(current);
        setCompareData(previous);
      } catch (err) {
        console.error(err);
        toast.error("Error fetching sales data");
      }
    };

    const fetchTopProduct = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_IMAGE_URL}/admin/top-selling-product`
        );
        setTopProduct(res.data);
      } catch (err) {
        toast.error("Error fetching top product");
      }
    };

    fetchSalesData();
    fetchTopProduct();
  }, [filterType, selectedDate]);

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-8 w-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        📈 Sales Analysis
      </h2>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="border border-gray-300 px-3 py-1 rounded text-sm"
        >
          <option value="month">Monthly</option>
          <option value="year">Yearly</option>
        </select>

        {filterType === "month" ? (
          <input
            type="month"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-gray-300 px-3 py-1 rounded text-sm"
          />
        ) : (
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-gray-300 px-3 py-1 rounded text-sm"
          >
            {Array.from({ length: 6 }, (_, i) => {
              const year = new Date().getFullYear() + 1 - i;
              return (
                <option key={year} value={year}>
                  {year}
                </option>
              );
            })}
          </select>
        )}
      </div>

      {/* Chart - Selected Period */}
      <div className="w-full h-60 mb-10">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#3b82f6"
              strokeWidth={3}
              name={selectedMonthLabel}
              />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Chart - Previous Period */}
      <div className="w-full h-60">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={compareData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#f97316"
              strokeWidth={2}
              strokeDasharray="5 5"
              name={previousMonthLabel}
              />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Top Product */}
      {topProduct && (
        <div className="mt-8 p-5 bg-blue-50 border-l-4 border-blue-400 rounded-lg flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={(() => {
                  try {
                    const url = new URL(topProduct.image);
                    const fileId = url.searchParams.get("id");
                    return fileId
                      ? `${process.env.REACT_APP_IMAGE_URL}/proxy-image?fileId=${fileId}`
                      : topProduct.image;
                  } catch {
                    return topProduct.image;
                  }
                })()}
                alt={topProduct.productName}
                className="w-30 h-20 object-cover rounded-md shadow"
              />
              <div className="absolute -top-2 -right-2 text-red-600 text-xl animate-bounce">
                <FaFire />
              </div>
            </div>
            <div>
              <p className="text-gray-800 font-semibold text-lg">
                Most Selling Product
              </p>
              <p className="text-blue-700 font-bold">
                {topProduct.productName}
              </p>
              <p className="text-gray-600 text-sm">
                Brand: {topProduct.brandName}
              </p>
              <p className="text-green-600 font-semibold">
                ₹{topProduct.price?.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="text-sm text-gray-600 font-medium">
            🔄 {topProduct.salesCount} units sold
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesAnalysis;
