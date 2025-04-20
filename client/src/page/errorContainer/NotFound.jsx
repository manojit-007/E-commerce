// src/page/NotFound.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Title from "@/components/reusableComponents/title";
import { Ban } from "lucide-react";

const NotFound = ({ message = "Page Not Found" }) => {
  const navigate = useNavigate();

  return (
    <section className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-[#111] p-6 text-center">
      {/* Set Page Title */}
      <Title title="404 - Page Not Found" />

      {/* 404 Icon and Message */}
      <div className="flex flex-col items-center mb-6">
        <Ban className="w-20 h-20 text-red-600 mb-4" />
        <h1 className="text-6xl font-extrabold text-gray-900 dark:text-white mb-2">
          404
        </h1>
        <p className="text-xl text-gray-700 dark:text-gray-300">
          {message}
        </p>
      </div>

      {/* Navigation Buttons */}
      <div className="flex space-x-4">
        <Button
          onClick={() => navigate(-1)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg hover:bg-blue-700 transition shadow-lg"
          aria-label="Go Back"
        >
          Go Back
        </Button>
        <Button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg text-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition shadow-lg"
          aria-label="Go to Home"
        >
          Go to Home
        </Button>
      </div>
      <p className="mt-6 text-gray-600 dark:text-gray-400">
        Or, <Link to="/allProducts" className="text-blue-500 hover:underline">return to the product page</Link>.
      </p>
    </section>
  );
};

export default NotFound;
