import React from 'react';

export function WhatsAppButton() {
  const whatsappNumber = '447757202729'; // Your WhatsApp number without '+' or spaces
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform duration-300 z-50 flex items-center justify-center"
      aria-label="Chat on WhatsApp"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 448 512"
        className="w-6 h-6 fill-current"
      >
        <path d="M380.9 97.1C339.4 55.6 283.8 32 224 32S108.6 55.6 67.1 97.1 32 183.8 32 243.8c0 43.6 10.3 85.4 29.9 122.2L32 480l118.7-30.9c36.3 17.7 77.2 27 119.3 27 59.8 0 115.8-23.6 157.3-65.1S416 299.8 416 240c0-59.8-23.6-115.8-65.1-157.3zM224 416c-35.6 0-70.3-10.3-99.4-29.9L100 380.9l-27 70.1 70.1-27c19.6-29.1 29.9-63.8 29.9-99.4 0-52.9-43.1-96-96-96s-96 43.1-96 96 43.1 96 96 96c26.9 0 52.1-11.1 70.1-29.9l27 27c-29.1 19.6-63.8 29.9-99.4 29.9zM344 240c0 52.9-43.1 96-96 96s-96-43.1-96-96 43.1-96 96-96 96 43.1 96 96z" />
      </svg>
    </a>
  );
}
