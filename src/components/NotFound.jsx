import React from "react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black overflow-hidden">
      
      {/* Subtle grid background */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full bg-[linear-gradient(90deg,black_1px,transparent_1px),linear-gradient(black_1px,transparent_1px)] bg-[size:40px_40px] animate-[moveGrid_12s_linear_infinite]"></div>
      </div>

      <div className="text-center z-10 px-6">
        
        {/* 404 */}
        <h1 className="text-8xl md:text-9xl font-extrabold tracking-widest animate-pulse">
          404
        </h1>

        {/* Divider */}
        <div className="w-16 h-[2px] bg-black mx-auto my-6 opacity-40"></div>

        {/* Message */}
        <p className="text-lg md:text-xl text-gray-600 animate-fadeIn">
          Page not found. The link might be broken or removed.
        </p>

        {/* Button */}
        <a
          href="/"
          className="inline-block mt-8 px-6 py-3 border border-black rounded-md text-sm tracking-wide hover:bg-black hover:text-white transition-all duration-300"
        >
          BACK TO HOME
        </a>
      </div>
    </div>
  );
};

export default NotFound;