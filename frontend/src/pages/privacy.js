import React from 'react'

function Privacy() {
  return (
    <div class="container mx-auto p-8">
        <h1 class="text-3xl font-bold mb-4">Privacy Policy</h1>

        <p class="text-gray-700 mb-4">Effective Date: October 26, 2023</p>

        <h2 class="text-2xl font-semibold mb-2">Information We Collect</h2>
        <p class="text-gray-700 mb-4">We collect several types of information from and about users of our Website, including information:</p>
        <ul class="list-disc pl-6 text-gray-700 mb-4">
            <li><b>Personal Information:</b> Such as your name, email address, phone number, and shipping address, which you provide when creating an account or placing an order.</li>
            <li><b>Payment Information:</b>  We collect payment information, such as credit card details, but this is processed securely by our payment processor, and we do not store your full credit card number on our servers.</li>
            <li><b>Usage Information:</b>  We collect information about how you use our Website, such as the pages you visit, the products you view, and the links you click. This includes IP address, browser type, and device information.</li>
            <li><b>Cookies:</b> We use cookies to enhance your browsing experience and personalize content.  You can control cookies through your browser settings, but disabling cookies may affect the functionality of our Website.</li>
        </ul>

        <h2 class="text-2xl font-semibold mb-2">How We Use Your Information</h2>
        <p class="text-gray-700 mb-4">We use the information we collect for various purposes, including:</p>
        <ul class="list-disc pl-6 text-gray-700 mb-4">
            <li><b>Providing Services:</b> To fulfill your orders, process payments, and provide customer support.</li>
            <li><b>Improving Website:</b> To analyze website usage and make improvements to our Website and services.</li>
            <li><b>Marketing:</b> With your consent, we may send you marketing emails about new products, promotions, or other offers.  You can opt out of these emails at any time.</li>
            <li><b>Legal Compliance:</b> To comply with applicable laws and regulations.</li>
        </ul>

        <h2 class="text-2xl font-semibold mb-2">Sharing Your Information</h2>
        <p class="text-gray-700 mb-4">We do not sell your personal information.  We may share your information with:</p>
        <ul class="list-disc pl-6 text-gray-700 mb-4">
            <li><b>Service Providers:</b> We may share information with third-party service providers who assist us with payment processing, shipping, marketing, and other services.  These providers are contractually obligated to protect your information.</li>
            <li><b>Legal Authorities:</b> We may disclose your information to legal authorities if required by law or to protect our legal rights.</li>
        </ul>

        <h2 class="text-2xl font-semibold mb-2">Your Choices</h2>
        <p class="text-gray-700 mb-4">You have the following choices regarding your personal information:</p>
        <ul class="list-disc pl-6 text-gray-700 mb-4">
            <li><b>Access:</b> You can access and update your personal information through your account settings.</li>
            <li><b>Opt-out:</b> You can opt out of marketing emails by clicking the unsubscribe link in the emails.</li>
            <li><b>Cookies:</b> You can control cookies through your browser settings.</li>
        </ul>

        <h2 class="text-2xl font-semibold mb-2">Contact Us</h2>
        <p class="text-gray-700">If you have any questions about this Privacy Policy, please contact us at: <a href="mailto:info@example.com" class="text-blue-500 hover:underline">info@example.com</a></p>
    </div>
  )
  }

export default Privacy