import React, { useState, useEffect } from 'react';
import { MdModeEditOutline } from "react-icons/md";
import AdminEditProduct from './AdminEditProduct';
import displayINRCurrency from '../../helpers/displayCurrency';

const AdminProductCard = ({ data, fetchdata }) => {
    const [editProduct, setEditProduct] = useState(false);
    const [activeImage, setActiveImage] = useState(null);

    useEffect(() => {
        if (data && data.productImage && Array.isArray(data.productImage) && data.productImage.length > 0) {
            try {
                const url = new URL(data.productImage[0]);
                const fileId = url.searchParams.get("id");
                if (fileId) {
                    const proxyImageUrl = `${process.env.REACT_APP_IMAGE_URL}/proxy-image?fileId=${fileId}`;
                    setActiveImage(proxyImageUrl); 
                } else {
                    console.error("File ID missing in image URL");
                    setActiveImage(null);
                }
            } catch (error) {
                console.error("Invalid URL or image URL format:", error);
                setActiveImage(null);
            }
        } else {
            setActiveImage(null); 
        }
    }, [data]); 

    return (
        <div className="bg-white h-50 p-4 rounded">
            <div className="w-40">
                {/* Image container with height set to 40 */}
                <div className="w-32 h-40 flex justify-center items-center">
                    <div className="w-auto h-40 bg-slate-100 border rounded flex justify-center items-center">
                        
                            <img
                                src={activeImage} // Use the active image URL
                                alt="Product"
                                className="w-full h-full object-cover rounded"
                            />
                       
                    </div>
                </div>

                {/* Product name */}
                <h1 className="text-ellipsis line-clamp-2">{data.productName}</h1>

                {/* Price and Edit Button */}
                <div>
                    <p className="font-semibold">
                        {displayINRCurrency(data.sellingPrice)}
                    </p>

                    <div
                        className="w-fit ml-auto p-2 bg-green-100 hover:bg-green-600 rounded-full hover:text-white cursor-pointer"
                        onClick={() => setEditProduct(true)} // Trigger editing
                    >
                        <MdModeEditOutline />
                    </div>
                </div>
            </div>

            {/* Conditional rendering of the form */}
            {editProduct && (
                <div className="relative z-20">
                    <AdminEditProduct
                        productData={data}
                        onClose={() => setEditProduct(false)}
                        fetchdata={fetchdata}
                    />
                </div>
            )}
        </div>
    );
};

export default AdminProductCard;
