import React, { useEffect } from "react";
import logoImage from "/logo.png";

const GuestLayout = ({ children, title, description }) => {
  useEffect(() => {
    document.title = import.meta.env.VITE_APP_NAME + " - " + title;
  }, [title]);

  return (
    <div className="w-full bg-[#FFFFFF] h-screen flex items-center justify-center">
      {/* Main Card */}
      <div className="w-[900px] max-w-[95%] bg-[#FFFFFF]   grid grid-cols-1 md:grid-cols-2 p-4">
        {/* LEFT BLUE SECTION */}
        <div className="hidden md:flex items-center justify-center bg-[#FFFFFF] rounded-2xl">
          <img
            src={logoImage}
            alt="Logo"
            className="w-100 h-100 object-contain"
          />
        </div>

        {/* RIGHT FORM SECTION */}
        <div className="flex flex-col justify-center px-10 py-8">
          {/* Heading */}
          <div className="mb-6">
            <h1 className="text-[#1a1a1a] text-2xl font-semibold mb-1">
              {title}
            </h1>
            <p className="text-gray-500 text-sm">{description}</p>
          </div>

          {/* Form */}
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default GuestLayout;
