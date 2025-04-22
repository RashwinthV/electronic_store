import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const PaymentMethod = () => {
  const location = useLocation();
  const { cartItems = [], totalPrice = 0, totalQty = 0 } = location.state || {};
  const navigate = useNavigate();
  const [selectedPayment, setSelectedPayment] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("saved");
  const [activeImage, setActiveImage] = useState({});
  const [user, setUser] = useState({});
  const [showAddressOptions, setShowAddressOptions] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);

  const [newAddress, setNewAddress] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phoneNo: "",
  });

  const userid = localStorage.getItem("userId");
  const [savedAddress, setSavedAddress] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phoneNo: "",
  });

  // Fetch saved address from API
  const fetchSavedAddress = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/address/${userid}`,
        { method: "GET" }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch address");
      }

      const data = await response.json();
      console.log(data);

      const savedAddress = {
        ...data.addresses,
        phoneNo: data.phoneNo,
      };
      setSavedAddress(savedAddress);
      
      setUser(data);
    } catch (error) {
      console.error("Error fetching saved address:", error);
    }
  };
console.log(savedAddress);


  // Fetch product images from cart
  useEffect(() => {
    if (cartItems.length > 0) {
      try {
        const imageMap = {};
  
        cartItems.forEach((cartItem) => {
  
          cartItem.items.forEach((item) => {
  
            const product = item?.productId;
            console.log("Product:", product);
  
            if (product?.productImage?.length > 0) {
              const imageUrl = product.productImage[0];
  
              try {
                const url = new URL(imageUrl);
                const fileId = url.searchParams.get("id");
  
                if (fileId) {
                  const proxyUrl = `${process.env.REACT_APP_IMAGE_URL}/proxy-image?fileId=${fileId}`;
                  imageMap[product._id] = proxyUrl;
                } else {
                  imageMap[product._id] = imageUrl; 
                }
              } catch (error) {
                imageMap[product._id] = imageUrl;
              }
            }
          });
        });
  
        setActiveImage(imageMap);
      } catch (error) {
        console.error("Error processing images:", error);
      }
    }
  }, [cartItems]);
  
  
  

  const paymentMethods = [
    { id: "card", name: "Card", available: false },
    { id: "bank", name: "Bank Transfer", available: false },
    { id: "crypto", name: "Cryptocurrency", available: false },
    { id: "cod", name: "Cash on Delivery (COD)", available: true },
  ];

  const handleAddressChange = (e) => {
    setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
  };

  const handleSaveNewAddress = () => {
    setSavedAddress(newAddress);
    setShowAddressForm(false);
    setSelectedAddress("saved");
  };

  const placeOrder = async () => {
    const formattedCartItems = cartItems.map((item) => {
        return item.items.map((productItem) => {
        
        if (!productItem.productId) {
          console.error("ProductId is missing for item:", productItem);
          return null; 
        }
  
        return {
          productId: productItem.productId._id, 
          quantity: productItem.quantity, 
          price: productItem.productId.sellingPrice || productItem.productId.price, 
        };
      }).filter((item) => item !== null);
    }).flat();
  
    savedAddress.fullName = user.name;
    savedAddress.phoneNo = user.phoneNo;
  
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/place-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: localStorage.getItem("userId"),
            cartItems: formattedCartItems,
            totalPrice,
            totalQty,
            paymentMethod: selectedPayment,
            shippingAddress: selectedAddress === "saved" ? savedAddress : newAddress,
            orderdate: new Date()
          }),
        }
      );
  
      const data = await response.json();
      if (response.ok) {
        toast.success("Order placed successfully!");
        localStorage.setItem("cartCount",0)
        navigate("/cart");
      } else {
        toast.error(data.message || "Failed to place order.");
      }
    } catch (error) {      
      toast.error("Error placing order: " + error.message);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-10 p-6 bg-gray-100 min-h-screen">
      {/* Payment Section */}
      <div className="w-full md:w-1/2 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Payment</h2>

        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <div key={method.id} className="flex items-center gap-2">
              <input
                type="radio"
                id={method.id}
                name="payment"
                checked={selectedPayment === method.id}
                disabled={!method.available}
                onChange={() => {
                  if (method.available) {
                    setSelectedPayment(method.id);
                    setShowAddressOptions(method.id === "cod");
                    setShowAddressForm(false);

                    if (method.id === "cod") {
                      fetchSavedAddress(); // Correct function call
                    }
                  }
                }}
              />
              <label
                htmlFor={method.id}
                className={method.available ? "font-semibold" : "text-gray-400"}
              >
                {method.name}
              </label>
            </div>
          ))}
        </div>

        {/* COD Address Selection */}
        {showAddressOptions && (
          <div className="mt-4 p-4">
            <h3 className="font-semibold">Choose Address:</h3>
            <div className="mt-2 space-y-3">
              <div className="flex items-center border gap-2 bg-white p-3 rounded shadow-md">
                <input
                  type="radio"
                  id="savedAddress"
                  name="address"
                  checked={selectedAddress === "saved"}
                  onChange={() => setSelectedAddress("saved")}
                />
                <label htmlFor="savedAddress" className="cursor-pointer">
                  <p>
                    <strong>{savedAddress.fullName}</strong>
                  </p>
                  <p>
                    {savedAddress.address}, {savedAddress.city},{" "}
                    {savedAddress.country}
                  </p>
                  <p>Postal Code: {savedAddress.postalCode}</p>
                  <p>Phone: {savedAddress.phoneNo}</p>
                </label>
              </div>

              <div className="flex items-center border gap-2 bg-white p-3 rounded shadow-md">
                <input
                  type="radio"
                  id="newAddress"
                  name="address"
                  checked={selectedAddress === "new"}
                  onChange={() => {
                    setSelectedAddress("new");
                    setShowAddressForm(true);
                  }}
                />
                <label htmlFor="newAddress" className="cursor-pointer">
                  Deliver to Another Location
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Confirm Order Button */}
        <button
          className={`w-full py-2 rounded-lg mt-6 ${
            selectedPayment === "cod"
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          disabled={selectedPayment !== "cod"}
          onClick={placeOrder}
        >
          Confirm Order
        </button>
      </div>

      {/* Order Summary */}
      <div className="w-full md:w-1/2 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

        <div className="flex overflow-x-auto space-x-4 p-2">
          {cartItems.length > 0 ? (
            cartItems.map((order, orderIndex) => {
              return order.items.map((item, itemIndex) => {
                const product = item.productId || {};  
                return (
                  <div
                    key={`${orderIndex}-${itemIndex}`}
                    className="min-w-[200px] bg-gray-100 rounded-lg p-4 shadow-lg"
                  >
                    <img
                      src={activeImage[product._id] || activeImage}
                      alt={`Product ${orderIndex}-${itemIndex}`}
                      className="w-20 h-auto object-cover cursor-pointer"
                    />
                    <h3 className="font-medium mt-2">
                      {product.productName || "Unknown Product"}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      Brand: {product.brandName || "N/A"}
                    </p>
                    <p className="text-gray-500 text-sm">
                      Category: {product.category || "N/A"}
                    </p>
                    <p className="text-gray-500 text-sm">Quantity: {item.quantity}</p>
                    <p className="font-bold text-lg mt-1">
                      ₹ {product.sellingPrice ? product.sellingPrice.toFixed(2) : "0.00"}
                    </p>
                  </div>
                );
              });
            })
          ) : (
            <p className="text-gray-500">No items in cart</p>
          )}
        </div>

        <div className="mt-4">
          <div className="flex justify-between text-gray-700 mb-2">
            <span>Subtotal:</span>
            <span>₹ {totalPrice ? totalPrice.toFixed(2) : "0.00"}</span>
          </div>
          <div className="flex justify-between text-gray-700 mb-2">
            <span>Total Items:</span>
            <span>{totalQty}</span>
          </div>
          <div className="border-t pt-4 flex justify-between text-lg font-semibold">
            <span>Total:</span>
            <span>₹ {totalPrice ? totalPrice.toFixed(2) : "0.00"}</span>
          </div>
        </div>
      </div>

      {/* Address Form */}
      {showAddressForm && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-3">Enter New Address</h2>
            <form className="grid gap-2">
              {Object.keys(newAddress).map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium">
                    {field.replace(/([A-Z])/g, " $1")}
                  </label>
                  <input
                    type="text"
                    name={field}
                    value={newAddress[field]}
                    onChange={handleAddressChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
              ))}
            </form>
            <button
              onClick={handleSaveNewAddress}
              className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
            >
              Save Address
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentMethod;
