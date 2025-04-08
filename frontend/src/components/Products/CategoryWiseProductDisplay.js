import React, { useCallback, useContext, useEffect, useState } from "react";
import fetchCategoryWiseProduct from "../../helpers/fetchCategoryWiseProduct";
import displayINRCurrency from "../../helpers/displayCurrency";
import { Link } from "react-router-dom";
import addToCart from "../../helpers/addToCart";
import Context from "../../context";
import scrollTop from "../../helpers/scrollTop";

const CategroyWiseProductDisplay = ({ category, heading }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const loadingList = new Array(13).fill(null);
  const [activeImages, setActiveImages] = useState({});

  const { fetchUserAddToCart } = useContext(Context);
  const user = localStorage.getItem("email");

  const handleAddToCart = async (e, id) => {
    if (user) {
      await addToCart(e, id);
      fetchUserAddToCart();
    }
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    const categoryProduct = await fetchCategoryWiseProduct(category);
    setLoading(false);

    setData(categoryProduct?.data);

    const images = categoryProduct?.data?.reduce((acc, product) => {
      if (product.productImage?.length > 0) {
        const url = new URL(product.productImage[0]);
        const fileId = url.searchParams.get("id");
        const proxyImageUrl = `${process.env.REACT_APP_IMAGE_URL}/proxy-image?fileId=${fileId}`;
        acc[product._id] = proxyImageUrl;
      }
      return acc;
    }, {});

    setActiveImages(images);
  }, [category]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="container mx-auto px-4 my-6 relative">
      <h2 className="text-2xl font-semibold py-4">{heading}</h2>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,320px))] justify-between md:gap-6 overflow-x-scroll scrollbar-none transition-all">
        {loading
          ? loadingList.map((product, index) => {
              return (
                <div className="w-full min-w-[280px]  md:min-w-[320px] max-w-[280px] md:max-w-[320px]  bg-white rounded-sm shadow " key={index}>
                  <div className="bg-slate-200 h-48 p-4 min-w-[280px] md:min-w-[145px] flex justify-center items-center animate-pulse"></div>
                  <div className="p-4 grid gap-3">
                    <h2 className="font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black p-1 py-2 animate-pulse rounded-full bg-slate-200" aria-hidden="true"></h2>
                    <p className="capitalize text-slate-500 p-1 animate-pulse rounded-full bg-slate-200 py-2"></p>
                    <div className="flex gap-3">
                      <p className="text-red-600 font-medium p-1 animate-pulse rounded-full bg-slate-200 w-full py-2"></p>
                      <p className="text-slate-500 line-through p-1 animate-pulse rounded-full bg-slate-200 w-full py-2"></p>
                    </div>
                    <button className="text-sm  text-white px-3  rounded-full bg-slate-200  py-2 animate-pulse"></button>
                  </div>
                </div>
              );
            })
          : data.map((product, index) => {
              const activeImage = activeImages[product._id];
              const isOutOfStock = product?.stock === 0;

              return (
                <Link
                  to={isOutOfStock ? "#" : "/product/" + product?._id}
                  className="w-full min-w-[280px]  md:min-w-[320px] max-w-[280px] md:max-w-[320px]  bg-white rounded-sm shadow relative"
                  onClick={(e) => {
                    if (isOutOfStock) e.preventDefault();
                    else scrollTop();
                  }}
                  key={index}
                >
                  <div className="bg-slate-200 h-48 p-4 min-w-[280px] md:min-w-[145px] flex justify-center items-center relative">
                    {activeImage ? (
                      <img
                        src={activeImage}
                        className={`object-scale-down h-full transition-all mix-blend-multiply ${
                          isOutOfStock ? "opacity-40" : "hover:scale-110"
                        }`}
                        alt={product?.productName || "Product Image"}
                      />
                    ) : (
                      <div className="bg-slate-300 h-full w-full flex justify-center items-center">
                        <p>No Image</p>
                      </div>
                    )}

                    {isOutOfStock && (
                      <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-semibold px-2 py-0.5 rounded">
                        Out of Stock
                      </span>
                    )}
                  </div>
                  <div className="p-4 grid gap-3">
                    <h2 className="font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black">
                      {product?.productName}
                    </h2>
                    <p className="capitalize text-slate-500">{product?.category}</p>
                    <div className="flex gap-3">
                      <p className="text-red-600 font-medium">
                        {displayINRCurrency(product?.sellingPrice)}
                      </p>
                      <p className="text-slate-500 line-through">
                        {displayINRCurrency(product?.price)}
                      </p>
                    </div>
                    <button
                      className={`text-sm px-3 py-0.5 rounded-full ${
                        isOutOfStock
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-red-600 hover:bg-red-700 text-white"
                      }`}
                      disabled={isOutOfStock}
                      onClick={(e) => {
                        if (isOutOfStock) e.preventDefault();
                        else handleAddToCart(e, product?._id);
                      }}
                    >
                      {isOutOfStock ? "Add to Cart" : "Add to Cart"}
                    </button>
                  </div>
                </Link>
              );
            })}
      </div>
    </div>
  );
};

export default CategroyWiseProductDisplay;
