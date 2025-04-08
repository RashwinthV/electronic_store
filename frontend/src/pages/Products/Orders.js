import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const fetchOrders = async (token) => {
  const res = await fetch(
    `${process.env.REACT_APP_BACKEND_URL}/my-orders/${localStorage.getItem(
      "userId"
    )}`
  );
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
};

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await fetchOrders(token);
        setOrders(data);
      } catch (error) {
        console.error(error);
        toast.error("Could not load orders.");
      }
    };

    loadOrders();
  }, [token]);

  const deliveredOrders = orders.filter(
    (order) => order.orderStatus === "Delivered"
  );
  const cancelledOrders = orders.filter(
    (order) => order.orderStatus === "Cancelled"
  );
  const otherOrders = orders.filter(
    (order) => !["Delivered", "Cancelled"].includes(order.orderStatus)
  );

  const renderOrders = (ordersList) => (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {ordersList.map((order) => (
        <div
          key={order._id}
          className="border border-gray-200 rounded-xl shadow-md p-4 bg-white hover:shadow-lg transition duration-200"
        >
          <h3
            className="text-blue-600 font-semibold cursor-pointer hover:underline text-sm sm:text-base mb-3"
            onClick={() => navigate(`/orders-details/${order._id}`)}
          >
            Order ID: {order._id}
          </h3>

          {/* Display up to 3 products only */}
          <div className="flex flex-wrap gap-4 mb-4">
            {order.cartItems.slice(0, 3).map((item, index) => {
              const product = item.productId || {};
              const productName = product.productName || "Product";
              let imageUrl = "";

              try {
                const rawUrl = product.productImage?.[0];
                if (rawUrl) {
                  const url = new URL(rawUrl);
                  const fileId = url.searchParams.get("id");
                  imageUrl = `${process.env.REACT_APP_IMAGE_URL}/proxy-image?fileId=${fileId}`;
                }
              } catch (err) {
                console.warn("Invalid image URL", err);
              }

              return (
                <div key={index} className="flex items-center gap-3">
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt={productName}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div className="text-sm">
                    <p className="font-medium">{productName}</p>
                    <p className="text-gray-600">Qty: {item.quantity}</p>
                    <p className="text-gray-600">Price: ₹{item.price}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order summary */}
          <div className="text-sm sm:text-base space-y-1 text-gray-700">
            <p >
            <span className="font-medium text-black-600">Status:</span> <span className="font-medium text-blue-600 font-bold">{order.orderStatus}</span>
            </p>
            <p>
              <span className="font-medium">Total:</span> ₹{order.totalPrice}
            </p>
            <p>
              <span className="font-medium">Items:</span> {order.totalQty}
            </p>
            <p>
              <span className="font-medium">Ordered On:</span>{" "}
              {formatDate(order.orderDate || order.createdAt)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-4 max-w-7xl mx-auto space-y-12">
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">
        My Orders
      </h2>

      {/* ⏳ Recent Orders */}
      {otherOrders.length > 0 && (
        <div>
          <h3 className="text-2xl font-semibold text-yellow-600 mb-4">
            Recent Orders
          </h3>
          {renderOrders(otherOrders)}
        </div>
      )}

      {/* ✅ Delivered Orders */}
      {deliveredOrders.length > 0 && (
        <div>
          <h3 className="text-2xl font-semibold text-green-600 mb-4">
            Delivered Orders
          </h3>
          {renderOrders(deliveredOrders)}
        </div>
      )}

      {/* ❌ Cancelled Orders */}
      {cancelledOrders.length > 0 && (
        <div>
          <h3 className="text-2xl font-semibold text-red-600 mb-4">
            Cancelled Orders
          </h3>
          {renderOrders(cancelledOrders)}
        </div>
      )}

      {/* No Orders */}
      {orders.length === 0 && (
        <div className="text-center text-gray-500 text-lg">
          No orders found.
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
