// import React from "react";
// import MainLayout from "../../layouts/MainLayout";
// import OverviewTabs from "../../components/OverviewTabs";
// import { useState, useMemo } from "react";
// import InfoCard from "../../components/InfoCard";
// import Table from "../../components/Table";
// import Button from "../../components/Button";
// import UserCard from "../../components/UserCard";
// import TransactionChart from "./TransactionChart";
// import SalesChart from "./SalesChart";
// import { Image } from "@heroui/react";
// import { FaEye } from "react-icons/fa";
// import { RiUserForbidFill } from "react-icons/ri";
// import userImg from "../../assets/image/Profile.png";
// import IconAndTextModal from "../../components/IconAndTextModal";
// import axiosInstance from "../../lib/Axios";
// import { useEffect } from "react";
// import { getadminDetail } from "../../apis/dashboard.api";
// import { getUsers } from "../../apis/usermanagement.api";
// import { useNavigate } from "react-router-dom";
// import { toast } from "sonner";
// import { TruncatedCell } from "../usermanagment/components/Columns";
// import { useTranslation } from "react-i18next";

// const Dashboard = () => {
//   const [activeTab, setActiveTab] = useState("daily");
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [elderPage, setElderPage] = useState(1);
//   const [professionalPage, setProfessionalPage] = useState(1);
//   const [elderPageSize, setElderPageSize] = useState(5);
//   const [professionalPageSize, setProfessionalPageSize] = useState(5);
//   const [loading, setLoading] = useState(false);
//   const [data, setData] = useState({});
//   const [elderUsers, setElderUsers] = useState([]);
//   const [professionalUsers, setProfessionalUsers] = useState([]);
//   const [elderTotal, setElderTotal] = useState(0);
//   const [professionalTotal, setProfessionalTotal] = useState(0);
//   const { t, i18n } = useTranslation();
//   const navigate = useNavigate();

//   const elderUsersColumns = useMemo(
//     () => [
//       {
//         key: "id",
//         label: t("number"),
//         width: "15px",
//         render: (_val, row, index) => (
//           <span className="text-[#1F2128] font-light text-sm">{index + 1}</span>
//         ),
//       },
//       {
//         key: "first_name",
//         label: t("firstName"),
//         width: "100px",
//         render: (value, row) => (
//           <div className="flex items-center gap-3">
//             {row.profile_photo_url ? (
//               <div className="flex items-center gap-2">
//                 <Image
//                   src={`${row.profile_photo_url}`}
//                   alt="Avatar"
//                   className="w-8 h-8 rounded-full object-cover"
//                 />
//                 <TruncatedCell value={row?.first_name || "-"} maxWidth={60} />
//               </div>
//             ) : (
//               <div className="flex items-center gap-2">
//                 <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold text-gray-700">
//                   {value?.charAt(0)?.toUpperCase()}
//                 </div>
//                 <TruncatedCell value={value || "-"} maxWidth={60} />
//               </div>
//             )}
//           </div>
//         ),
//       },
//       {
//         key: "last_name",
//         label: t("lastName"),
//         render: (v, row) => (
//           <TruncatedCell value={row?.last_name || "-"} maxWidth={60} />
//         ),
//       },
//       {
//         key: "email",
//         label: t("email"),
//         width: "100px",
//         render: (v, row) => (
//           <TruncatedCell value={row?.email || "-"} maxWidth={100} />
//         ),
//       },
//       {
//         key: "action",
//         label: t("actions"),
//         render: (_val, row) => (
//           <div className="flex gap-2 items-center">
//             <button
//               size="sm"
//               className="group h-10 w-10 bg-[#FF94291F] hover:bg-[#2C6587] transition-colors flex items-center justify-center rounded-xl"
//               onClick={() => navigate(`/user-management/elder-users/${row.id}`)}
//             >
//               <FaEye className="text-[#FF9429] group-hover:text-white" />
//             </button>
//           </div>
//         ),
//       },
//     ],
//     [t, navigate],
//   );

//   const professionalUsersColumns = useMemo(
//     () => [
//       {
//         key: "id",
//         label: t("number"),
//         width: "15px",
//         render: (_val, row, index) => (
//           <span className="text-[#1F2128] font-light text-sm">{index + 1}</span>
//         ),
//       },
//       {
//         key: "first_name",
//         label: t("firstName"),
//         width: "100px",
//         render: (value, row) => (
//           <div className="flex items-center gap-3">
//             {row.profile_photo_url ? (
//               <div className="flex items-center gap-2">
//                 <Image
//                   src={`${row.profile_photo_url}`}
//                   alt="Avatar"
//                   className="w-8 h-8 rounded-full object-cover"
//                 />
//                 <TruncatedCell value={row?.first_name || "-"} maxWidth={60} />
//               </div>
//             ) : (
//               <div className="flex items-center gap-2">
//                 <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold text-gray-700">
//                   {value?.charAt(0)?.toUpperCase()}
//                 </div>
//                 <TruncatedCell value={row?.first_name || "-"} maxWidth={60} />
//               </div>
//             )}
//           </div>
//         ),
//       },
//       {
//         key: "last_name",
//         label: t("lastName"),
//         render: (v, row) => (
//           <TruncatedCell value={row?.last_name || "-"} maxWidth={60} />
//         ),
//       },
//       {
//         key: "email",
//         label: t("email"),
//         render: (v, row) => (
//           <TruncatedCell value={row?.email || "-"} maxWidth={100} />
//         ),
//       },
//       {
//         key: "action",
//         label: t("actions"),
//         render: (_val, row) => (
//           <div className="flex gap-2 items-center">
//             <button
//               size="sm"
//               className="group h-10 w-10 bg-[#FF94291F] hover:bg-[#2C6587] transition-colors flex items-center justify-center rounded-xl"
//               onClick={() =>
//                 navigate(`/user-management/professional-users/${row.id}`)
//               }
//             >
//               <FaEye className="text-[#FF9429] group-hover:text-white" />
//             </button>
//           </div>
//         ),
//       },
//     ],
//     [t, navigate],
//   );

//   const fetchElderUsers = async (pageNum, limit = elderPageSize) => {
//     setLoading(true);
//     try {
//       const params = {
//         ...(activeTab !== "all-time" && { range_type: activeTab }),
//         professional_page: 1,
//         professional_limit: professionalPageSize,
//         elderly_page: pageNum,
//         elderly_limit: limit,
//       };
//       const res = await getadminDetail(params);
//       if (res.status == true || 200) {
//         setData(res.data);
//         setElderUsers(res?.data?.elderly_users || []);
//         setElderTotal(res?.data?.total_elderly || 0);
//         setProfessionalUsers(res?.data?.professional_users || []);
//         setProfessionalTotal(res?.data?.total_professionals || 0);
//       }
//     } catch (error) {
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchProfessionalUsers = async (
//     pageNum,
//     limit = professionalPageSize,
//   ) => {
//     setLoading(true);
//     try {
//       const params = {
//         ...(activeTab !== "all-time" && { range_type: activeTab }),
//         professional_page: pageNum,
//         professional_limit: limit,
//         elderly_page: 1,
//         elderly_limit: elderPageSize,
//       };
//       const res = await getadminDetail(params);
//       if (res.status == true || 200) {
//         setData(res.data);
//         setElderUsers(res?.data?.elderly_users || []);
//         setElderTotal(res?.data?.total_elderly || 0);
//         setProfessionalUsers(res?.data?.professional_users || []);
//         setProfessionalTotal(res?.data?.total_professionals || 0);
//       }
//     } catch (error) {
//       toast.error(error.message || error.msg || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchElderUsers(elderPage);
//   }, [activeTab, elderPage, elderPageSize]);

//   useEffect(() => {
//     fetchProfessionalUsers(professionalPage);
//   }, [activeTab, professionalPage, professionalPageSize]);

//   return (
//     <MainLayout title={t("DashboardData.dashboard")}>
//       <div className="mt-4 lg:mt-5 mb-4 lg:mb-5">
//         <OverviewTabs
//           activeTab={activeTab}
//           setActiveTab={setActiveTab}
//           selectedDate={selectedDate}
//           setSelectedDate={setSelectedDate}
//         />
//       </div>

//       {/* Revenue Section */}
//       <div className="mt-6 lg:mt-8">
//         <h2 className="text-black text-xl font-semibold mb-4 lg:mb-6">Revenue</h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
//           <InfoCard
//             title="Active Subscriptions"
//             data="600"
//             type="activeSubscriptions"
//           />
//           <InfoCard
//             title="Total Revenue"
//             data="P3000"
//             type="totalRevenue"
//           />
//           <InfoCard
//             title="Total Commission"
//             data="P1500"
//             type="totalCommission"
//           />
//         </div>
//       </div> 

//       {/* User Section */}
//       <div className="mt-6 lg:mt-8">
//         <h2 className="text-black text-xl font-semibold mb-4 lg:mb-6">User</h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
//           <InfoCard
//             title="Total Users"
//             data={data?.total_users || 0}
//             type="users"
//           />
//           <InfoCard
//             title="Total Professionals"
//             data={data?.total_professionals || 0}
//             type="professional"
//           />
//           <InfoCard
//             title="Total Professionals (Plus)"
//             data="20"
//             type="professional"
//           />
//           <InfoCard
//             title="Total Customer (Individual)"
//             data="120"
//             type="users"
//           />
//           <InfoCard
//             title="Total Customer (Business)"
//             data="120"
//             type="users"
//           />
//         </div>
//       </div>

//       {/* Jobs Section */}
//       <div className="mt-6 lg:mt-8">
//         <h2 className="text-black text-xl font-semibold mb-4 lg:mb-6">Jobs</h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
//           <InfoCard
//             title="Total Jobs"
//             data="260"
//             type="totalJobs"
//           />
//           <InfoCard
//             title="Completed Jobs"
//             data="240"
//             type="completedJobs"
//           />
//           <InfoCard
//             title="In progress Jobs"
//             data="20"
//             type="inProgressJobs"
//           />
//           <InfoCard
//             title="Cancel Job"
//             data="5"
//             type="cancelJobs"
//           />
//         </div>
//       </div>

//       <div className="mt-6 lg:mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
//         <div className="md:col-span-2">
//           <SalesChart
//             title={t("DashboardData.sales")}
//             yLabel="Revenue"
//             currencySymbol="€"
//             chartData={data?.sales_performance}
//             isLoading={loading}
//             activeTab={activeTab}
//           />
//         </div>
//         <TransactionChart
//           title={t("DashboardData.transaction")}
//           yLabel="Transactions"
//           currencySymbol="€"
//           trasctionData={data?.transaction_count}
//           isLoading={loading}
//           activeTab={activeTab}
//         />
//       </div>
//       <div className="mt-6 lg:mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
//         <Table
//           title={t("DashboardData.elderUsers")}
//           isHeaderVisible
//           searchable={false}
//           exportable={false}
//           isLoading={loading}
//           showDatePicker={false}
//           data={elderUsers}
//           columns={elderUsersColumns}
//           pagination={{
//             page: elderPage,
//             size: elderPageSize,
//             total: elderTotal,
//           }}
//           onPageChange={(p) => {
//             setElderPage(p);
//             fetchElderUsers(p);
//           }}
//           onPageSizeChange={(size) => {
//             setElderPageSize(size);
//             setElderPage(1);
//             fetchElderUsers(1, size);
//           }}
//           textStyle="text-black text-xl font-semibold"
//         />
//         <Table
//           title={t("DashboardData.professionalUsers")}
//           isLoading={loading}
//           isHeaderVisible
//           searchable={false}
//           exportable={false}
//           showDatePicker={false}
//           data={professionalUsers}
//           columns={professionalUsersColumns}
//           pagination={{
//             page: professionalPage,
//             size: professionalPageSize,
//             total: professionalTotal,
//           }}
//           onPageChange={(p) => {
//             setProfessionalPage(p);
//             fetchProfessionalUsers(p);
//           }}
//           onPageSizeChange={(size) => {
//             setProfessionalPageSize(size);
//             setProfessionalPage(1);
//             fetchProfessionalUsers(1, size);
//           }}
//           textStyle="text-black text-xl font-semibold"
//         />
//       </div>
//     </MainLayout>
//   );
// };

// export default Dashboard;




import React, { useState, useMemo, useEffect } from "react";
import MainLayout from "../../layouts/MainLayout";
import OverviewTabs from "../../components/OverviewTabs";
import InfoCard from "../../components/InfoCard";
import Table from "../../components/Table";
import TransactionChart from "./TransactionChart";
import SalesChart from "./SalesChart";
import DashboardPieChart from "./DashboardPieChart";

import { Image } from "@heroui/react";
import { FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

import { TruncatedCell } from "../usermanagment/components/Columns";
import { getadminDetail } from "../../apis/dashboard.api";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("weekly");
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

  const { t } = useTranslation();
  const navigate = useNavigate();

  // ================= USERS TABLE =================
  const elderUsersColumns = useMemo(
    () => [
      {
        key: "id",
        label: t("number"),
        render: (_val, row, index) => index + 1,
      },
      {
        key: "first_name",
        label: t("firstName"),
        render: (value, row) => (
          <div className="flex items-center gap-2">
            {row.profile_photo_url ? (
              <Image
                src={row.profile_photo_url}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                {value?.charAt(0)?.toUpperCase()}
              </div>
            )}
            <TruncatedCell value={value || "-"} maxWidth={60} />
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
          <button
            className="h-10 w-10 bg-[#FF94291F] hover:bg-[#2C6587] rounded-xl flex items-center justify-center"
            onClick={() =>
              navigate(`/user-management/elder-users/${row.id}`)
            }
          >
            <FaEye className="text-[#FF9429] hover:text-white" />
          </button>
        ),
      },
    ],
    [t, navigate]
  );

  const professionalUsersColumns = useMemo(
    () => [
      {
        key: "id",
        label: t("number"),
        render: (_val, row, index) => index + 1,
      },
      {
        key: "first_name",
        label: t("firstName"),
        render: (value, row) => (
          <div className="flex items-center gap-2">
            {row.profile_photo_url ? (
              <Image
                src={row.profile_photo_url}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                {value?.charAt(0)?.toUpperCase()}
              </div>
            )}
            <TruncatedCell value={value || "-"} maxWidth={60} />
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
          <button
            className="h-10 w-10 bg-[#FF94291F] hover:bg-[#2C6587] rounded-xl flex items-center justify-center"
            onClick={() =>
              navigate(`/user-management/professional-users/${row.id}`)
            }
          >
            <FaEye className="text-[#FF9429] hover:text-white" />
          </button>
        ),
      },
    ],
    [t, navigate]
  );

  // ================= API =================
  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {
        ...(activeTab !== "all-time" && { range_type: activeTab }),
        professional_page: professionalPage,
        professional_limit: professionalPageSize,
        elderly_page: elderPage,
        elderly_limit: elderPageSize,
      };

      const res = await getadminDetail(params);

      if (res?.data) {
        setData(res.data);
        setElderUsers(res.data.elderly_users || []);
        setProfessionalUsers(res.data.professional_users || []);
        setElderTotal(res.data.total_elderly || 0);
        setProfessionalTotal(res.data.total_professionals || 0);
      }
    } catch (err) {
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab, elderPage, professionalPage]);

  // ================= UI =================
  return (
    <MainLayout title={t("DashboardData.dashboard")}>
      {/* Tabs */}
      <div className="mt-4 mb-4">
        <OverviewTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      </div>

      {/* Revenue */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Revenue</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <InfoCard title="Active Subscriptions" data="600" type="activeSubscriptions" />
          <InfoCard title="Total Revenue" data="P3000" type="totalRevenue" />
          <InfoCard title="Total Commission" data="P1500" type="totalCommission" />
        </div>
      </div>

      {/* ✅ PIE CHART SECTION */}
      <div className="mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <h2 className="text-black text-xl font-semibold mb-4 lg:mb-6">User</h2>
            <DashboardPieChart
              total={data?.total_users || 240}
              data={[
                {
                  name: "Total Professionals",
                  value: data?.total_professionals || 60,
                  color: "#EC613D",
                },
                {
                  name: "Total Professionals (Plus)",
                  value: data?.total_professionals_plus || 20,
                  color: "#20C997",
                },
                {
                  name: "Total Customer (Individual)",
                  value: data?.total_customer_individual || 30,
                  color: "#F4A261",
                },
                {
                  name: "Total Customer (Business)",
                  value: data?.total_customer_business || 40,
                  color: "#E0E0E0",
                },
              ]}
            />
          </div>

          <div>
            <h2 className="text-black text-xl font-semibold mb-4 lg:mb-6">Jobs</h2>
            <DashboardPieChart
              total={data?.total_jobs || 240}
              data={[
                {
                  name: "Completed Job",
                  value: data?.completed_jobs || 60,
                  color: "#6C5CE7",
                },
                {
                  name: "In progress Jobs",
                  value: data?.inprogress_jobs || 30,
                  color: "#4A90E2",
                },
                {
                  name: "Cancel Job",
                  value: data?.cancel_jobs || 40,
                  color: "#2F3640",
                },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <SalesChart
            title="Sales Performance"
            chartData={data?.sales_performance}
            isLoading={loading}
            activeTab={activeTab}
          />
        </div>

        <TransactionChart
          title="Transaction Count"
          trasctionData={data?.transaction_count}
          isLoading={loading}
          activeTab={activeTab}
        />
      </div>

      {/* Tables */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Table
          title="Customer Users (Individual)"
          data={elderUsers}
          columns={elderUsersColumns}
          isLoading={loading}
          pagination={{
            page: elderPage,
            size: elderPageSize,
            total: elderTotal,
          }}
          onPageChange={setElderPage}
        />

        <Table
          title="Customer Users (Business)"
          data={professionalUsers}
          columns={professionalUsersColumns}
          isLoading={loading}
          pagination={{
            page: professionalPage,
            size: professionalPageSize,
            total: professionalTotal,
          }}
          onPageChange={setProfessionalPage}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Table
          title="Professional Users"
          data={elderUsers}
          columns={elderUsersColumns}
          isLoading={loading}
          pagination={{
            page: elderPage,
            size: elderPageSize,
            total: elderTotal,
          }}
          onPageChange={setElderPage}
        />

        <Table
          title="Professional Users (Plus)"
          data={professionalUsers}
          columns={professionalUsersColumns}
          isLoading={loading}
          pagination={{
            page: professionalPage,
            size: professionalPageSize,
            total: professionalTotal,
          }}
          onPageChange={setProfessionalPage}
        />
      </div>
    </MainLayout>
  );
};

export default Dashboard;