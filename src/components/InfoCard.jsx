import React, { useState, useRef, useEffect } from "react";
import totaluser from "../assets/image/Users.png";
import totalTransc from "../assets/image/total-transaction.png";
import totalElder from "../assets/image/total-elder.png";
import totalProfessional from "../assets/image/total-professional.png";

import { Image } from "@heroui/react";

const InfoCard = ({ title, data, type, className }) => {
  const getImageByType = (type) => {
    switch (type) {
      case "users":
        return totaluser;
      case "transactions":
        return totalTransc;
      case "elder":
        return totalElder;
      case "professional":
        return totalProfessional;
    }
  };

  return (
    <div
      className={`bg-[#FFFF] min-h-[100px] sm:min-h-[110px]  w-full rounded-[22px]  flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 gap-3 ${className}`}
    >
      <div className="flex flex-col items-start gap-1 sm:gap-2">
        <p className="text-[#1a1a1a] text-base sm:text-base md:text-base font-medium">
          {title}
        </p>
        <h2 className="font-extrabold text-lg sm:text-xl md:text-2xl">
          {data}
        </h2>
      </div>
      <div className="flex-shrink-0">
        <Image
          src={getImageByType(type)}
          height={type === "transactions" ? 65 : 55}
          width={type === "transactions" ? 65 : 55}
          className={
            type === "transactions"
              ? "sm:h-[75px] sm:w-[75px] lg:h-[80px] lg:w-[80px]"
              : "sm:h-[60px] sm:w-[60px] lg:h-[60px] lg:w-[60px]"
          }
        />
      </div>
    </div>
  );
};

export default InfoCard;
