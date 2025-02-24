import React, { useState } from 'react';

const Faq = () => {
  const [expanded, setExpanded] = useState({}); // Store expanded state for each question

  const faqData = [
    {
      question: "What is your return policy?",
      answer: (
        <>
          <p>Our return policy allows you to return items within 30 days of purchase for a full refund. Items must be in their original condition and packaging. Please include your order number and reason for return.</p>
          <p>To initiate a return, please contact us at <a href="mailto:returns@example.com" className="text-blue-500 hover:underline">returns@example.com</a> with your order number and details. We will provide you with a return shipping label and instructions.</p>
        </>
      ),
    },
    {
      question: "How long does shipping take?",
      answer: (
        <>
          <p>Standard shipping typically takes 3-5 business days. Expedited shipping options are available at checkout for an additional fee. Please note that shipping times are estimates and may vary depending on your location and external factors like carrier delays.</p>
          <p>You will receive a tracking number once your order has shipped so you can track its progress.</p>
        </>
      ),
    },
    {
      question: "What payment methods do you accept?",
      answer: <p>We accept all major credit cards (Visa, Mastercard, American Express, Discover), as well as PayPal and Apple Pay.</p>,
    },
    // ... more FAQ items
    {
      question: "How can I contact customer support?",
      answer: (
        <p>You can contact our customer support team by email at <a href="mailto:support@example.com" className="text-blue-500 hover:underline">support@example.com</a> or by phone at +91 1234567890. Our customer support hours are 9:00 A.M - 9:00 P.M.</p>
      ),
    },
  ];

  const toggleExpand = (question) => {
    setExpanded({ ...expanded, [question]: !expanded[question] });
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Frequently Asked Questions</h1>
      <div className="space-y-4">
        {faqData.map((item, index) => (
          <div key={index} className="border rounded p-4">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleExpand(item.question)}
            >
              <h2 className="text-xl font-semibold">{item.question}</h2>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 transition-transform ${expanded[item.question] ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            {expanded[item.question] && (
              <div className="mt-4 text-gray-700">{item.answer}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Faq;