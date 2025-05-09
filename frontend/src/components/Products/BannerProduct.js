import React, { useCallback, useEffect, useState } from 'react';
import image1 from '../../assest/banner/img1.webp';
import image2 from '../../assest/banner/img2.webp';
import image3 from '../../assest/banner/img3.jpg';
import image4 from '../../assest/banner/img4.jpg';
import image5 from '../../assest/banner/img5.webp';

import image1Mobile from '../../assest/banner/img1_mobile.jpg';
import image2Mobile from '../../assest/banner/img2_mobile.webp';
import image3Mobile from '../../assest/banner/img3_mobile.jpg';
import image4Mobile from '../../assest/banner/img4_mobile.jpg';
import image5Mobile from '../../assest/banner/img5_mobile.png';

import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";

const BannerProduct = () => {
    const [currentImage, setCurrentImage] = useState(0);

    const desktopImages = [image1, image2, image3, image4, image5];
    const mobileImages = [image1Mobile, image2Mobile, image3Mobile, image4Mobile, image5Mobile];

    const nextImage = useCallback(() => {
        if (currentImage < desktopImages.length - 1) {
            setCurrentImage(prev => prev + 1);
        }
    }, [currentImage, desktopImages.length])

    const prevImage = () => {
        if (currentImage > 0) {
            setCurrentImage(prev => prev - 1);
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (currentImage < desktopImages.length - 1) {
                nextImage();
            } else {
                setCurrentImage(0);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [currentImage, desktopImages.length, nextImage]);

    return (
        <div className='container mx-auto px-4 rounded'>
            <div className='h-[200px] md:h-[300px] lg:h-[350px] w-full bg-slate-200 relative'>

                {/* Navigation Buttons */}
                <div className='absolute z-10 h-full w-full md:flex items-center hidden'>
                    <div className='flex justify-between w-full text-2xl px-4'>
                        <button onClick={prevImage} className='bg-white shadow-md rounded-full p-2'>
                            <FaAngleLeft />
                        </button>
                        <button onClick={nextImage} className='bg-white shadow-md rounded-full p-2'>
                            <FaAngleRight />
                        </button>
                    </div>
                </div>

                {/* Desktop and Tablet Images */}
                <div className='hidden md:flex h-full w-full overflow-hidden'>
                    {desktopImages.map((imageURL, index) => (
                        <div
                            key={imageURL}
                            className='w-full h-full min-w-full min-h-full transition-all duration-700'
                            style={{ transform: `translateX(-${currentImage * 100}%)` }}
                        >
                            <img src={imageURL} className='w-full h-full object-cover' alt='product'/>
                        </div>
                    ))}
                </div>

                {/* Mobile Images */}
                <div className='flex h-full w-full overflow-hidden md:hidden'>
                    {mobileImages.map((imageURL, index) => (
                        <div
                            key={imageURL}
                            className='w-full h-full min-w-full min-h-full transition-all duration-700'
                            style={{ transform: `translateX(-${currentImage * 100}%)` }}
                        >
                            <img src={imageURL} className='w-full h-full object-cover'alt='pproduct'/>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default BannerProduct;
