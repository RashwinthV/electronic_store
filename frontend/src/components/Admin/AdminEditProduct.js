import React, { useState, useEffect } from "react";
import { CgClose } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import productCategory from "../../helpers/productCategory";
import { FaCloudUploadAlt } from "react-icons/fa";
import DisplayImage from "../DisplayImage";
import { MdDelete } from "react-icons/md";
import SummaryApi from "../../common";
import { toast } from "react-toastify";

const AdminEditProduct = ({ onClose, productData }) => {
  const navigate = useNavigate();

  const [data, setData] = useState({
    ...productData,
    productName: productData?.productName || "",
    brandName: productData?.brandName || "",
    category: productData?.category || "",
    productImage: productData?.productImage || [],
    description: productData?.description || "",
    price: productData?.price || "",
    sellingPrice: productData?.sellingPrice || "",
  });

  const [openFullScreenImage, setOpenFullScreenImage] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState("");

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUploadProduct = async (e) => {
    const file = e.target.files[0];
    if (!file) return; // If no file is selected, return early

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${process.env.REACT_APP_IMAGE_URL}/uploadimage`, {
        method: "POST",
        body: formData,
      });

      const responseData = await response.json();

      if (responseData.success) {
        setData((prev) => ({
          ...prev,
          productImage: [...prev.productImage, responseData.url],
        }));
        toast.success("Image uploaded successfully");
      } else {
        toast.error("Image upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Image upload error");
    }
  };

  const handleDeleteProductImage = (index) => {
    setData((prev) => ({
      ...prev,
      productImage: prev.productImage.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = localStorage.getItem("email");

    const response = await fetch(`${SummaryApi.updateProduct.url}/${email}`, {
      method: SummaryApi.updateProduct.method,
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();
    if (responseData.success) {
      toast.success(responseData.message);
      onClose();
      navigate("/admin-panel/all-products");
    } else {
      toast.error(responseData.message);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(SummaryApi.allProduct.url, {
        method: SummaryApi.allProduct.method,
      });

      const productsData = await response.json();
      console.log(productsData.data);
      
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Error fetching products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="fixed w-full h-full bg-slate-200 bg-opacity-35 top-0 left-0 flex justify-center items-center">
      <div className="bg-white p-4 rounded w-full max-w-2xl h-full max-h-[80%] overflow-hidden">
        <div className="flex justify-between items-center pb-3">
          <h2 className="font-bold text-lg">Edit Product</h2>
          <div
            className="w-fit ml-auto text-2xl hover:text-red-600 cursor-pointer"
            onClick={onClose}
          >
            <CgClose />
          </div>
        </div>

        <form
          className="grid p-4 gap-2 overflow-y-scroll h-full pb-5"
          onSubmit={handleSubmit}
        >
          <label htmlFor="productName">Product Name :</label>
          <input
            type="text"
            id="productName"
            name="productName"
            value={data.productName}
            onChange={handleOnChange}
            className="p-2 bg-slate-100 border rounded"
            required
          />

          <label htmlFor="brandName">Brand Name :</label>
          <input
            type="text"
            id="brandName"
            name="brandName"
            value={data.brandName}
            onChange={handleOnChange}
            className="p-2 bg-slate-100 border rounded"
            required
          />

          <label htmlFor="category">Category :</label>
          <select
            name="category"
            value={data.category}
            onChange={handleOnChange}
            className="p-2 bg-slate-100 border rounded"
            required
          >
            <option value="">Select Category</option>
            {productCategory.map((el, index) => (
              <option value={el.value} key={index}>
                {el.label}
              </option>
            ))}
          </select>

          <label htmlFor="productImage">Product Image :</label>
          <label htmlFor="uploadImageInput">
            <div className="p-2 bg-slate-100 border rounded h-32 w-full flex justify-center items-center cursor-pointer">
              <div className="text-slate-500 flex justify-center items-center flex-col gap-2">
                <span className="text-4xl">
                  <FaCloudUploadAlt />
                </span>
                <p className="text-sm">Upload Product Image</p>
                <input
                  type="file"
                  id="uploadImageInput"
                  className="hidden"
                  onChange={handleUploadProduct} // Upload image on change
                />
              </div>
            </div>
          </label>

          <div>
            {data.productImage ? (
              <div className="flex items-center gap-2">
                {data.productImage.map((el, index) => {
                  const url = new URL(el);

                  // Extract the fileId from the query parameters
                  const fileId = url.searchParams.get("id");
                  console.log(fileId);

                  const proxyImageUrl = `http://localhost:8000/proxy-image?fileId=${fileId}`;

                  return (
                    <div className="relative group" key={index}>
                      <img
                        src={proxyImageUrl}
                        alt={`Product ${index}`}
                        className="w-20 h-auto object-cover cursor-pointer"
                        onClick={() => {
                          setOpenFullScreenImage(true);
                          setFullScreenImage(proxyImageUrl);
                        }}
                      />
                      <div
                        className="absolute bottom-0 right-0 p-1 text-white bg-red-600 rounded-full hidden group-hover:block cursor-pointer"
                        onClick={() => handleDeleteProductImage(index)} // Delete image on click
                      >
                        <MdDelete />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-red-600 text-xs">
                *Please upload a product image
              </p>
            )}
          </div>

          <label htmlFor="price">Price :</label>
          <input
            type="number"
            id="price"
            name="price"
            value={data.price}
            onChange={handleOnChange}
            className="p-2 bg-slate-100 border rounded"
            required
          />

          <label htmlFor="sellingPrice">Selling Price :</label>
          <input
            type="number"
            id="sellingPrice"
            name="sellingPrice"
            value={data.sellingPrice}
            onChange={handleOnChange}
            className="p-2 bg-slate-100 border rounded"
            required
          />

          <label htmlFor="description">Description :</label>
          <textarea
            className="h-28 bg-slate-100 border resize-none p-1"
            name="description"
            value={data.description}
            onChange={handleOnChange}
          />

          <button className="px-3 py-2 bg-red-600 text-white mb-10 hover:bg-red-700">
            Update Product
          </button>
        </form>
      </div>

      {openFullScreenImage && (
        <DisplayImage
          onClose={() => setOpenFullScreenImage(false)}
          imgUrl={fullScreenImage}
        />
      )}
    </div>
  );
};

export default AdminEditProduct;
