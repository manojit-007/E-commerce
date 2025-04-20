import React from "react";
import "./loader.css";

const Loader = () => {
  return (
    <section className="flex gap-2">
      <div className="w-5 h-5 bg-black animateChangeColor" style={{ animationDelay: "0s" }}></div>
      <div className="w-5 h-5 bg-black animateChangeColor" style={{ animationDelay: "0.2s" }}></div>
      <div className="w-5 h-5 bg-black animateChangeColor" style={{ animationDelay: "0.4s" }}></div>
      <div className="w-5 h-5 bg-black animateChangeColor" style={{ animationDelay: "0.6s" }}></div>
      <div className="w-5 h-5 bg-black animateChangeColor" style={{ animationDelay: "0.8s" }}></div>
    </section>
  );
};

export default Loader;
