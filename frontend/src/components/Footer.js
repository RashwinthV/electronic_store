import React from 'react'

const Footer = () => {
  return (
    <footer class="bg-gray-800 text-white py-8 px-4 sm:px-6 lg:px-8">
    <div class="container mx-auto flex flex-col md:flex-row justify-between items-center">
  
      <div class="mb-4 md:mb-0">
        <a href="/" class="text-2xl font-bold text-white">Your Logo</a>
        <p class="text-sm text-gray-400 mt-2">&copy; 2023 Your Company. All rights reserved.</p>
      </div>
  
      <div class="flex space-x-6 md:space-x-8">
        <div>
          <h4 class="font-bold mb-2">Information</h4>
          <ul class="text-gray-400">
            <li><a href="/about" class="hover:text-white">About Us</a></li>
            <li><a href="/contact" class="hover:text-white">Contact Us</a></li>
            <li><a href="/faq" class="hover:text-white">FAQ</a></li>
          </ul>
        </div>
        <div>
          <h4 class="font-bold mb-2">Customer Service</h4>
          <ul class="text-gray-400">
            <li><a href="/privacy&policy" class="hover:text-white">Privacy Policy</a></li>
            <li><a href="/terms" class="hover:text-white">Terms & Conditions</a></li>
          </ul>
        </div>
        <div>
          <h4 class="font-bold mb-2">Connect With Us</h4>
          <ul class="text-gray-400 space-y-2">
            <li><a href="#" class="hover:text-white flex items-center"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg> example@email.com</a></li>
            <li><a href="#" class="hover:text-white flex items-center"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2z" clip-rule="evenodd" /></svg> Chat with us</a></li>
          </ul>
        </div>
      </div>
  
    </div>
  </footer>
  )
}

export default Footer