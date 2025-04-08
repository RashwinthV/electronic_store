import React, { useCallback, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import SummaryApi from "../../common";
import Context from "../../context";
import displayINRCurrency from "../../helpers/displayCurrency";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import BuyAgain from "./buyAgain";

const Cart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeImage, setActiveImage] = useState({});
  const context = useContext(Context);
  const navigate = useNavigate();
  const loadingCart = new Array(4).fill(null);
  const userId = localStorage.getItem("userId");
//get cart data
  const fetchData = useCallback(async () => {
    if (!userId) {
      console.error("User ID not found in localStorage. Please log in.");
      return;
    }

    try {
      setLoading(true);
      const apiUrl = `${
        SummaryApi.addToCartProductView.url
      }?userId=${encodeURIComponent(userId)}`;
      const response = await fetch(apiUrl, {
        method: SummaryApi.addToCartProductView.method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      const responseData = await response.json();

      if (response.ok && responseData.success) {
        setData(responseData.data);
        
        localStorage.setItem("cartCount", responseData.data[0].items.length);
      } else {
        console.error("Error fetching cart data:", responseData.message);
      }
    } catch (error) {
      console.error("Failed to fetch cart data:", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);


//render image
  useEffect(() => {
    if (data.length > 0) {
      const imageMap = {};
      data.forEach((item) => {
        item.items.forEach((productItem) => {
          const product = productItem?.productId;
          if (product?.productImage?.length > 0) {
            const imageUrl = product.productImage[0];
            try {
              const url = new URL(imageUrl);
              const fileId = url.searchParams.get("id");
              imageMap[product._id] = fileId
                ?  `${process.env.REACT_APP_IMAGE_URL}/proxy-image?fileId=${fileId}`
                : imageUrl;
            } catch {
              imageMap[product._id] = imageUrl;
            }
          }
        });
      });
      setActiveImage(imageMap);
    }
  }, [data]);

  //update cart quantity
  const updateQty = async (id, newQty, productId) => {
    if (newQty < 1) {
      toast.error("Minimum quantity is 1.");
      return;
    }

    try {
      const response = await fetch(SummaryApi.updateCartProduct.url, {
        method: SummaryApi.updateCartProduct.method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _id: id,
          userId: localStorage.getItem("userId"),
          productId: productId, // Ensure productId is included
          quantity: newQty,
        }),
      });

      const responseData = await response.json();
      if (responseData.success) {
        fetchData();
      } else {
        toast.error(responseData.message || "Failed to update quantity.");
      }
    } catch (error) {
      toast.error("Error updating quantity: " + error.message);
    }
  };



  const deleteCartProduct = async (id) => {
    
    try {
      const response = await fetch(SummaryApi.deleteCartProduct.url, {
        method: SummaryApi.deleteCartProduct.method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: id }),
      });

      const responseData = await response.json();
      
      if (responseData.success) {
        fetchData();
        context.fetchUserAddToCart();
      } else {
        toast.error("Failed to delete product.");
      }
    } catch (error) {
      toast.error("Error deleting product: " + error.message);
    }
  };

  const totalQty = data.reduce(
    (prev, curr) =>
      prev + curr.items.reduce((acc, item) => acc + item.quantity, 0),
    0
  );
  const totalPrice = data.reduce(
    (prev, curr) =>
      prev +
      curr.items.reduce(
        (acc, item) =>
          acc + item.quantity * (item.productId?.sellingPrice || 0),
        0
      ),
    0
  );

  const handlePayment = () => {
    navigate("/paymentMethod", {
      state: { cartItems: data, totalPrice, totalQty },
    });
  };

  return (
    <div className="container mx-auto">
      <div className="text-center text-lg my-3">
        {data.length === 0 && !loading && (
          <p className="bg-white py-5">No Data</p>
        )}
      </div>

      <div className="flex flex-col lg:flex-row overflow-x-auto max-h-[450px] gap-10 lg:justify-between p-4 scrollbar-none">
        <div className="w-full max-w-3xl">
          {loading
            ? loadingCart.map((_, index) => (
                <div
                  key={index}
                  className="w-full bg-slate-200 h-32 my-2 border border-slate-300 animate-pulse rounded"
                ></div>
              ))
            : data.map((cartItem, index) => {
                return cartItem.items.map((productItem) => {
                  const productImage =
                    activeImage[productItem?.productId?._id] ||
                    productItem?.productId?.productImage?.[0] ||
                    "";

                  return (
                    <div
                      key={productItem?._id}
                      className="w-full bg-white h-32 my-2 border border-slate-300 rounded grid grid-cols-[128px,1fr]"
                    >
                      <div className="w-32 h-32 bg-slate-200 flex items-center justify-center overflow-hidden">
                        <img
                          src={productImage}
                          alt={`Product ${index}`}
                          className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
                        />
                      </div>

                      <div className="px-4 py-2 relative">
                        <div
                          className="absolute right-0 text-red-600 rounded-full p-2 hover:bg-red-600 hover:text-white cursor-pointer"
                          onClick={() => deleteCartProduct(productItem?._id)}
                        >
                          <MdDelete />
                        </div>

                        <h2 className="text-lg lg:text-xl text-ellipsis line-clamp-1">
                          {productItem?.productId?.productName}
                        </h2>
                        <p className="capitalize text-slate-500">
                          {productItem?.productId?.category}
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-red-600 font-medium text-lg">
                            {displayINRCurrency(
                              productItem?.productId?.sellingPrice ?? 0
                            )}
                          </p>
                         
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <button
                            className="border border-red-600 text-red-600 hover:bg-red-600 hover:text-white w-6 h-6 flex justify-center items-center rounded"
                            onClick={() =>
                              updateQty(
                                cartItem._id,
                                productItem?.quantity - 1,
                                productItem?.productId?._id
                              )
                            } // Pass the productId here
                          >
                            -
                          </button>
                          <span>{productItem?.quantity}</span>
                          <button
                            className="border border-red-600 text-red-600 hover:bg-red-600 hover:text-white w-6 h-6 flex justify-center items-center rounded"
                            onClick={() =>
                              updateQty(
                                cartItem._id,
                                productItem?.quantity + 1,
                                productItem?.productId?._id
                              )
                            } // Pass the productId here
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                });
              })}
        </div>

        <div className="w-full max-h-[180px] max-w-sm bg-white p-4 shadow-lg rounded">
          <h2 className="text-white bg-red-600 px-4 py-1">Summary</h2>
          <p>Total Quantity: {totalQty}</p>
          <p>Total Price: {displayINRCurrency(totalPrice)}</p>
          <button
            onClick={handlePayment}
            className="bg-blue-600 p-2 text-white w-full mt-2"
          >
            Proceed to Payment
          </button>
        </div>
      </div>
      <BuyAgain refreshCart={fetchData} />
    </div>
  );
};

export default Cart;
