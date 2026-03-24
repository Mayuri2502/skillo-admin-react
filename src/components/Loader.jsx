import React from "react";

const Loader = ({
  className = "w-6 h-6 text-white",
  ariaLabel = "Loading",
}) => {
  return (
    <span
      role="status"
      aria-label={ariaLabel}
      className="inline-flex items-center"
    >
      <svg
        className={`animate-spin ${className}`}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>
    </span>
  );
};

export default Loader;
