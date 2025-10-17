import React, { useState } from "react";

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "How do I buy a car from your platform?",
      answer:
        "You can browse available cars, compare listings, and contact the seller directly through our platform. Once an agreement is made, payment and delivery can be arranged securely."
    },
    {
      question: "Can I apply for car financing?",
      answer:
        "Yes, we work with trusted finance partners who can help you apply for car loans directly through our platform."
    },
    {
      question: "Do you offer car inspection services?",
      answer:
        "Yes, we provide professional pre-purchase inspection services to ensure the car condition before you buy."
    },
    {
      question: "Can I sell my car on your website?",
      answer:
        "Yes, you can list your car for sale by creating an account and submitting your vehicle information."
    },
    {
      question: "Is there any warranty on the cars?",
      answer:
        "Some vehicles include a warranty depending on the seller. Extended warranty options may also be available."
    }
  ];

  return (
    <section className="bg-white ">
      <div className="container px-6 py-12 mx-auto">
        <h1 className="text-2xl font-semibold text-gray-800 lg:text-3xl dark:text-black">
          Frequently Asked Questions
        </h1>

        <div className="mt-8 space-y-8 lg:mt-12">
          {faqs.map((item, index) => (
            <div
              key={index}
              className="p-8 bg-gray-100 rounded-lg dark:bg-gray-800"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="flex items-center justify-between w-full"
              >
                <h1 className="font-semibold text-gray-700 dark:text-white">
                  {item.question}
                </h1>
                <span className="p-1 text-white bg-blue-500 rounded-full">
                  {openIndex === index ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M18 12H6"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  )}
                </span>
              </button>

              {openIndex === index && (
                <p className="mt-6 text-sm text-gray-500 dark:text-gray-300">
                  {item.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faq;
