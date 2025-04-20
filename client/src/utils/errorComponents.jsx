import React from "react";

const ErrorComponent = ({ error }) => {
  return (
    <div className="flex items-center justify-center w-full h-full bg-red-100 text-red-700 p-4 rounded-md shadow-md">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 mr-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M18.364 5.636a9 9 0 11-12.728 0m12.728 0a9 9 0 00-12.728 0m7.071 7.071L12 13m0 0l-1.414 1.414M12 13l1.414 1.414M12 17h.01"
        />
      </svg>
      <span>
        {error || "An unexpected error occurred. Please try again later."}
      </span>
    </div>
  );
};

export default ErrorComponent;
