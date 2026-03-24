import React, { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import Header from "../components/Header";

const MainLayout = ({ children, title }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const language = localStorage.getItem("coudPouss-language") || "en";

  console.log("Current language:", language);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    document.title = import.meta.env.VITE_APP_NAME + " - " + title;
  }, [title]);

  return (
    <div className="bg-[#E6E6E666]  relative w-full h-screen overflow-hidden">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen((prev) => !prev)}
      />

      {/* Overlay for mobile */}
      {/* {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen((prev) => !prev)}
        />
      )} */}

      <div
        className={`absolute left-0  ${language === "fr" ? "lg:left-[270px]" : "lg:left-[265px]"} right-0 top-0 bottom-0 overflow-y-auto `}
      >
        <div className="p-3 lg:p-6">
          <Header title={title} toggleSidebar={toggleSidebar} />
          {children}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;



