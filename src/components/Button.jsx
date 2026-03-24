import React from "react";
import { Button as HeroUIButton } from "@heroui/react";

const Button = ({
  children,
  type,
  variant = "primary",
  size = "md",
  className,
  isIconOnly,
  btnStyle,
  ...rest
}) => {
  return (
    <HeroUIButton
      isIconOnly={isIconOnly}
      type={type}
      size={size}
      className={`w-full  px-11 py-3 ${
        variant === "secondary"
          ? `bg-[#FFFFFF] text-[#2C6587] border-2 border-[#2C6587] ${btnStyle} `
          : `bg-[#214C65] text-[#FFFFFF] ${btnStyle}`
      } text-base font-bold capitalize ${
        size === "sm" ? "h-8" : "h-12"
      } ${className}`}
      {...rest}
    >
      {children}
    </HeroUIButton>
  );
};

export default Button;
