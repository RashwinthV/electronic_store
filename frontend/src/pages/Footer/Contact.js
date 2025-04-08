import React from 'react';

const Contact = () => {
  return (
    <div className="container mx-auto p-8 flex justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg text-center">
        <h1 className="text-2xl font-bold mb-4">Contact Us</h1>
        <div className="text-left space-y-4">
          <p><span className="font-semibold">Company Name:</span> Digital Estore </p>
          
          <p>
            <span className="font-semibold">Registered Address:</span> <br/>
            Door number, Area, City, <br/>
            State, PIN: 000000
          </p>

          <p>
            <span className="font-semibold">Operational Address:</span> <br/>
            Door number, Area, City, <br/>
            State, PIN: 000000
          </p>
          
          <p>
            <span className="font-semibold">Telephone:</span> 
            <a href="tel:8778636389" className="text-blue-500 hover:underline ml-2">8778636389</a>
          </p>

          <p>
            <span className="font-semibold">Email:</span> 
            <a href="mailto:kirithiksaran@gmail.com" className="text-blue-500 hover:underline ml-2">kirithiksaran@gmail.com</a>
          </p>
        </div>
        <p className="mt-4 text-gray-600">We're here to assist you. Feel free to reach out!</p>
      </div>
    </div>
  );
};

export default Contact;