import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-3 px-4 sm:px-6 lg:px-8">
    <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
  
      <div className="mb-4 md:mb-0">
        <a href="/" className="text-2xl font-bold text-white">This Project is Developed by </a>
        <p className="text-sm text-gray-400 mt-2">&copy; 727623MCA014,727623MCA019, 727623MCA026 , 727623MCA063  .</p>
        <Link to={"/privacy&policy"} className='text-sm text-gray-400 mt-5 p-2' style={{textDecoration:"underline"}}>privacy Policy </Link>
        <Link to={"/terms"} className='text-sm mx-10 text-gray-400 mt-5' style={{textDecoration:"underline"}}> Terms & Conditions </Link>
      </div>
  
      <div className="flex space-x-6 md:space-x-8">
     
        <div>
          <h4 className="font-bold mb-2">Information</h4>
          <ul className="text-gray-400 space-y-2">
            {/* <li><a href="/about" className="hover:text-white">About Us</a></li>
            <li><a href="/contact" className="hover:text-white">Contact Us</a></li>
            <li><a href="/faq" className="hover:text-white">FAQ</a></li> */}
            <li>
    <a href="/about" className="hover:text-white flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 1010 10A10 10 0 0012 2z"/>
      </svg>
      About Us
    </a>
  </li>
  <li>
    <a href="/contact" className="hover:text-white flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
        <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.27c1.2.4 2.49.62 3.8.62a1 1 0 011 1v3.5a1 1 0 01-1 1c-9.39 0-17-7.61-17-17a1 1 0 011-1H6.5a1 1 0 011 1c0 1.31.22 2.6.62 3.8a1 1 0 01-.27 1.11l-2.23 2.24z"/>
      </svg>
      Contact Us
    </a>
  </li>
  <li>
    <a href="/faq" className="hover:text-white flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 16h-2v-2h2v2zm1.07-7.75l-.9.92c-.73.73-1.07 1.29-1.07 2.33H10v-.5c0-1.07.37-1.79 1.1-2.52l1.24-1.24c.36-.36.56-.86.56-1.37 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
      </svg>
      FAQ
    </a>
  </li>
          </ul>
        </div>



        <div>
          <h4 className="font-bold mb-2">Connect With Us</h4>
          <ul className="text-gray-400 space-y-2">
          <li>
  <a href="/#" className="hover:text-white flex items-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 mr-2"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
    example@email.com
  </a>
</li>
<li>
  <a href="/#" className="hover:text-white flex items-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 mr-2"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"  
        d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2z"
        clipRule="evenodd"  
      />
    </svg>
    Chat with us
  </a>
</li>
 </ul>
        </div>
      </div>
  
    </div> 
  </footer>
  )
}

export default Footer