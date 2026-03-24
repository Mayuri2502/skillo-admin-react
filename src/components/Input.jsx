import React from "react";

const Input = ({
  type,
  label,
  name,
  placeholder,
  required,
  isRequired,
  errorMessage,
  className,
  ...rest
}) => {
  // Accept both `required` and `isRequired` props and normalize to `required` for the underlying component
  const finalRequired = required || isRequired || false;

  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-[#404040] text-base font-medium capitalize ">
        {label}
      </label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        required={finalRequired}
        className={`w-full px-2 py-3 bg-white border rounded-lg h-12 text-[#404040] pl-2 hover:border-gray-300 focus:outline-none ${
          errorMessage ? "border-red-500" : "border-gray-300"
        } ${className}`}
        {...rest}
      />
      {errorMessage && (
        <span className="text-red-500 text-xs">{errorMessage}</span>
      )}
    </div>
  );
};

export default Input;
