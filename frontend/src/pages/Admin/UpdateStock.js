import React, { useEffect, useState } from 'react';
import axios from 'axios';


const ProductDetail = ({ products, onUpdateStock, onClose }) => {
  const [updatedStock, setUpdatedStock] = useState(products.stock);
  const [activeImage, setActiveImage] = useState({});

  const handleIncrease = () => setUpdatedStock((prev) => prev + 1);
  const handleDecrease = () => {
    if (updatedStock > 0) setUpdatedStock((prev) => prev - 1);
  };

  const handleUpdate = () => {
    onUpdateStock(products._id, updatedStock);
  };

  // ✅ Render image from Google Drive URL
  useEffect(() => {
    const processedImages = {};

    if (products.productImage?.[0]) {
      try {
        const url = new URL(products.productImage[0]);
        const fileId = url.searchParams.get('id');
        processedImages[products._id] = fileId
          ? `${process.env.REACT_APP_IMAGE_URL}/proxy-image?fileId=${fileId}`
          : products.productImage[0];
      } catch (error) {
        console.error('Invalid image URL for product:', products.productName);
        processedImages[products._id] = '/placeholder.png';
      }
    }

    setActiveImage(processedImages);
  }, [products]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <img
          src={activeImage[products._id] || '/placeholder.png'}
          alt={products?.productName}
          className="w-28 h-28 object-contain border rounded"
        />
        <div>
          <h2 className="text-xl font-bold">{products.productName}</h2>
          <p className="text-gray-600">
            Current Stock: <span className="font-medium">{products.stock}</span>
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-gray-700 font-medium">Update Stock:</span>
        <div className="flex items-center gap-3">
          <button
            onClick={handleDecrease}
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-xl"
          >
            -
          </button>
          <span className="text-xl font-semibold w-10 text-center">{updatedStock}</span>
          <button
            onClick={handleIncrease}
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-xl"
          >
            +
          </button>
        </div>
      </div>

      <button
        onClick={handleUpdate}
        className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Update Stock
      </button>
      <button
        onClick={onClose}
        className="mt-2 w-full py-2 text-sm bg-gray-300 rounded-lg hover:bg-gray-400"
      >
        Cancel
      </button>
    </div>
  );
};





const UpdateStock = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeImage, setActiveImage] = useState({});

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/allproducts`);
      const sorted = res.data.sort((a, b) => a.stock - b.stock);
      setProducts(sorted);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const handleUpdateStock = async (id, updatedStock) => {
    try {      
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/products/${id}`, {
        stock: updatedStock,
      });
      setSelectedProduct(null);
      fetchProducts();
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  //render image
  useEffect(() => {
    const processedImages = {};
  
    products.forEach((product) => {
      if (product.productImage[0]) {
        try {
          const url = new URL(product.productImage[0]);
          const fileId = url.searchParams.get("id");  
          processedImages[product._id] = fileId
            ? `${process.env.REACT_APP_IMAGE_URL}/proxy-image?fileId=${fileId}`
            : product.productImage[0];
        } catch (error) {
          console.error("Invalid image URL for product:", product.productName);
          processedImages[product._id] = ""; // fallback or leave blank
        }
      }
    });
  
    setActiveImage(processedImages);
  }, [products]);
  

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-2xl font-bold mb-6 text-center">Product Inventory</h1>
  
        {/* ======== Out-of-Stock Section ======== */}
      <h2 className="text-xl font-semibold mt-10 mb-4 text-red-600">Out of Stock</h2>
      {Object.entries(
        products
          .filter((p) => p.stock === 0)
          .reduce((acc, product) => {
            acc[product.category] = [...(acc[product.category] || []), product];
            return acc;
          }, {})
      ).map(([category, items]) => (
        <div key={category} className="mb-8">
          <h3 className="text-lg font-medium mb-2 text-red-500">{category}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {items.map((product) => (
              <div
                key={product._id}
                className="bg-white p-4 rounded-xl shadow hover:shadow-lg cursor-pointer transition"
                onClick={() => setSelectedProduct(product)}
              >
                <img
                  src={activeImage[product._id] || "/placeholder.png"}
                  alt={product?.productName}
                  className="w-full h-60 object-contain border rounded cursor-pointer"
                />
                <h2 className="text-lg font-semibold">{product.productName}</h2>
                <p className="text-sm mt-5 text-red-500 font-bold">Stock: {product.stock}</p>
              </div>
            ))}
          </div>
        </div>
      ))}


        {/* ======== In-Stock Section ======== */}
    
        <h2 className="text-xl font-semibold mb-4">In-Stock Inventory</h2>
      {Object.entries(
        products
          .filter((p) => p.stock > 0)
          .reduce((acc, product) => {
            acc[product.category] = [...(acc[product.category] || []), product];
            return acc;
          }, {})
      ).map(([category, items]) => (
        <div key={category} className="mb-8">
          <h3 className="text-lg font-medium mb-2 text-blue-700">{category}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {items.map((product) => (
              <div
                key={product._id}
                className="bg-white p-4 rounded-xl shadow hover:shadow-lg cursor-pointer transition"
                onClick={() => setSelectedProduct(product)}
              >
                <img
                  src={activeImage[product._id] || "/placeholder.png"}
                  alt={product?.productName}
                  className="w-full h-60 object-contain border rounded cursor-pointer"
                />
                <h2 className="text-lg font-semibold">{product.productName}</h2>
                <p
  className={`text-sm mt-5 font-bold ${product.stock > 10? 'text-green-600': product.stock > 5 ? 'text-yellow-500'
      : 'text-red-500'
  }`}
>
  Stock: {product.stock}
</p>              </div>
            ))}
          </div>
        </div>
      ))}
  
      {/* ======== Modal Detail ======== */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-[90%] max-w-md shadow-lg">
            <ProductDetail
              products={selectedProduct}
              onUpdateStock={handleUpdateStock}
              onClose={() => setSelectedProduct(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
  
};

export default UpdateStock;
