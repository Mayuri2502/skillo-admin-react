import React, { useEffect, useRef, useState } from "react";
import axiosInstance from "../../lib/Axios";
import { Spinner } from "@heroui/react";
import { Image } from "@heroui/react";
import {
  formatDateAndTimeUTCToLocal,
  timeAgo,
} from "../../utils/DateAndTimeConversion";

const ICONS = {
  success: "/src/assets/image/Success.png",
  error: "/src/assets/image/Error.png",
  warning: "/src/assets/image/warning.png",
};

const Notification = ({
  notificationsData = [],
  loader = false,
  setNotificationsData,
  setUnreadCount,
  setNotificationOpen,
}) => {
  const popupRef = useRef(null);
  const { t } = useTranslation();

  // ---------------------------------------
  // Close popup when clicking outside
  // ---------------------------------------
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setNotificationsData]);

  // ---------------------------------------
  // MARK ALL
  // ---------------------------------------
  const handleMarkAll = () => {
    setNotificationsData((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  // ---------------------------------------
  // MARK SINGLE
  // ---------------------------------------
  const handleClickNotification = (id) => {
    setNotificationsData((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
    setUnreadCount((prev) => prev - 1);
  };

  return (
    <div
      ref={popupRef}
      className="absolute top-16 left-0 sm:left-auto right-4 sm:right-6 w-screen sm:w-[480px] bg-white rounded-t-xl sm:rounded-xl shadow-lg z-[9999] max-h-[50vh] flex flex-col overflow-hidden border border-gray-200"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 p-4">
        <h1 className="text-sm sm:text-sm text-black uppercase tracking-wide font-semibold">
          {t("notifications")}
        </h1>

        {notificationsData?.length > 1 &&
          notificationsData?.some((n) => !n.isRead) && (
            <button
              onClick={handleMarkAll}
              className="text-xs sm:text-xs text-[#0B83D0] hover:underline uppercase cursor-pointer"
            >
              {t("markAllAsRead")}
            </button>
          )}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto touch-pan-y px-4 pb-6 pt-2">
        <div className="space-y-2">
          {loader && <Spinner />}

          {!loader && notificationsData?.length === 0 && (
            <p className="text-center uppercase py-5 italic text-gray-400">
              {t("noNotificationAvailable")}
            </p>
          )}

          {!loader &&
            notificationsData?.map((item) => (
              <div
                key={item.id}
                onClick={() => handleClickNotification(item.id)}
                className={`
                  flex items-center gap-3 p-3 rounded-lg border border-gray-200
                  cursor-pointer transition-all bg-white
                  ${item.isRead ? "opacity-75" : "hover:bg-gray-50"}
                `}
              >
                {/* Icon */}
                <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center">
                  <img
                    src={ICONS[item?.type] || ICONS?.warning}
                    alt={item?.type || "warning"}
                    width={48}
                    height={48}
                    className={`object-contain ${
                      item?.isRead ? "grayscale opacity-70" : ""
                    }`}
                  />
                </div>

                {/* Content */}
                <div className="flex-1 flex justify-between items-start">
                  <div className="flex flex-col pr-2">
                    <h3
                      className={`text-sm sm:text-xs uppercase font-medium ${
                        item.isRead ? "text-gray-500" : "text-black"
                      }`}
                    >
                      {item.title}
                    </h3>
                    <p
                      className={`text-[10px] sm:text-sm ${
                        item.isRead ? "text-gray-500" : "text-gray-700"
                      }`}
                    >
                      {item.message}
                    </p>
                  </div>

                  <p
                    className={`text-[11px] whitespace-nowrap ${
                      item.isRead ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {timeAgo(item.createdAt)}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Notification;
