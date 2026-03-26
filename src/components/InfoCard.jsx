import React, { useState, useRef, useEffect } from "react";
import totaluser from "../assets/image/Users.png";
import totalTransc from "../assets/image/total-transaction.png";
import totalElder from "../assets/image/total-elder.png";
import totalProfessional from "../assets/image/total-professional.png";
import { FiUsers, FiDollarSign, FiTrendingUp, FiBriefcase, FiCheckCircle, FiClock, FiXCircle } from "react-icons/fi";

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
      default:
        return null;
    }
  };

  const getIconByType = (type) => {
    switch (type) {
      case "activeSubscriptions":
        return { icon: FiUsers, color: "text-[#EC613D]", bgColor: "bg-[#EC613D20]" };
      case "totalRevenue":
        return { icon: FiDollarSign, color: "text-[#10B981]", bgColor: "bg-[#10B98120]" };
      case "totalCommission":
        return { icon: FiTrendingUp, color: "text-[#3B82F6]", bgColor: "bg-[#3B82F620]" };
      case "totalJobs":
        return { icon: FiBriefcase, color: "text-[#8B5CF6]", bgColor: "bg-[#8B5CF620]" };
      case "completedJobs":
        return { icon: FiCheckCircle, color: "text-[#10B981]", bgColor: "bg-[#10B98120]" };
      case "inProgressJobs":
        return { icon: FiClock, color: "text-[#F59E0B]", bgColor: "bg-[#F59E0B20]" };
      case "cancelJobs":
        return { icon: FiXCircle, color: "text-[#EF4444]", bgColor: "bg-[#EF444420]" };
      default:
        return null;
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
        {getImageByType(type) ? (
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
        ) : (
          getIconByType(type) && (() => {
            const IconComponent = getIconByType(type).icon;
            return (
              <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full ${getIconByType(type).bgColor} flex items-center justify-center`}>
                <IconComponent className={`text-2xl sm:text-3xl ${getIconByType(type).color}`} />
              </div>
            );
          })()
        )}
      </div>
    </div>
  );
};

export default InfoCard;
