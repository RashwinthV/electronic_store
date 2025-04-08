import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const API_BASE = process.env.REACT_APP_BACKEND_URL;

const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const res = await fetch(`${API_BASE}/order/${orderId}`);
        const data = await res.json();
        setOrder(data);
      } catch (err) {
        console.error("Failed to load order details", err);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (!order)
    return <p className="text-center mt-6 text-gray-600">Loading...</p>;

  return (
    <div className="p-4 max-w-6xl mx-auto mt-10 grid md:grid-cols-3 gap-6">
      {/* Left: Order Details */}
      <div className="col-span-2 bg-white rounded shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Order Details</h2>

        {/* Order Summary */}
        <div className="grid md:grid-cols-2 gap-4 border-b pb-4">
          <div>
            <p>
              <span className="font-semibold">Order ID:</span> {order._id}
            </p>
            <p>
              <span className="font-semibold">Status:</span> {order.orderStatus}
            </p>
            <p>
              <span className="font-semibold">Total Price:</span> ₹
              {order.totalPrice}
            </p>
            <p>
              <span className="font-semibold">Items:</span> {order.totalQty}
            </p>
            <p>
              <span className="font-semibold">Payment:</span>{" "}
              {order.paymentMethod} - {order.paymentStatus}
            </p>
          </div>

          {/* Shipping Address */}
          <div>
            <h4 className="font-semibold mb-1">Shipping Address</h4>
            <p>{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.address}</p>
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.postalCode}
            </p>
            <p>{order.shippingAddress.country}</p>
            <p>{order.shippingAddress.phoneNumber}</p>
          </div>
        </div>

        {/* Order Items */}
        <div className="mt-6">
  <h4 className="text-lg font-semibold mb-3">Items</h4>

  <ul className="space-y-4 max-h-[420px] overflow-y-auto pr-2">
    {order.cartItems.map((item, index) => {
      const imageUrl = (() => {
        try {
          const url = new URL(item.productId?.productImage?.[0] || "");
          const fileId = url.searchParams.get("id");
          return `${process.env.REACT_APP_IMAGE_URL}/proxy-image?fileId=${fileId}`;
        } catch {
          return "";
        }
      })();

      return (
        <li
          key={index}
          className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border p-4 rounded-md shadow-sm bg-white"
        >
          {imageUrl && (
            <img
              src={imageUrl}
              alt={item.productId?.name || "Product"}
              className="w-24 h-24 object-cover rounded"
            />
          )}
          <div className="flex-1">
            <p className="font-medium">
              {item.productId?.productName || "Product"}
            </p>
            <p>Qty: {item.quantity}</p>
            <p className="text-sm text-gray-600">Price: ₹{item.price}</p>
          </div>
        </li>
      );
    })}
  </ul>
</div>

      </div>

      {/* Right: Tracking & Status */}
      <div className="bg-white rounded shadow-md p-6 h-fit">
        <h3 className="text-xl font-semibold mb-4">Track Order</h3>
        <p>
          <span className="font-medium">Current Status:</span>{" "}
          {order.orderStatus}
        </p>
        <p>
          <span className="font-medium">Tracking ID:</span> #
          {order._id?.slice(-6).toUpperCase()}
        </p>
        <p>
          <span className="font-medium">Estimated Delivery:</span> 3–5 business
          days
        </p>

        <h4 className="text-sm font-semibold text-center mt-10 mb-4 text-gray-700">
          Order Progress
        </h4>

        <div className="flex justify-center">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute mx-5 left-2.5 top-2 bottom-2 w-0.5 bg-gray-300" />

            <div className="space-y-6 pl-6">
              {["Ordered", "Shipped", "Out for Delivery", "Delivered"].map(
                (step, index) => {
                  const isActive =
                    step === "Ordered" ||
                    (step === "Shipped" &&
                      ["Shipped", "Out for Delivery", "Delivered"].includes(
                        order.orderStatus
                      )) ||
                    (step === "Out for Delivery" &&
                      ["Out for Delivery", "Delivered"].includes(
                        order.orderStatus
                      )) ||
                    (step === "Delivered" && order.orderStatus === "Delivered");

                  const isCurrentStep = step === order.orderStatus;

                  return (
                    <div
                      key={index}
                      className="relative flex items-center gap-3"
                    >
                      {/* Dot */}
                      <div
                        className={`w-4 h-4 rounded-full z-10 ${
                          isCurrentStep
                            ? "bg-green-500 animate-blink shadow-lg shadow-green-300"
                            : isActive
                            ? "bg-green-500"
                            : "bg-gray-400"
                        }`}
                      />
                      {/* Step Text */}
                      <p
                        className={`text-sm ${
                          isActive
                            ? "text-green-600 font-medium"
                            : "text-gray-500"
                        }`}
                      >
                        {step}
                      </p>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
