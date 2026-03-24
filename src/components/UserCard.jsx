import React from "react";
import { Image } from "@heroui/react";
import { IoCallOutline } from "react-icons/io5";
import { CiMail } from "react-icons/ci";
import { PiFlag } from "react-icons/pi";
import userFallback from "../assets/image/Profile.png";
import { Avatar } from "@heroui/react";
import { FaCertificate } from "react-icons/fa";
import { AiOutlineSafetyCertificate } from "react-icons/ai";
import { MdVerified } from "react-icons/md";
import { useTranslation } from "react-i18next";

const SafeText = ({ value, maxWidth = 280 }) => {
  const hasValue = value !== null && value !== undefined && value !== "";

  return (
    <span
      className={`block truncate whitespace-nowrap text-[16px] ${
        hasValue ? "text-[#1A1A1A]" : "text-[#9CA3AF]"
      }`}
      style={{ maxWidth }}
      title={hasValue ? value : undefined}
    >
      {hasValue ? value : "—"}
    </span>
  );
};

const UserCard = ({ profile = {} }) => {
  const { t } = useTranslation();
  const {
    first_name = "",
    last_name = "",
    phone_number,
    phone_country_code,
    profile_photo_url,
    email,
    address,
    userType,
    is_docs_verified = false,
  } = profile;

  const fullName = [first_name, last_name].filter(Boolean).join(" ") || "—";
  return (
    <div
      className="
      bg-white
      min-w-[420px]
      w-fit
      rounded-[18px]
      shadow-[0px_25.6px_48px_4px_rgba(0,0,0,0.08)]
      flex items-center
      gap-3
      px-3 py-4
      sm


      "
    >
      {/* Avatar + Name */}
      <div className="flex flex-col items-center shrink-0 pl-2 sm:pl-4">
        {profile_photo_url ? (
          <Image
            src={profile_photo_url}
            alt={fullName}
            // fallbackSrc={userFallback}
            className="w-[60px] h-[60px] sm:w-[95px] sm:h-[95px] rounded-full object-cover"
          />
        ) : (
          <Avatar
            src={profile_photo_url}
            name={fullName}
            size="lg"
            className="w-[100px] h-[100px] min-w-[40px] text-[30px]"
            classNames={{ base: "bg-[#F5F5F5]" }}
          />
        )}
        <p
          className="truncate text-xl sm:text-xl font-semibold text-[#1A1A1A] max-w-[80px] sm:max-w-[100px]"
          title={fullName}
        >
          {fullName}
        </p>
      </div>

      {/* Details */}
      <div className="flex flex-col gap-2 sm:gap-3 text-md sm:text-md min-w-0">
        {userType !== "elder-users" && is_docs_verified && (
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* <FaCertificate  /> */}
            <MdVerified className="text-lg sm:text-[19px] text-[#1D7885] shrink-0" />

            {/* <SafeText className="text-[#1D7885]"  /> */}
            <p className="text-[#1D7885] font-semibold">
              {t("userManagementData.certified")}
            </p>
          </div>
        )}

        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <IoCallOutline className="text-md sm:text-lg text-[#6B7280] shrink-0" />
          <SafeText
            value={
              phone_number
                ? `${phone_country_code || ""} ${phone_number}`
                : null
            }
          />
        </div>

        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <CiMail className="text-md sm:text-lg text-[#6B7280] shrink-0" />
          <SafeText value={email} />
        </div>

        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <PiFlag className="text-md sm:text-lg text-[#6B7280] shrink-0" />
          <SafeText value={address} />
        </div>
      </div>
    </div>
  );
};

export default UserCard;
