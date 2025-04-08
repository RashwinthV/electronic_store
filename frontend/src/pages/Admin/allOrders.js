import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [editingStatus, setEditingStatus] = useState({});

  const fetchOrders = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/admin-orders`
      );
      const data = await res.json();
      if (res.ok && Array.isArray(data.orders)) {
        const orderStatusPriority = {
          Ordered: 1,
          Shipped: 2,
          "Out for Delivery": 3,
          Delivered: 4,
          Cancelled: 5,
        };
        const sorted = [...data.orders].sort(
          (a, b) =>
            (orderStatusPriority[a.orderStatus] || 999) -
            (orderStatusPriority[b.orderStatus] || 999)
        );
        setOrders(sorted);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error("Failed to fetch orders", err);
      setOrders([]);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/admin-orders/${orderId}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      if (res.ok) {
        fetchOrders();
        toast.success("Status updated");
      } else {
        toast.error("Status update failed");
      }
    } catch (err) {
      toast.error("Error updating status");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Group orders by status
  const groupedOrders = orders.reduce((acc, order) => {
    const status = order.orderStatus || "Unknown";
    if (!acc[status]) acc[status] = [];
    acc[status].push(order);
    return acc;
  }, {});

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">All Orders</h2>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-6">
          {[
            "Ordered",
            "Shipped",
            "Out for Delivery",
            "processing",
            "Delivered",
            "Cancelled",
            ...Object.keys(groupedOrders).filter(
              (status) =>
                ![
                  "Ordered",
                  "Shipped",
                  "Out for Delivery",
                  "processing",
                  "Delivered",
                  "Cancelled",
                ].includes(status)
            ),
          ]
            .filter((status) => groupedOrders[status]?.length > 0)
            .map((status) => (
              <div key={status}>
                <h3 className="text-lg font-semibold text-blue-700 mb-2">
                  {status}
                </h3>

                {groupedOrders[status].map((order) => {
                  const isFinalStatus =
                    order.orderStatus === "Delivered" ||
                    order.orderStatus === "Cancelled";

                  return (
                    <div
                      key={order._id}
                      className="border rounded p-4 shadow-md bg-white flex flex-col md:flex-row gap-4 mt-2 w-full"
                    >
                      {/* Order Info */}
                      <div className="flex-1 space-y-2">
                        <p>
                          <strong>Order ID:</strong> {order._id}
                        </p>
                        <p>
                          <strong>User:</strong> {order.user?.name || "N/A"}
                        </p>
                        <p>
                          <strong>Date:</strong>{" "}
                          {new Date(order.createdAt).toLocaleString()}
                        </p>
                        <p>
                          <strong>Total:</strong> ₹{order.totalPrice}
                        </p>

                        <div className="mt-2">
                          <strong>Status:</strong>
                          <select
                            className="ml-2 border px-2 py-1 rounded disabled:opacity-50"
                            value={
                              editingStatus[order._id] ?? order.orderStatus
                            }
                            disabled={isFinalStatus}
                            onChange={(e) =>
                              setEditingStatus({
                                ...editingStatus,
                                [order._id]: e.target.value,
                              })
                            }
                          >
                            <option value="Ordered">Ordered</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Out for Delivery">
                              Out for Delivery
                            </option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>

                          <button
                            className={`ml-4 px-3 py-1 rounded text-white transition mt-4 ${
                              isFinalStatus
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                            }`}
                            onClick={() =>
                              updateStatus(order._id, editingStatus[order._id])
                            }
                            disabled={isFinalStatus}
                          >
                            Update
                          </button>
                        </div>

                        <div>
                          <strong>Items:</strong>
                          <ul className="ml-4 list-disc">
                            {(order.items || []).map((item, index) => (
                              <li key={index}>
                                {item.productName || "Product"} -{" "}
                                {item.quantity} x ₹{item.price}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Product Images */}
                      <div className="w-full md:w-60 overflow-y-auto h-60">
                        <div className="grid grid-cols-2 gap-4">
                          {(order.items || []).map((item, index) => {
                            const el = item.productimage?.[0];
                            if (!el) return null;

                            const imageUrl = (() => {
                              try {
                                const url = new URL(el);
                                const fileId = url.searchParams.get("id");
                                return fileId
                                  ? `${process.env.REACT_APP_IMAGE_URL}/proxy-image?fileId=${fileId}`
                                  : el;
                              } catch {
                                return el;
                              }
                            })();

                            return (
                              <div
                                key={index}
                                className="min-w-[100px] h-[100px] border rounded overflow-hidden flex-shrink-0"
                              >
                                <img
                                  src={imageUrl}
                                  alt={item.productName || "Product"}
                                  className="w-full h-full object-contain"
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
