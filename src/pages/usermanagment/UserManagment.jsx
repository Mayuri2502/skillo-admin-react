import React, { useEffect } from "react";
import MainLayout from "../../layouts/MainLayout";
import Table from "../../components/Table";
import { useMemo, useState } from "react";
import Button from "../../components/Button";
import Input from "../../components/Input";
import ModalView from "../../components/Model";
import { useNavigate } from "react-router-dom";
import { banUser, getUsers } from "../../apis/usermanagement.api";
import { getColumns } from "./components/Columns";
import { toast } from "sonner";
import { FiSearch } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import UserTypeFilter from "./components/UserTypeFilter";

const UserManagment = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [modelOpen, setModelOpen] = useState(false);
  const navigate = useNavigate();
  const userType = "elderly_user";
  const [users, setUsers] = useState({ data: [], total: 0 });
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [banLoading, setBanLoading] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [userTypeFilters, setUserTypeFilters] = useState({
    "customer_individual": true,
    "customer_business": false,
    "provider_individual": false,
    "provider_business": false
  });
  const { t, i18n } = useTranslation();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const activeFilters = Object.keys(userTypeFilters).filter(key => userTypeFilters[key]);
      
      const params = {
        user_type: userType,
        page,
        limit: pageSize,
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(activeTab === "banned" && { is_banned: true }),
        ...(activeFilters.length > 0 && { user_types: activeFilters }),
      };

      const response = await getUsers(params);
      setUsers(response || { data: [], total: 0 });
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error(error?.msg || error?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [userType, page, debouncedSearch, pageSize, activeTab, userTypeFilters]);

  useEffect(() => {
    setPage(1);
    setUsers({ data: [], total: 0 });
  }, [userType]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // reset page on new search
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [search]);

  const tabs = [
    { id: "all", label: t("all") },
    { id: "banned", label: t("banUsers") },
  ];

  const columns = useMemo(
    () =>
      getColumns(
        userType,
        navigate,
        () => setModelOpen(true),
        setSelectedUser,
        pageSize,
        page,
        t,
      ),
    [userType, navigate, t, i18n.language],
  );

  const handleBanToggle = async () => {
    if (!selectedUser || banLoading) return;

    setBanLoading(true);

    const payload = {
      action: selectedUser.is_banned === false ? "ban" : "unban",
    };

    try {
      let res = await banUser(selectedUser.id, payload);
      if (
        res?.status == 200 ||
        res?.status == "success" ||
        res?.data?.status === "success"
      )
        toast.success(
          selectedUser.is_banned
            ? t("userUnbannedSuccessfully")
            : t("userBannedSuccessfully"),
        );
      else
        toast.error(
          selectedUser.is_banned
            ? t("failedToUnbanUser")
            : t("failedToBanUser"),
        );

      setModelOpen(false);
      setSelectedUser(null);

      // pagination-safe refresh
      if (users.data.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      } else {
        fetchUsers();
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to update user status",
      );
    } finally {
      setBanLoading(false);
    }
  };

  return (
    <div>
      <MainLayout title={t("userManagementData.userManagement")}>
        <div className="mt-5">
          
          <div className="relative">
            <FiSearch
              className="absolute left-4 top-[42%] -translate-y-1/2 text-[#5CACE0] font-extrabold"
              size={18}
            />
            <Input
              size="lg"
              placeholder={t("userManagementData.searchUser")}
              className="mb-4 p-4 bg-white border-none rounded-xl text-black !pl-14"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <Table
          title="Customer User"
          isHeaderVisible={true}
          searchable={false}
          exportable={false}
          showDatePicker={false}
          data={users?.data}
          isLoading={loading}
          columns={columns}
          showtabs={true}
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onTabChange={(tabId) => {
            setActiveTab(tabId);
            setPage(1);
          }}
          filter={
            <UserTypeFilter
              open={filterOpen}
              setOpen={setFilterOpen}
              filters={userTypeFilters}
              setFilters={setUserTypeFilters}
              onApply={() => {
                setFilterOpen(false);
                setPage(1);
                fetchUsers();
              }}
              onClear={() => {
                setUserTypeFilters({
                  customer_individual: true,
                  customer_business: false,
                  provider_individual: false,
                  provider_business: false,
                });
                setFilterOpen(false);
                setPage(1);
                fetchUsers();
              }}
            />
          }
          pagination={{
            page,
            size: pageSize,
            total: users.total,
          }}
          onPageChange={(p) => setPage(p)}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1); // Reset to first page when page size changes
          }}
          onExport={() => alert("Export demo: implement export logic")}
          onSearch={(value) => console.log("search:", value)}
          renderActions={(row) => <div>...</div>}
        />

        <ModalView
          openModel={modelOpen}
          setOpenModel={setModelOpen}
          showClose={false}
          width="440px"
        >
          <div className="flex flex-col items-center justify-center text-center">
            <h2 className="text-[24px] font-medium text-gray-800 leading-snug">
              {selectedUser?.is_banned
                ? t("doYouWantToUnban")
                : t("doYouWantToBan")}
            </h2>

            {/* Actions */}
            <div className="mt-8 grid grid-cols-2 gap-4 w-full max-w-[360px]">
              {/* Cancel */}
              <button
                onClick={() => {
                  setModelOpen(false);
                  setSelectedUser(null);
                }}
                className="h-11 rounded-full border border-[#EC613D] text-[#EC613D] bg-white px-6 text-sm font-medium transition-colors hover:bg-gray-50"
              >
                {t("cancel")}
              </button>

              {/* Ban / Unban */}
              <button
                onClick={handleBanToggle}
                disabled={banLoading}
                className={`h-11 rounded-full px-6 text-sm font-medium transition-colors ${
                  banLoading
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : selectedUser?.is_banned
                      ? "bg-[#EC613D] text-white hover:bg-[#D6572B]" // Unban
                      : "bg-[#EC613D] text-white hover:bg-[#D6572B]" // Ban
                }`}
              >
                {banLoading
                  ? t("processing")
                  : selectedUser?.is_banned
                    ? t("unban")
                    : t("ban")}
              </button>
            </div>
          </div>
        </ModalView>
      </MainLayout>
    </div> 
  );
};

export default UserManagment;  