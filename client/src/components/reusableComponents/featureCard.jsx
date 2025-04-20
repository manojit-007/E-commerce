/* eslint-disable no-unused-vars */
import React from "react";
const FeatureCard = ({ icon: Icon, title, description, bgColor, darkBgColor, border }) => (
    <div
      className={`p-6 text-center transition-transform transform hover:scale-105 duration-300 shadow-lg rounded ${bgColor} ${border} border`}
    >
      <Icon className={`w-16 h-16 ${darkBgColor} mx-auto mb-4`} />
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );
  
  export default FeatureCard;