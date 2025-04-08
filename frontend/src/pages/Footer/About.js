import React from 'react';

const About = () => {
  return (
    <div className="container mx-auto p-8">
    <h1 className="text-3xl font-bold text-center mb-6">About Us</h1>
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6">
      <p className="text-gray-700 text-lg">
        Welcome to <span className="font-semibold">Digital Estore</span>, your trusted destination for high-quality electronic products. 
        We specialize in providing the latest gadgets, home appliances, and accessories at competitive prices.
      </p>
      <p className="text-gray-700 text-lg mt-4">
        With a commitment to customer satisfaction, we ensure a seamless shopping experience by offering reliable products, 
        expert guidance, and exceptional after-sales service. Whether you are looking for smartphones, laptops, 
        or home electronics, we’ve got you covered.
      </p>
      <p className="text-gray-700 text-lg mt-4">
        Thank you for choosing <span className="font-semibold">Digital Estore</span>. We look forward to serving you!
      </p>
    </div>
  </div>
  );
};

export default About;