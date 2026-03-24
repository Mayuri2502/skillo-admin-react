import React, { useEffect, useMemo, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import { IoIosArrowBack } from "react-icons/io";
import UserCard from "../../components/UserCard";
import InfoCard from "../../components/InfoCard";
import Table from "../../components/Table";
import { FaEye } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import diyImage from "../../assets/image/diy.png";
import gardenImage from "../../assets/image/garden.png";
import homecareImage from "../../assets/image/Homecare.png";
import housekeping from "../../assets/image/housekeeping.svg";
import childcare from "../../assets/image/childcare.svg"
import petsImage from "../../assets/image/pets.png";
import { getUserById } from "../../apis/usermanagement.api";
import { TruncatedCell } from "./components/Columns";
import FilterDropdown from "./components/FIlterDropdown";
import { toast } from "sonner";
import useIsMobile from "../../hooks/useIsMobile";
import { renderIcons } from "../requests-management/components/requestColumns";
import { image, Image } from "@heroui/react";
import { renderIconsImage } from "../../utils/renderIcons";
import { useTranslation } from "react-i18next";

const UserDetail = () => {
  const { id, userType } = useParams();
  const activeUser = userType === "professional-users" ? "provider" : "elder";
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  // const [statusFilter, setStatusFilter] = useState([]);
  const [tempStatusFilter, setTempStatusFilter] = useState("all");
  const [appliedStatusFilter, setAppliedStatusFilter] = useState("all");
  const [userInfo, setUserInfo] = useState({});
  const [requests, setRequests] = useState({ data: [], total: 0 });
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();
  const { t } = useTranslation();

  const tabs = [
    { id: "all", label: t("UserDetails.all") },
    { id: "pending", label: t("UserDetails.pending") },
    { id: "accepted", label: t("UserDetails.assigned") },
    { id: "completed", label: t("UserDetails.completed") },
  ];

  const effectiveStatusFilter = useMemo(() => {
    if (isMobile) {
      return appliedStatusFilter !== "all" ? appliedStatusFilter : "";
    }

    return activeTab === "all" ? "" : activeTab;
  }, [isMobile, activeTab, appliedStatusFilter]);

  const fetchRequests = async (isNewUser = false) => {
    if (!id) return;

    setLoading(true);
    try {
      const params = {
        page: isNewUser ? 1 : page,
        limit: pageSize,
      };

      if (effectiveStatusFilter.length) {
        params.task_status = effectiveStatusFilter;
      }

      const res = await getUserById(params, id);

      setRequests({
        data: res?.service_requests || [],
        total: res?.total_service_request || res?.total_requests || 0,
      });
      setUserInfo(res || {});
    } catch (e) {
      console.error("error", e);
      toast.error(e?.message || "something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setActiveTab("all");
    setAppliedStatusFilter("all");
    setTempStatusFilter("all");
    setPage(1);

    fetchRequests(true);
  }, [id]);

  useEffect(() => {
    fetchRequests();
  }, [activeTab, appliedStatusFilter, page]);

  const categoryMap = {
    DIY: {
      image: diyImage,
      color: "text-[#FF6B00]",
    },
    Gardening: {
      image: gardenImage,
      color: "text-[#2FBF71]",
    },
    Homecare: {
      image: homecareImage,
      color: "text-[#6C63FF]",
    },
    Pets: {
      image: petsImage,
      color: "text-[#FF4D4F]",
    },
    Housekeeping:{
      image:housekeping
    },
    Childcare:{
      image:childcare
    }
  };

  const statusColor = {
    completed: "text-[#46BCAA]",
    pending: "text-[#F39C12]",
    assigned: "text-[#2ECC71]",
    cancelled: "text-[#E74C3C]",
  };
  useEffect(() => {
    setPage((prev) => (prev === 1 ? prev : 1));
  }, [activeTab, appliedStatusFilter]);

  const columns = useMemo(
    () => [
      {
        key: "id",
        label: t("userManagementData.serviceId"),
        width: "140px",
        render: (val) => <TruncatedCell value={val} maxWidth={120} />,
      },

      {
        key: "category_name",
        label: t("userManagementData.serviceCategory"),
        width: "200px",
        render: (value) => {
          const cat = categoryMap?.[value];
          const imageUrl = renderIconsImage(value);

          return (
            <div className="flex items-center gap-2 min-w-0">
              {cat?.image ? (
                <img
                  src={imageUrl}
                  alt={value || "category"}
                  className="w-6 h-6 shrink-0 object-cover"
                />
              ) : null}

              <span className={`truncate whitespace-nowrap text-gray-500`}>
                {value || "—"}
              </span>
            </div>
          );
        },
      },

      {
        key: "sub_category_name",
        label: t("userManagementData.serviceName"),
        width: "220px",
        render: (val) => <TruncatedCell value={val} maxWidth={200} />,
      },

      {
        key: "total_renegotiated",
        label: t("userManagementData.Valuation"),
        width: "140px",
        render: (val) => (
          <TruncatedCell
            value={val != null ? `€${val}` : null}
            maxWidth={120}
          />
        ),
      },
      ...(userType === "elder-users"
        ? [
            {
              key: "professional_name",
              label: t("userManagementData.professionalName"),
              width: "200px",
              render: (val) => <TruncatedCell value={val} maxWidth={180} />,
            },
          ]
        : [
            {
              key: "elder_name",
              label: t("userManagementData.elderName"),
              width: "200px",
              render: (val) => <TruncatedCell value={val} maxWidth={180} />,
            },
          ]),

      {
        key: "task_status",
        label: t("userManagementData.status"),
        width: "140px",
        render: (value) => (
          <span
            className={`font-medium truncate whitespace-nowrap ${
              statusColor?.[value] || "text-gray-500"
            }`}
          >
            {value || "—"}
          </span>
        ),
      },

      {
        key: "action",
        label: t("userManagementData.action"),
        width: "120px",
        render: (_val, row) => (
          <button
            type="button"
            aria-label="View service details"
            className="
            h-10 w-10
            bg-[#FF94291F]
            hover:bg-[#2C6587]
            transition-colors
            flex items-center justify-center
            rounded-xl
          "
            onClick={() => {
              // Correctly toggle route based on current view
              const targetType =
                userType === "elder-users"
                  ? "professional-users"
                  : "elder-users";
              const targetId =
                userType === "elder-users"
                  ? row?.service_provider_id
                  : row?.requested_user_id;
              // if (!targetId) {
              //    console.log("userId not found for row", row);
              //   toast.error("userId not found")
              //   return;
              // }
              navigate(`/requests/${row.id}`);
              // onClick={() => navigate(`/requests/${row.id}`)}
            }}
          >
            <FaEye className="text-[#FF9429] group-hover:text-white" />
          </button>
        ),
      },
    ],
    [navigate, categoryMap, statusColor, t, userType],
  );
  const handleApply = () => {
    setAppliedStatusFilter(tempStatusFilter);
    setPage(1);
    setOpen(false);
  };

  const handleClear = () => {
    setTempStatusFilter("all");
    setAppliedStatusFilter("all");
    setPage(1);
    setOpen(false);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setTempStatusFilter("all");
    setAppliedStatusFilter("all");
    setPage(1);
  };

  return (
    <MainLayout title={t("userManagement")}>
      <div
        className="bg-[#FFFFFF] font-medium my-4 sm:my-5  text-xs sm:text-sm p-3 sm:p-5 rounded-lg cursor-pointer"
        onClick={() => navigate(-1)}
      >
        <IoIosArrowBack className="inline mb-1 mr-2" />
        {t("userManagementData.backToAllUser")}
      </div>

      <div className=" mx-auto">
        <div className="flex flex-col xl:flex-row items-start gap-4 sm:gap-6 lg:gap-4 mb-6 lg:mb-8">
          {/* User card */}
          <div className="shrink-0 w-full xl:w-1/2">
            <UserCard profile={userInfo?.user_data || {}} userType={userType} />
          </div>

          {/* Info cards */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
            {/* Top Row */}
            <div className="h-full">
              <InfoCard
                title={t("UserDetails.toalrequests")}
                data={
                  userInfo?.total_service_request ||
                  userInfo?.total_requests ||
                  0
                }
                type="professional"
                className="h-full p-2"
              />
            </div>

            <div className="h-full">
              <InfoCard
                title={t("UserDetails.totalTransactions")}
                data={`€${userInfo?.total_transactions?.toFixed(2) ?? 0}`}
                type="transactions"
                className="h-full"
              />
            </div>

            {/* Bottom Row */}
            {activeUser === "provider" ? (
              <>
                <div className="h-full">
                  <InfoCard
                    title={t("UserDetails.ovrallRating")}
                    data={`${userInfo?.average_rating || userInfo?.overall_rating || 0}/5`}
                    type="professional"
                    className="h-full p-2"
                  />
                </div>

                <div className="h-full">
                  <InfoCard
                    title={t("UserDetails.quatesuccessrate")}
                    data={`${userInfo?.quote_success_rate ?? 0}/5`}
                    type="professional"
                    className="h-full"
                  />
                </div>
              </>
            ) : (
              /* Empty placeholder to keep same width */
              <div className="hidden sm:block" />
            )}
          </div>
        </div>
      </div>

      <Table
        title={t("UserDetails.allrequests")}
        data={requests?.data}
        isLoading={loading}
        columns={columns}
        isHeaderVisible={true}
        searchable={false}
        exportable={false}
        showDatePicker={false}
        showtabs={!isMobile}
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        filter={
          isMobile && (
            <FilterDropdown
              open={open}
              setOpen={setOpen}
              tempStatusFilter={tempStatusFilter}
              setTempStatusFilter={setTempStatusFilter}
              onApply={handleApply}
              onClear={handleClear}
            />
          )
        }
        pagination={{
          page,
          size: pageSize,
          total: requests.total,
        }}
        onPageChange={(e) => setPage(e)}
      />
    </MainLayout>
  );
};

export default UserDetail;
