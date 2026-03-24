import React from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center gap-4 bg-white">
      <h1 className="text-4xl font-semibold text-black">
        404
      </h1>

      <p className="text-gray-600 text-base max-w-md">
        Oops! The page you are looking for does not exist.
      </p>

      <Link to="/">
        <Button className="px-8 mt-2">
          Go to Home
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;
