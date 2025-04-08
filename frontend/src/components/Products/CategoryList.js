import React, { useEffect, useState } from 'react';
import SummaryApi from '../../common';
import { Link } from 'react-router-dom';

const CategoryList = () => {
    const [categoryProduct, setCategoryProduct] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeImages, setActiveImages] = useState({}); 

    const categoryLoading = new Array(13).fill(null);

    const fetchCategoryProduct = async () => {
        setLoading(true);
        const response = await fetch(SummaryApi.categoryProduct.url);
        const dataResponse = await response.json();
        setLoading(false);
        setCategoryProduct(dataResponse.data);
    };

    useEffect(() => {
        if (categoryProduct.length > 0) {
            
            const images = categoryProduct.reduce((acc, product) => {
                if (product.productImage && product.productImage.length > 0 && product.productImage[0]) {
                    
                    try {
                        const url = new URL(product.productImage[0]);
                        const fileId = url.searchParams.get("id");
                        const proxyImageUrl = `${process.env.REACT_APP_IMAGE_URL}/proxy-image?fileId=${fileId}`;
                        acc[product._id] = proxyImageUrl; 
                    } catch (error) {
                        console.error("Invalid URL for product image", product.productImage[0]);
                    }
                }
                return acc;
            }, {});
            setActiveImages(images); 
        }
    }, [categoryProduct]); 

    useEffect(() => {
        fetchCategoryProduct();
    }, []);

    return (
        <div className='container mx-auto p-4'>
            <div className='flex items-center gap-4 justify-between overflow-scroll scrollbar-none'>
                {loading ? (
                    categoryLoading.map((el, index) => {
                        return (
                            <div
                                className='h-16 w-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-slate-200 animate-pulse'
                                key={"categoryLoading" + index}
                            ></div>
                        );
                    })
                ) : (
                    categoryProduct.map((product) => {
                        const activeImage = activeImages[product._id]; // Use image for each product
                        return (
                            <Link to={"/product-category?category=" + product?.category} className='cursor-pointer' key={product?.category}>
                                <div className='w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden p-4 bg-slate-200 flex items-center justify-center'>
                                    {activeImage ? (
                                        <img
                                            src={activeImage}
                                            alt={product?.category}
                                            className='h-full object-scale-down mix-blend-multiply hover:scale-125 transition-all'
                                        />
                                    ) : (
                                        <div className="h-full w-full bg-slate-300 flex justify-center items-center">
                                            <span>No Image</span>
                                        </div>
                                    )}
                                </div>
                                <p className='text-center text-sm md:text-base capitalize'>{product?.category}</p>
                            </Link>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default CategoryList;
