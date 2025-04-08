import React, { useEffect, useState } from "react";
import UploadProduct from "../../components/Products/UploadProduct";
import SummaryApi from "../../common";
import AdminProductCard from "../../components/Admin/AdminProductCard";
import productCategory from "../../helpers/productCategory";
import { CgClose } from "react-icons/cg";
import { FaInfoCircle } from "react-icons/fa"; // ✅ imported

const AllProducts = () => {
  const [openUploadProduct, setOpenUploadProduct] = useState(false);
  const [groupedProducts, setGroupedProducts] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchAllProduct = async () => {
    const response = await fetch(SummaryApi.allProduct.url);
    const dataResponse = await response.json();
    const products = dataResponse?.data || [];
    groupProductsByCategory(products);
  };

  const groupProductsByCategory = (products) => {
    const grouped = {};
    products.forEach((product) => {
      const category = product.category || "Uncategorized";
      if (!grouped[category]) grouped[category] = [];
      grouped[category].push(product);
    });
    setGroupedProducts(grouped);
  };

  useEffect(() => {
    fetchAllProduct();
  });

  return (
    <div>
      {/* Header */}
      <div className="bg-white py-2 px-4 flex justify-between items-center">
        <h2 className="font-bold text-lg">All Products</h2>
        <button
          className="border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all py-1 px-3 rounded-full"
          onClick={() => setOpenUploadProduct(true)}
        >
          Upload Product
        </button>
      </div>

      {/* Products Grouped by Category */}
      <div className="p-4 space-y-6 h-[calc(100vh-190px)] overflow-y-scroll">
        {Object.entries(groupedProducts).map(([category, products]) => {
          const categoryLabel =
            productCategory.find((c) => c.value === category)?.label ||
            category;
          return (
            <div key={category}>
              <h3 className="text-xl font-semibold text-blue-600 mb-3">
                {categoryLabel}
              </h3>

              {/* Scrollable on mobile, wrap on desktop */}
              <div className="flex gap-4 overflow-x-auto md:flex-wrap">
                {products.map((product, index) => (
                  <div
                    key={product._id || index}
                    className="min-w-[250px] md:min-w-0 relative"
                  >
                    <AdminProductCard
                      data={product}
                      fetchdata={fetchAllProduct}
                    />

                    {/* ✅ Desc Icon */}
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md hover:text-blue-600 transition"
                      title="View Details"
                    >
                      <FaInfoCircle />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Upload Product Modal */}
      {openUploadProduct && (
        <UploadProduct
          onClose={() => setOpenUploadProduct(false)}
          fetchData={fetchAllProduct}
        />
      )}

      {/* Product Detail Modal */}
      {selectedProduct && !openUploadProduct && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl relative max-h-[90vh] overflow-y-auto shadow-lg">
            <button
              className="absolute top-3 right-3 text-2xl text-gray-600 hover:text-red-600"
              onClick={() => setSelectedProduct(null)}
            >
              <CgClose />
            </button>

            <h2 className="text-2xl font-bold mb-4">
              {selectedProduct.productName}
            </h2>

            <p className="mb-2">
              <strong>Brand:</strong> {selectedProduct.brandName}
            </p>

            {/* Display only 1st image */}
            {selectedProduct.productImage?.length > 0 && (() => {
              const el = selectedProduct.productImage[0];
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
                <div className="relative w-full max-h-60 overflow-hidden mb-4">
                  <img
                    src={imageUrl}
                    alt={selectedProduct.productName || "Product image"}
                    className="w-full h-60 object-contain border rounded cursor-pointer"
                  />
                </div>
              );
            })()}

            <p className="mb-1">
              <strong>Category:</strong> {selectedProduct.category}
            </p>
            <p className="mb-1">
              <strong>Price:</strong> ₹{selectedProduct.price}
            </p>
            <p className="mb-1">
              <strong>Selling Price:</strong> ₹{selectedProduct.sellingPrice}
            </p>

            <div className="mt-3">
              <p className="font-semibold">Description:</p>
              <p className="text-sm text-gray-700">
                {selectedProduct.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllProducts;
