import React, { useState, useRef, useEffect } from "react";
import { IoIosNotificationsOutline } from "react-icons/io";
import profileImage from "../assets/image/ProfileImage.png";
import { HiMenuAlt2 } from "react-icons/hi";
import { useSelector, useDispatch } from "react-redux";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  Spinner,
} from "@heroui/react";
import Profile from "../pages/profile/Profile";
import Button from "./Button";
import WarningIcon from "../assets/image/warning.png";
import { Image } from "@heroui/react";
import IconAndTextModal from "./IconAndTextModal";
import success from "../assets/image/Success.png";
import { useNavigate } from "react-router-dom";
import Notification from "../pages/notifications/Notification";
import axiosInstance from "../lib/Axios";
import { setUser } from "../redux/slice/authSlice.js";
import LanguageSwitch from "./LanguageDropDown.jsx";
import { useTranslation } from "react-i18next";

const Header = ({ title = "Dashboard", toggleSidebar }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [openEdit, setOpenEdit] = useState(false);
  const [logOut, setLogOut] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationsData, setNotificationsData] = useState([
    {
      id: 1,
      title: "New User Registration",
      message: "John Doe has registered as a Professional User",
      type: "success",
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
    },
    {
      id: 2,
      title: "Payment Received",
      message: "Payment of $500 received from Customer Business",
      type: "success",
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    },
    {
      id: 3,
      title: "Job Completed",
      message: "Service request #1234 has been marked as completed",
      type: "success",
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    },
    {
      id: 4,
      title: "System Alert",
      message: "Scheduled maintenance will occur tonight at 2 AM",
      type: "warning",
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    },
    {
      id: 5,
      title: "Failed Transaction",
      message: "Transaction #5678 failed due to insufficient funds",
      type: "error",
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
    },
  ]);
  const [unreadCount, setUnreadCount] = useState(3);
  const [loader, setLoader] = useState(false);
  const [userData, storeUserData] = useState();
  const { i18n } = useTranslation();
  const { t } = useTranslation();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("userData"));
    console.log("DATA", data);
    storeUserData(data);
  }, []);

  useEffect(() => {
    const dummyNotifications = [
      {
        id: 1,
        title: t("welcome"),
        message: t("welcomeToCoudPouss"),
        type: "success",
        isRead: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        title: t("updateAvailable"),
        message:
          t("newUpdateAvailable"),
        type: "warning",
        isRead: false,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 3,
        title: t("profileUpdated"),
        message: t("profileUpdatedSuccess"),
        type: "success",
        isRead: true,
        createdAt: new Date(Date.now() - 7200000).toISOString(),
      },
      {
        id: 4,
        title: t("newMessage"),
        message: t("newMessageFromSupport"),
        type: "warning",
        isRead: false,
        createdAt: new Date(Date.now() - 10800000).toISOString(),
      },
      {
        id: 5,
        title: t("paymentSuccessful"),
        message: t("paymentProcessedSuccess"),
        type: "success",
        isRead: true,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ];
    setNotificationsData(dummyNotifications);
    const unreadCount = dummyNotifications.filter((n) => !n.isRead).length;
    setUnreadCount(unreadCount);
  }, []);

  return (
    <div className="bg-[#FFFF] min-h-[65px] rounded-[12px] flex items-center justify-between p-2">
      {/* LEFT */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="text-black lg:hidden hover:text-[#285B7A] transition-colors"
        >
          <HiMenuAlt2 className="text-2xl" />
        </button>

        <h2 className="text-black capitalize text-base sm:text-xl font-medium m-0 truncate  font-semibold pl-2">
          {t(`${title}`)}
        </h2>
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        <button
          className="relative text-white hover:text-[#285B7A] transition-colors"
          onClick={() => {
            setNotificationOpen((prev) => !prev);
          }}
        >
          <div className="relative">
            <IoIosNotificationsOutline className="text-2xl " color="black" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </div>
        </button>
        {notificationOpen && (
          <Notification
            notificationsData={notificationsData}
            loader={loader}
            setNotificationsData={setNotificationsData}
            setUnreadCount={setUnreadCount}
            setNotificationOpen={setNotificationOpen}
          />
        )}

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-[#545454] font-semibold text-sm leading-tight m-0">
              {userData?.name || t("adminUser")}
            </p>
            <p className="text-[#8a8a8a] text-xs leading-tight m-0 capitalize">
              {t("admin")}
            </p>
          </div>

          <div
            className="relative w-8 h-8 sm:w-10 sm:h-10 cursor-pointer border rounded-full overflow-hidden"
            onClick={() => setOpenEdit(true)}
          >
            <img
              src={userData?.profile_photo || profileImage}
              alt={userData?.name || t("profile")}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = profileImage;
              }}
            />

            <div className="absolute bottom-0 right-0 w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full border-2 border-[#1c1c1d]" />
          </div>
          {openEdit && (
            <Profile openEdit={openEdit} setOpenEdit={setOpenEdit} />
          )}
        </div>
      </div>

      {/* LOGOUT MODAL */}
      <Modal isOpen={logOut} onOpenChange={setLogOut} size="xl" backdrop="blur">
        <ModalContent className="bg-[#141414] text-white border border-[#1B1B1B]">
          <ModalBody className="flex flex-col items-center justify-center pt-8">
            <Image src={WarningIcon} alt="warning" height={80} width={80} />
            <h1 className="md:text-3xl text-2xl font-bold mt-3 text-center">
              {t("logoutConfirmation")}
            </h1>
            <p className="text-[#B0B0B0] text-center">
              {t("needToSignInAgain")}
            </p>
          </ModalBody>
          <ModalFooter className="pb-6 flex justify-center gap-4">
            <Button
              variant="secondary"
              className="w-[150px] h-10"
              //   onPress={() => setLogOut(false)}
              //   disabled={isLoggingOut}
            >
              {t("cancel")}
            </Button>
            <Button
              variant="primary"
              className="w-[170px] h-10"
              //   onClick={handleLogout}
              //   disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <div className="flex items-center justify-center gap-2">
                  {t("loggingOut")}
                </div>
              ) : (
                t("logout")
              )}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Header;
