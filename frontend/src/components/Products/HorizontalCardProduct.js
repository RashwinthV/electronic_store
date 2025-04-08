import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import fetchCategoryWiseProduct from "../../helpers/fetchCategoryWiseProduct";
import displayINRCurrency from "../../helpers/displayCurrency";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { Link } from "react-router-dom";
import addToCart from "../../helpers/addToCart";
import Context from "../../context";

const HorizontalCardProduct = ({ category, heading }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImages, setActiveImages] = useState({});
  const loadingList = new Array(13).fill(null); // Loading skeleton array
  const scrollElement = useRef();
  const { fetchUserAddToCart } = useContext(Context);

  // Fetch products by category
  const fetchData = useCallback(async () => {
    setLoading(true);
    const categoryProduct = await fetchCategoryWiseProduct(category);
    setData(categoryProduct?.data || []);
    setLoading(false);

    // Generate proxy URLs
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

  // Add product to cart
  const handleAddToCart = async (e, id) => {
    await addToCart(e, id);
    fetchUserAddToCart();
  };

  // Scroll functions
  const scrollRight = () => {
    scrollElement.current.scrollLeft += 300;
  };
  const scrollLeft = () => {
    scrollElement.current.scrollLeft -= 300;
  };

  return (
    <div className="container mx-auto px-4 my-6 relative">
      <h2 className="text-2xl font-semibold py-4">{heading}</h2>

      {/* Scroll Buttons */}
      <button
        className="bg-white shadow-md rounded-full p-1 absolute left-0 text-lg hidden md:block top-1/2 -translate-y-1/2"
        onClick={scrollLeft}
      >
        <FaAngleLeft />
      </button>
      <button
        className="bg-white shadow-md rounded-full p-1 absolute right-0 text-lg hidden md:block top-1/2 -translate-y-1/2"
        onClick={scrollRight}
      >
        <FaAngleRight />
      </button>

      {/* Product List */}
      <div
        className="flex items-center gap-4 md:gap-6 overflow-x-scroll scrollbar-none transition-all"
        ref={scrollElement}
      >
        {/* Loading Skeleton */}
        {loading
          ? loadingList.map((_, index) => (
              <div
                key={index}
                className="w-full min-w-[280px] md:min-w-[320px] max-w-[320px] h-36 bg-white rounded-sm shadow flex"
              >
                <div className="bg-slate-200 h-full p-4 min-w-[120px] md:min-w-[145px] animate-pulse"></div>
                <div className="p-4 grid w-full gap-2">
                  <p className="capitalize text-slate-500 p-1 bg-slate-200 animate-pulse rounded-full"></p>
                  <div className="flex gap-3 w-full">
                    <p className="text-red-600 font-medium p-1 bg-slate-200 w-full animate-pulse rounded-full"></p>
                    <p className="text-slate-500 line-through p-1 bg-slate-200 w-full animate-pulse rounded-full"></p>
                  </div>
                  <button className="text-sm text-white px-3 py-0.5 rounded-full w-full bg-slate-200 animate-pulse"></button>
                </div>
              </div>
            ))
          : data.map((product) => {
              const isOutOfStock = product.stock === 0;

              return (
                <Link
                  key={product?._id}
                  to={"product/" + product?._id}
                  className="w-full min-w-[280px] md:min-w-[320px] max-w-[320px] h-36 bg-white rounded-sm shadow flex relative"
                >
                  {/* Image Section */}
                  <div className="relative bg-slate-200 h-full p-4 min-w-[120px] md:min-w-[145px] flex justify-center items-center">
                    {isOutOfStock && (
                      <span className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full z-10">
                        Out of Stock
                      </span>
                    )}
                    <img
                      src={activeImages[product._id]}
                      className="object-scale-down h-full hover:scale-110 transition-all mix-blend-multiply"
                      alt={product?.productName}
                    />
                  </div>

                  {/* Info Section */}
                  <div className="p-4 grid w-full">
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

                    {isOutOfStock ? (
                      <button
                        className="text-sm bg-gray-400 text-white px-3 py-0.5 rounded-full cursor-not-allowed"
                        disabled
                      >
                        Add to Cart
                      </button>
                    ) : (
                      <button
                        className="text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-0.5 rounded-full"
                        onClick={(e) => {
                          e.preventDefault(); // Prevent redirect when clicking add to cart
                          handleAddToCart(e, product?._id);
                        }}
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>
                </Link>
              );
            })}
      </div>
    </div>
  );
};

export default HorizontalCardProduct;
