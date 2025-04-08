import React, { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SummaryApi from "../../common";
import { FaStar, FaStarHalf } from "react-icons/fa";
import displayINRCurrency from "../../helpers/displayCurrency";
import CategroyWiseProductDisplay from "../../components/Products/CategoryWiseProductDisplay";
import addToCart from "../../helpers/addToCart";
import Context from "../../context";
import { CgClose } from "react-icons/cg";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

const ProductDetails = () => {
  const [data, setData] = useState({
    productName: "",
    brandName: "",
    category: "",
    productImage: [],
    description: "",
    price: "",
    sellingPrice: "",
  });

  const params = useParams();
  const [loading, setLoading] = useState(true);
  const productImageListLoading = new Array(4).fill(null);
  const [activeImage, setActiveImage] = useState("");
  const [showImageModal, setShowImageModal] = useState(false);
  const [fade, setFade] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const { fetchUserAddToCart } = useContext(Context);
  const navigate = useNavigate();

  const fetchProductDetails = useCallback(async () => {
    setLoading(true);
    const response = await fetch(SummaryApi.productDetails.url, {
      method: SummaryApi.productDetails.method,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        productId: params?.id,
      }),
    });
    setLoading(false);
    const dataResponse = await response.json();
    setData(dataResponse?.data);
    const url = new URL(dataResponse?.data?.productImage[0]);
    const fileId = url.searchParams.get("id");
    const proxyImageUrl = `${process.env.REACT_APP_IMAGE_URL}/proxy-image?fileId=${fileId}`;
    setActiveImage(proxyImageUrl);
    setActiveIndex(0);
  }, [params]);

  useEffect(() => {
    fetchProductDetails();
  }, [fetchProductDetails]);

  // Slideshow with inline smooth transition
  useEffect(() => {
    if (!data.productImage || data.productImage.length === 0 || showImageModal)
      return;

    let index = activeIndex;
    const interval = setInterval(() => {
      index = (index + 1) % data.productImage.length;
      const url = new URL(data.productImage[index]);
      const fileId = url.searchParams.get("id");
      const proxyImageUrl = `${process.env.REACT_APP_IMAGE_URL}/proxy-image?fileId=${fileId}`;

      setFade(false);
      setTimeout(() => {
        setActiveImage(proxyImageUrl);
        setActiveIndex(index);
        setFade(true);
      }, 200);
    }, 3000);

    return () => clearInterval(interval);
  }, [data.productImage, showImageModal, activeIndex]);

  const handleAddToCart = async (e, id) => {
    await addToCart(e, id);
    fetchUserAddToCart();
  };

  const handleBuyProduct = async (e, id) => {
    await addToCart(e, id);
    fetchUserAddToCart();
    navigate("/cart");
  };

  const handleModalNext = () => {
    const nextIndex = (activeIndex + 1) % data.productImage.length;
    const url = new URL(data.productImage[nextIndex]);
    const fileId = url.searchParams.get("id");
    const proxyImageUrl = `${process.env.REACT_APP_IMAGE_URL}/proxy-image?fileId=${fileId}`;
    setActiveIndex(nextIndex);
    setActiveImage(proxyImageUrl);
  };

  const handleModalPrev = () => {
    const prevIndex =
      (activeIndex - 1 + data.productImage.length) % data.productImage.length;
    const url = new URL(data.productImage[prevIndex]);
    const fileId = url.searchParams.get("id");
    const proxyImageUrl = `${process.env.REACT_APP_IMAGE_URL}/proxy-image?fileId=${fileId}`;
    setActiveIndex(prevIndex);
    setActiveImage(proxyImageUrl);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="min-h-[200px] flex flex-col lg:flex-row gap-4">
        {/* Product Image */}
        <div className="h-96 flex flex-col lg:flex-row-reverse gap-4">
          <div
            className="h-[300px] w-[300px] lg:h-96 lg:w-96 bg-slate-200 relative p-2 cursor-pointer"
            onClick={() => setShowImageModal(true)}
          >
            <img
              src={activeImage}
              className={`h-full w-full object-scale-down mix-blend-multiply transition-opacity duration-500 ${
                fade ? "opacity-100" : "opacity-0"
              }`}
              alt="product"
            />
          </div>

          {/* Thumbnail Images */}
          <div className="h-full">
            {loading ? (
              <div className="flex gap-2 lg:flex-col overflow-scroll scrollbar-none h-full">
                {productImageListLoading.map((_, index) => (
                  <div
                    className="h-20 w-20 bg-slate-200 rounded animate-pulse"
                    key={"loadingImage" + index}
                  ></div>
                ))}
              </div>
            ) : (
              <div className="flex gap-2 lg:flex-col overflow-scroll scrollbar-none h-full w-40">
                {data.productImage.map((el, index) => {
                  const url = new URL(el);
                  const fileId = url.searchParams.get("id");
                  const proxyImageUrl = `${process.env.REACT_APP_IMAGE_URL}/proxy-image?fileId=${fileId}`;
                  return (
                    <img
                      src={proxyImageUrl}
                      alt={`Product ${index}`}
                      key={index}
                      className="w-20 h-auto object-cover cursor-pointer"
                      onClick={() => {
                        setActiveIndex(index);
                        setActiveImage(proxyImageUrl);
                      }}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="flex flex-col gap-1 w-full">
          <p className="bg-red-200 text-red-600 px-2 rounded-full inline-block w-fit">
            {data?.brandName}
          </p>
          <h2 className="text-2xl lg:text-4xl font-medium">
            {data?.productName}
          </h2>
          <p className="capitalize text-slate-400">{data?.category}</p>

          <div className="text-red-600 flex items-center gap-1">
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStarHalf />
          </div>

          <div className="flex items-center gap-2 text-2xl lg:text-3xl font-medium my-1">
            <p className="text-red-600">
              {displayINRCurrency(data.sellingPrice)}
            </p>
            <p className="text-slate-400 line-through">
              {displayINRCurrency(data.price)}
            </p>
          </div>

          {data.stock === 0 && (
            <span className="text-sm text-red-600 font-semibold">
              Out of Stock
            </span>
          )}

          <div className="flex items-center gap-3 my-2 w-full">
            {data.stock === 0 ? (
              <>
                <button
                  className="border-2 border-gray-400 rounded px-3 py-1 min-w-[120px] text-gray-400 font-medium bg-gray-100 cursor-not-allowed"
                  disabled
                >
                  Buy
                </button>
                <button
                  className="border-2 border-gray-400 rounded px-3 py-1 min-w-[120px] font-medium text-white bg-gray-300 cursor-not-allowed"
                  disabled
                >
                  Add To Cart
                </button>
              </>
            ) : (
              <>
                <button
                  className="border-2 border-red-600 rounded px-3 py-1 min-w-[120px] text-red-600 font-medium hover:bg-red-600 hover:text-white"
                  onClick={(e) => handleBuyProduct(e, data?._id)}
                >
                  Buy
                </button>
                <button
                  className="border-2 border-red-600 rounded px-3 py-1 min-w-[120px] font-medium text-white bg-red-600 hover:text-red-600 hover:bg-white"
                  onClick={(e) => handleAddToCart(e, data?._id)}
                >
                  Add To Cart
                </button>
              </>
            )}
          </div>

          <div>
            <p className="text-slate-600 font-medium my-1">Description : </p>
            <p>{data?.description}</p>
          </div>
        </div>
      </div>

      {/* Recommended Product Section */}
      {data.category && (
        <CategroyWiseProductDisplay
          category={data?.category}
          heading={"Recommended Product"}
        />
      )}

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex justify-center items-center p-4">
          <div className="relative max-w-3xl w-full bg-white rounded-md overflow-hidden shadow-lg">
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-2xl hover:text-red-600 hover:bg-black/60 p-2 rounded-full transition duration-300 z-10"
              onClick={() => setShowImageModal(false)}
            >
              <CgClose />
            </button>

            {/* Image & Arrows */}
            <div className="relative w-full h-full flex justify-center items-center">
              <button
                onClick={handleModalPrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full shadow-lg transition duration-300 z-10"
              >
                <FaAngleLeft size={24} />
              </button>

              <img
                src={activeImage}
                alt="Zoomed Product"
                className="w-full object-contain max-h-[90vh] z-0"
              />

              <button
                onClick={handleModalNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full shadow-lg transition duration-300 z-10"
              >
                <FaAngleRight size={24} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
