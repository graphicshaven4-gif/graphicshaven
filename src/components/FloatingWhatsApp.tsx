import React from 'react';

export const FloatingWhatsApp: React.FC = () => {
  return (
    <a
      href="https://wa.me/918778139593"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 group flex items-center gap-2.5 rounded-full bg-[#25D366] p-3.5 sm:p-4 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200"
    >
      <span className="pointer-events-none absolute right-full mr-3 hidden sm:inline-flex whitespace-nowrap rounded-lg bg-foreground px-3 py-1.5 text-xs font-medium text-background opacity-0 shadow-md transition-opacity group-hover:opacity-100">
        Chat on WhatsApp
      </span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        className="h-6 w-6 sm:h-7 sm:w-7 fill-current"
        aria-hidden="true"
      >
        <path d="M16.002 2.667C8.636 2.667 2.667 8.636 2.667 16c0 2.35.614 4.644 1.78 6.665L2.667 29.333l6.835-1.791A13.27 13.27 0 0 0 16.002 29.333C23.364 29.333 29.333 23.364 29.333 16S23.364 2.667 16.002 2.667zm0 24.444a11.06 11.06 0 0 1-5.647-1.547l-.405-.24-4.056 1.063 1.083-3.954-.264-.419a11.06 11.06 0 0 1-1.701-5.899c0-6.113 4.974-11.088 11.088-11.088 6.114 0 11.088 4.974 11.088 11.088 0 6.114-4.974 11.088-11.088 11.088zm6.08-8.303c-.333-.167-1.97-.972-2.275-1.083-.305-.111-.528-.167-.75.167-.222.333-.861 1.083-1.055 1.305-.194.222-.389.25-.722.083-.333-.167-1.406-.518-2.679-1.653-.991-.884-1.66-1.976-1.854-2.309-.194-.333-.021-.513.146-.679.15-.149.333-.389.5-.583.167-.194.222-.333.333-.555.111-.222.056-.417-.028-.583-.083-.167-.75-1.805-1.028-2.472-.271-.651-.546-.562-.75-.573-.194-.01-.417-.012-.639-.012-.222 0-.583.083-.889.417-.305.333-1.167 1.139-1.167 2.777s1.194 3.222 1.361 3.444c.167.222 2.35 3.589 5.694 5.033.795.343 1.416.548 1.9.701.799.254 1.526.218 2.101.132.641-.096 1.97-.805 2.248-1.583.278-.778.278-1.444.194-1.583-.083-.139-.305-.222-.639-.389z" />
      </svg>
    </a>
  );
};
