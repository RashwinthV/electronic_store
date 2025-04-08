import React, { useContext, useMemo } from 'react';
import scrollTop from '../../helpers/scrollTop';
import displayINRCurrency from '../../helpers/displayCurrency';
import Context from '../../context';
import addToCart from '../../helpers/addToCart';
import { Link } from 'react-router-dom';

const VerticalCard = ({ loading, data = [] }) => {
  const loadingList = new Array(13).fill(null);
  const { fetchUserAddToCart } = useContext(Context);

  const activeImages = useMemo(() => {
    if (!data?.length) return {};

    return data.reduce((acc, product) => {
      if (product.productImage?.length > 0) {
        try {
          const url = new URL(product.productImage[0]);
          const fileId = url.searchParams.get('id');
          acc[product._id] = fileId
            ? `${process.env.REACT_APP_IMAGE_URL}/proxy-image?fileId=${fileId}`
            : product.productImage[0];
        } catch (error) {
          acc[product._id] = '';
        }
      }
      return acc;
    }, {});
  }, [data]);

  const handleAddToCart = async (e, id) => {
    e.preventDefault();
    await addToCart(e, id);
    fetchUserAddToCart();
  };

  return (
    <div className='flex flex-wrap justify-start gap-6 p-4 transition-all shadow-lg rounded-md'>
      {loading ? (
        loadingList.map((_, index) => (
          <div key={index} className='w-full min-w-[280px] md:min-w-[320px] max-w-[280px] md:max-w-[320px] bg-white rounded-sm shadow'>
            <div className='bg-slate-200 h-48 p-4 flex justify-center items-center animate-pulse'></div>
            <div className='p-4 grid gap-3'>
              <h2 className='font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black p-1 py-2 animate-pulse rounded-full bg-slate-200' aria-hidden="true"></h2>
              <p className='capitalize text-slate-500 p-1 animate-pulse rounded-full bg-slate-200 py-2'></p>
              <div className='flex gap-3'>
                <p className='text-red-600 font-medium p-1 animate-pulse rounded-full bg-slate-200 w-full py-2'></p>
                <p className='text-slate-500 line-through p-1 animate-pulse rounded-full bg-slate-200 w-full py-2'></p>
              </div>
              <button className='text-sm text-white px-3 rounded-full bg-slate-200 py-2 animate-pulse'></button>
            </div>
          </div>
        ))
      ) : (
        data.map((product) => {
          const activeImage = activeImages[product._id] || '';
          const isOutOfStock = product.stock === 0;

          return (
            <Link
              key={product._id}
              to={`/product/${product._id}`}
              className='relative w-full min-w-[280px] md:min-w-[300px] max-w-[280px] md:max-w-[300px] bg-white rounded-sm shadow group'
              onClick={scrollTop}
            >
              <div className='relative bg-slate-200 h-48 p-4 flex justify-center items-center'>
                {isOutOfStock && (
                  <span className='absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full z-10'>
                    Out of Stock
                  </span>
                )}

                {activeImage ? (
                  <img
                    src={activeImage}
                    alt={product.productName || 'Product Image'}
                    className='object-scale-down h-full transition-all group-hover:scale-110 mix-blend-multiply'
                  />
                ) : (
                  <div className='bg-slate-300 h-full w-full flex justify-center items-center'>
                    <p>No Image Available</p>
                  </div>
                )}
              </div>

              <div className='p-4 grid gap-3'>
                <h2 className='font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black'>
                  {product?.productName}
                </h2>
                <p className='capitalize text-slate-500'>{product?.category}</p>
                <div className='flex gap-3'>
                  <p className='text-red-600 font-medium'>
                    {displayINRCurrency(product?.sellingPrice)}
                  </p>
                  <p className='text-slate-500 line-through'>
                    {displayINRCurrency(product?.price)}
                  </p>
                </div>

                {isOutOfStock ? (
                  <button
                    className='text-sm bg-gray-400 text-white px-3 py-0.5 rounded-full cursor-not-allowed'
                    disabled
                  >
                     Add to Cart
                  </button>
                ) : (
                  <button
                    className='text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-0.5 rounded-full'
                    onClick={(e) => handleAddToCart(e, product._id)}
                    aria-label={`Add ${product?.productName} to cart`}
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            </Link>
          );
        })
      )}
    </div>
  );
};

export default VerticalCard;
