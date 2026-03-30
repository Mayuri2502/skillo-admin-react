import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout, logoutHard } from "../redux/slice/authSlice";
import authServices from "../services/authServices";
import IconAndTextModal from "./IconAndTextModal";
import success from "../assets/image/Success.png";
import Cookies from "js-cookie";
import logoImage from "/logo.png";
import ModalView from "./Model";
import {
  MdOutlineDashboard,
  MdPeople,
  MdSportsScore,
  MdGroups,
  MdPool,
  MdHistory,
  MdLogout,
  MdClose,
} from "react-icons/md";
import { MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight } from "react-icons/md";

import { FaFootballBall } from "react-icons/fa";
import { FiUsers } from "react-icons/fi";
import { IoIosArrowDown } from "react-icons/io";
import { IoFootball } from "react-icons/io5";
import { MdOutlineVerified } from "react-icons/md";
import { LuSquareChartGantt } from "react-icons/lu";
import { RiSecurePaymentLine } from "react-icons/ri";

import {
  Modal,
  ModalContent,
  ModalBody,
  Image,
  useDisclosure,
  ModalFooter,
} from "@heroui/react";
import Button from "./Button";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const Sidebar = ({ isOpen = false, onClose }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { t } = useTranslation();

  const menuItems = [
    {
      name: t("DashboardData.dashboard"),
      path: "/",
      icon: MdOutlineDashboard,
    },
    {
      name: t("userManagement"),
      path: "/user-management/elder-users",
      icon: FiUsers,
    },
    {
      name: t("verification"),
      path: "/verification",
      icon: MdOutlineVerified,
    },
    {
      name: t("requestsManagement"),
      path: "/requests-management",
      icon: LuSquareChartGantt,
    },
    {
      name: t("transactionManagement"),
      path: "/payment-management",
      icon: RiSecurePaymentLine,
    },
  ];

  const {
    isOpen: isOpenLogoutModal,
    onOpen: onOpenLogoutModal,
    onOpenChange: onOpenChangeLogoutModal,
  } = useDisclosure();

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      dispatch(logout());
      dispatch(logoutHard());
      toast.success(t("loggedOutSuccessfully"));
    } catch (error) {
      toast.error(error.message || error.msg || t("somethingWentWrong"));
    } finally {
      setIsLoggingOut(false);
      onOpenChangeLogoutModal(false);
    }
  };

  return (
    <div
      className={`fixed lg:absolute left-0 top-0 bottom-0 bg-[#1A1A1A] border-r border-[#333333] rounded-br-[12px] rounded-tr-[12px] overflow-y-auto transition-transform duration-300 z-40 ${
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}
    >
      <div className="flex flex-col justify-between h-full py-8 px-3">
        {/* Close button for mobile */}

        {/* Logo */}
        <div>
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center justify-start gap-2">
              <div className=" flex flex-col w-[50px] h-15">
                <img
                  alt="Skillo logo"
                  className="w-full h-full object-contain"
                  src={logoImage}
                />
              </div>
              {!isCollapsed && (
                <div>
                  <img
                    src="/skillo-logo.png"
                    alt="Skillo logo"
                    className="h-8 w-auto object-contain"
                  />
                </div>
              )}
            </div>
            <button
              onClick={toggleSidebar}
              className="text-[#FFFFFF] hover:text-[#EC613D] transition-colors"
            >
              {isCollapsed ? (
                <MdKeyboardDoubleArrowRight className="text-xl" />
              ) : (
                <MdKeyboardDoubleArrowLeft className="text-xl" />
              )}
            </button>
          </div>

          {/* Menu Items */}
          <div className="flex flex-col gap-4">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive =
                item.path === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(item.path) ||
                    (item.path === "/requests-management" &&
                      location.pathname.startsWith("/requests/"));
              const hasDropdownItems =
                item.dropdownItems && item.dropdownItems.length > 0;
              const isAnyDropdownItemActive =
                hasDropdownItems &&
                item.dropdownItems.some((dropdownItem) =>
                  location.pathname.startsWith(dropdownItem.path),
                );
              const isDropdownOpen =
                openDropdown === index || isAnyDropdownItemActive;

              return (
                <div key={index}>
                  {hasDropdownItems ? (
                    <button
                      onClick={() =>
                        setOpenDropdown(
                          isDropdownOpen && !isAnyDropdownItemActive
                            ? null
                            : index,
                        )
                      }
                      className={`flex items-center gap-2 px-5 py-3 rounded-2xl transition-all w-full text-left ${
                        isAnyDropdownItemActive
                          ? "bg-[#EC613D] text-[#FFFFFF] rounded-2xl"
                          : "text-[#FFFFFF] hover:bg-[#333333] rounded-2xl"
                      }`}
                    >
                      <Icon className=" shrink-0" />
                      {!isCollapsed && (
                        <span className="capitalize text-sm font-normal flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                          {item.name}
                        </span>
                      )}
                      <IoIosArrowDown
                        className={`text-xs shrink-0 transition-transform ${
                          isDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  ) : (
                    <Link
                      to={item.path}
                      className={`flex items-center gap-2 px-5 py-3 rounded transition-all ${
                        isActive
                          ? "bg-[#EC613D] text-[#FFFFFF] rounded-2xl"
                          : "text-[#FFFFFF] hover:bg-[#333333] rounded-2xl"
                      }`}
                    >
                      <Icon className="text-base bg-transparent shrink-0" />
                      {!isCollapsed && (
                        <span className="capitalize text-sm font-normal flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                          {item.name}
                        </span>
                      )}
                    </Link>
                  )}

                  {/* Dropdown Items */}
                  {hasDropdownItems && isDropdownOpen && (
                    <div className="ml-4 mt-2 flex flex-col gap-2">
                      {item.dropdownItems.map((dropdownItem, dropdownIndex) => {
                        const DropdownIcon = dropdownItem.icon || FiUsers;
                        const isDropdownActive = location.pathname.startsWith(
                          dropdownItem.path,
                        );

                        return (
                          <Link
                            key={dropdownIndex}
                            to={dropdownItem.path}
                            className={`flex items-center gap-2 px-4 py-3 rounded transition-all ${
                              isDropdownActive
                                ? "bg-[#EC613D] text-[#FFFFFF] rounded-2xl"
                                : "text-[#FFFFFF] hover:bg-[#333333] rounded-2xl"
                            }`}
                          >
                            {/* {DropdownIcon && (
                              <DropdownIcon className="text-sm shrink-0" />
                            )} */}
                            {!isCollapsed && (
                              <span className="capitalize text-xs font-normal">
                                {dropdownItem.name}
                              </span>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Logout */}
        <div className="pt-2">
          <div className="w-full h-px bg-[#333333] mb-2"></div>
          <button
            className="flex items-center gap-2 px-8 py-3 rounded w-full text-left text-[#FFFFFF] hover:bg-[#333333] transition-all"
            onClick={onOpenLogoutModal}
          >
            <MdLogout className="text-xl shrink-0" />
            {!isCollapsed && (
              <span className="capitalize text-sm">{t("logoutFromSidebar")}</span>
            )}
          </button>
        </div>

        <ModalView
          openModel={isOpenLogoutModal}
          setOpenModel={onOpenChangeLogoutModal}
          title={t("logoutConfirmation")}
          textAlign="center"
          message="warning"
          minHeight="220px"
          width="500px"
          showClose={false}
          children={
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-6">
              <Button
                variant="secondary"
                btnStyle="rounded rounded-[25px]"
                onClick={() => {
                  onOpenChangeLogoutModal();
                }}
              >
                {t("cancel")}
              </Button>
              <Button
                btnStyle="rounded-[25px]"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? t("loggingOut") : t("logout")}
              </Button>
            </div>
          }
        />
      </div>
    </div>
  );
};

export default Sidebar;
