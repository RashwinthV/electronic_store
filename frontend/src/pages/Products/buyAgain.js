import React, { useEffect, useState } from "react";
import addToCart from "../../helpers/addToCart";
import { Link } from "react-router-dom";

import displayINRCurrency from "../../helpers/displayCurrency";

const BuyAgain = ({ refreshCart }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId");

  // State for dynamically setting product images
  const [activeImages, setActiveImages] = useState({});

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userId) {
        alert("Please log in to view your orders.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/buyagain/${userId}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        const data = await response.json();

        if (response.ok) {
          const uniqueMap = new Map();
        
          // Go through each order
          data?.data?.forEach((order) => {
            const product = order?.items?.[0]?.productId;
            if (product && !uniqueMap.has(product._id)) {
              uniqueMap.set(product._id, order);
            }
          });
        
          // Set only unique product orders
          setOrders(Array.from(uniqueMap.values()));
        } else {
          alert(data.message || "Failed to fetch orders.");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        alert("Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  useEffect(() => {
    if (orders.length > 0) {
      const updatedImages = {};
      orders.forEach((order) => {
        const imageUrl = order?.items[0]?.productId?.productImage?.[0] || "";
        if (imageUrl) {
          try {
            const url = new URL(imageUrl);
            const fileId = url.searchParams.get("id");
            updatedImages[order._id] = fileId
              ?  `${process.env.REACT_APP_IMAGE_URL}/proxy-image?fileId=${fileId}`
              : imageUrl;
          } catch (error) {
            console.error("Invalid image URL:", error);
            updatedImages[order._id] = imageUrl;
          }
        }
      });

      setActiveImages(updatedImages);
    }
  }, [orders]);

  if (loading) {
    return <p className="text-center text-gray-600">Loading orders...</p>;
  }

  const handleAddToCart = async (e, productId) => {
    e.preventDefault();
    await addToCart(e, productId);
    refreshCart();
  };

  return (
    <div className="container max-w-[100%] p-4 max-w-4xl overflow-x-auto">
      <h2 className="text-2xl font-bold mb-4">Buy Again</h2>

      {orders.length === 0 ? (
        <p className="text-gray-600">You have no previous orders.</p>
      ) : (
        <div className="flex flex-wrap gap-4">
          {orders.map((order) => {
            const product = order?.items[0]?.productId;
            const productImage = activeImages[order._id] || "";
            const productName = product?.productName || "Unknown Product";
            const brandName = product?.brandName || "Unknown Brand";
            const price = product?.sellingPrice || 0;
            const quantity = order?.items[0]?.quantity || 0;

            return (
              <Link
              key={product?._id}
              to={`product/${product?._id}`}
              className="w-full min-w-[280px] md:min-w-[320px] max-w-[280px] md:max-w-[320px] bg-white rounded-sm shadow relative border p-4"
            >
                {/* Product Image */}
                <div className="h-40 flex justify-center items-center mb-3">
                  <img
                    src={productImage}
                    alt={`Product ${productName}`}
                    className="w-auto h-full object-contain"
                  />
                </div>

                {/* Product Details */}
                <h3 className="text-lg font-semibold truncate">{productName}</h3>
                <p className="text-gray-500">{brandName}</p>
                <p className="text-red-600 font-semibold">
                  {displayINRCurrency(price)}
                </p>
                <p className="text-gray-500">Quantity: {quantity}</p>

                {/* Buy Again Button */}
                <button
                  className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 w-full"
                  onClick={(e) => handleAddToCart(e, product?._id)}
                >
                  Add to Cart
                </button>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BuyAgain;
