import React from "react";
import {
  FaExclamationCircle,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

const ITEMS_PER_PAGE = 5;

const InventoryAlerts = ({ inventoryAlerts, currentPage, setCurrentPage }) => {
  const totalPages = Math.ceil(inventoryAlerts.length / ITEMS_PER_PAGE);

  const paginatedAlerts = inventoryAlerts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Inventory Alerts
        </h2>

        <button
          onClick={() => {
            fetch(`${process.env.REACT_APP_IMAGE_URL}/mail/send-stock-report`)
              .then((res) => res.json())
              .then((data) => alert(data.message))
              .catch(() => alert("Failed to send report"));
          }}
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
                {[...paginatedAlerts]
                  .sort((a, b) => {
                    const getPriority = (item) => {
                      if (item.stock > 0 && item.stock <= 5) return 0;
                      if (item.stock === 0) return 1; 
                      return 2;
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
  );
};

export default InventoryAlerts;
