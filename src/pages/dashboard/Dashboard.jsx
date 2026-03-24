import React from "react";
import MainLayout from "../../layouts/MainLayout";
import OverviewTabs from "../../components/OverviewTabs";
import { useState, useMemo } from "react";
import InfoCard from "../../components/InfoCard";
import Table from "../../components/Table";
import Button from "../../components/Button";
import UserCard from "../../components/UserCard";
import TransactionChart from "./TransactionChart";
import SalesChart from "./SalesChart";
import { Image } from "@heroui/react";
import { FaEye } from "react-icons/fa";
import { RiUserForbidFill } from "react-icons/ri";
import userImg from "../../assets/image/Profile.png";
import IconAndTextModal from "../../components/IconAndTextModal";
import axiosInstance from "../../lib/Axios";
import { useEffect } from "react";
import { getadminDetail } from "../../apis/dashboard.api";
import { getUsers } from "../../apis/usermanagement.api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { TruncatedCell } from "../usermanagment/components/Columns";
import { useTranslation } from "react-i18next";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("daily");
  const [selectedDate, setSelectedDate] = useState(null);
  const [elderPage, setElderPage] = useState(1);
  const [professionalPage, setProfessionalPage] = useState(1);
  const [elderPageSize, setElderPageSize] = useState(5);
  const [professionalPageSize, setProfessionalPageSize] = useState(5);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [elderUsers, setElderUsers] = useState([]);
  const [professionalUsers, setProfessionalUsers] = useState([]);
  const [elderTotal, setElderTotal] = useState(0);
  const [professionalTotal, setProfessionalTotal] = useState(0);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const elderUsersColumns = useMemo(
    () => [
      {
        key: "id",
        label: t("number"),
        width: "15px",
        render: (_val, row, index) => (
          <span className="text-[#1F2128] font-light text-sm">{index + 1}</span>
        ),
      },
      {
        key: "first_name",
        label: t("firstName"),
        width: "100px",
        render: (value, row) => (
          <div className="flex items-center gap-3">
            {row.profile_photo_url ? (
              <div className="flex items-center gap-2">
                <Image
                  src={`${row.profile_photo_url}`}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <TruncatedCell value={row?.first_name || "-"} maxWidth={60} />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold text-gray-700">
                  {value?.charAt(0)?.toUpperCase()}
                </div>
                <TruncatedCell value={value || "-"} maxWidth={60} />
              </div>
            )}
          </div>
        ),
      },
      {
        key: "last_name",
        label: t("lastName"),
        render: (v, row) => (
          <TruncatedCell value={row?.last_name || "-"} maxWidth={60} />
        ),
      },
      {
        key: "email",
        label: t("email"),
        width: "100px",
        render: (v, row) => (
          <TruncatedCell value={row?.email || "-"} maxWidth={100} />
        ),
      },
      {
        key: "action",
        label: t("actions"),
        render: (_val, row) => (
          <div className="flex gap-2 items-center">
            <button
              size="sm"
              className="group h-10 w-10 bg-[#FF94291F] hover:bg-[#2C6587] transition-colors flex items-center justify-center rounded-xl"
              onClick={() => navigate(`/user-management/elder-users/${row.id}`)}
            >
              <FaEye className="text-[#FF9429] group-hover:text-white" />
            </button>
          </div>
        ),
      },
    ],
    [t, navigate],
  );

  const professionalUsersColumns = useMemo(
    () => [
      {
        key: "id",
        label: t("number"),
        width: "15px",
        render: (_val, row, index) => (
          <span className="text-[#1F2128] font-light text-sm">{index + 1}</span>
        ),
      },
      {
        key: "first_name",
        label: t("firstName"),
        width: "100px",
        render: (value, row) => (
          <div className="flex items-center gap-3">
            {row.profile_photo_url ? (
              <div className="flex items-center gap-2">
                <Image
                  src={`${row.profile_photo_url}`}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <TruncatedCell value={row?.first_name || "-"} maxWidth={60} />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold text-gray-700">
                  {value?.charAt(0)?.toUpperCase()}
                </div>
                <TruncatedCell value={row?.first_name || "-"} maxWidth={60} />
              </div>
            )}
          </div>
        ),
      },
      {
        key: "last_name",
        label: t("lastName"),
        render: (v, row) => (
          <TruncatedCell value={row?.last_name || "-"} maxWidth={60} />
        ),
      },
      {
        key: "email",
        label: t("email"),
        render: (v, row) => (
          <TruncatedCell value={row?.email || "-"} maxWidth={100} />
        ),
      },
      {
        key: "action",
        label: t("actions"),
        render: (_val, row) => (
          <div className="flex gap-2 items-center">
            <button
              size="sm"
              className="group h-10 w-10 bg-[#FF94291F] hover:bg-[#2C6587] transition-colors flex items-center justify-center rounded-xl"
              onClick={() =>
                navigate(`/user-management/professional-users/${row.id}`)
              }
            >
              <FaEye className="text-[#FF9429] group-hover:text-white" />
            </button>
          </div>
        ),
      },
    ],
    [t, navigate],
  );

  const fetchElderUsers = async (pageNum, limit = elderPageSize) => {
    setLoading(true);
    try {
      const params = {
        ...(activeTab !== "all-time" && { range_type: activeTab }),
        professional_page: 1,
        professional_limit: professionalPageSize,
        elderly_page: pageNum,
        elderly_limit: limit,
      };
      const res = await getadminDetail(params);
      if (res.status == true || 200) {
        setData(res.data);
        setElderUsers(res?.data?.elderly_users || []);
        setElderTotal(res?.data?.total_elderly || 0);
        setProfessionalUsers(res?.data?.professional_users || []);
        setProfessionalTotal(res?.data?.total_professionals || 0);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const fetchProfessionalUsers = async (
    pageNum,
    limit = professionalPageSize,
  ) => {
    setLoading(true);
    try {
      const params = {
        ...(activeTab !== "all-time" && { range_type: activeTab }),
        professional_page: pageNum,
        professional_limit: limit,
        elderly_page: 1,
        elderly_limit: elderPageSize,
      };
      const res = await getadminDetail(params);
      if (res.status == true || 200) {
        setData(res.data);
        setElderUsers(res?.data?.elderly_users || []);
        setElderTotal(res?.data?.total_elderly || 0);
        setProfessionalUsers(res?.data?.professional_users || []);
        setProfessionalTotal(res?.data?.total_professionals || 0);
      }
    } catch (error) {
      toast.error(error.message || error.msg || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchElderUsers(elderPage);
  }, [activeTab, elderPage, elderPageSize]);

  useEffect(() => {
    fetchProfessionalUsers(professionalPage);
  }, [activeTab, professionalPage, professionalPageSize]);

  return (
    <MainLayout title={t("DashboardData.dashboard")}>
      <div className="mt-4 lg:mt-5 mb-4 lg:mb-5">
        <OverviewTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <InfoCard
          title={t("DashboardData.totalUsers")}
          data={data?.total_users || 0}
          type="users"
        />
        <InfoCard
          title={t("DashboardData.totalProfessional")}
          data={data?.total_professionals || 0}
          type="professional"
        />
        <InfoCard
          title={t("DashboardData.totalElder")}
          data={data?.total_elderly || 0}
          type="elder"
        />
        <InfoCard
          title={t("DashboardData.totalTransactions")}
          data={data?.total_transaction_amount?.toFixed(2) || 0}
          type="transactions"
          
        />
      </div>

      <div className="mt-6 lg:mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        <div className="md:col-span-2">
          <SalesChart
            title={t("DashboardData.sales")}
            yLabel="Revenue"
            currencySymbol="€"
            chartData={data?.sales_performance}
            isLoading={loading}
            activeTab={activeTab}
          />
        </div>
        <TransactionChart
          title={t("DashboardData.transaction")}
          yLabel="Transactions"
          currencySymbol="€"
          trasctionData={data?.transaction_count}
          isLoading={loading}
          activeTab={activeTab}
        />
      </div>
      <div className="mt-6 lg:mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <Table
          title={t("DashboardData.elderUsers")}
          isHeaderVisible
          searchable={false}
          exportable={false}
          isLoading={loading}
          showDatePicker={false}
          data={elderUsers}
          columns={elderUsersColumns}
          pagination={{
            page: elderPage,
            size: elderPageSize,
            total: elderTotal,
          }}
          onPageChange={(p) => {
            setElderPage(p);
            fetchElderUsers(p);
          }}
          onPageSizeChange={(size) => {
            setElderPageSize(size);
            setElderPage(1);
            fetchElderUsers(1, size);
          }}
          textStyle="text-black text-xl font-semibold"
        />
        <Table
          title={t("DashboardData.professionalUsers")}
          isLoading={loading}
          isHeaderVisible
          searchable={false}
          exportable={false}
          showDatePicker={false}
          data={professionalUsers}
          columns={professionalUsersColumns}
          pagination={{
            page: professionalPage,
            size: professionalPageSize,
            total: professionalTotal,
          }}
          onPageChange={(p) => {
            setProfessionalPage(p);
            fetchProfessionalUsers(p);
          }}
          onPageSizeChange={(size) => {
            setProfessionalPageSize(size);
            setProfessionalPage(1);
            fetchProfessionalUsers(1, size);
          }}
          textStyle="text-black text-xl font-semibold"
        />
      </div>
    </MainLayout>
  );
};

export default Dashboard;
