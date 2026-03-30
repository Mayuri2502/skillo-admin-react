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
  const { t, i18n } = useTranslation();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = {
        user_type: userType,
        page,
        limit: pageSize,
        ...(debouncedSearch && { search: debouncedSearch }),
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
  }, [userType, page, debouncedSearch, pageSize]);

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
    { id: "pending", label: t("pending") },
    { id: "assigned", label: t("assigned") },
    { id: "completed", label: t("completed") },
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
        // toast.success(
        //   selectedUser.is_banned
        //     ? "User unbanned successfully"
        //     : "User banned successfully",
        // );
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
          <div className="mt-5 relative">
            {/* Search Icon */}
            <FiSearch
              className="absolute left-4 top-[42%] -translate-y-1/2 text-[#5CACE0] font-extrabold"
              size={18}
            />

            {/* Input */}
            <Input
              size="lg"
              placeholder={t("userManagementData.searchUser")}
              className="mb-4 p-4 bg-white border-none rounded-xl text-black !pl-14"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* <Input
            size="lg"
            placeholder="Search User..."
            className="bg-[#FFFFFF]  border-none rounded-xl p-4 pl-[18px!important]"
            classNames={{
              input: "text-xs text-[#343434!important] pl-[40px!important] ",
              inputWrapper:
                "bg-[ #FFFFFF!important] shadow-[0px_25.6px_48px_4px_rgba(0,0,0,0.08)] border-none rounded-xl pl-[40px!important]",
            }}
            onChange={(e) => setSearch(e.target.value)}
          /> */}
        </div>

        {/* <div className="mt-5"> </div> */}
        <Table
          title={t("userManagementData.elderlyUser")}
          isHeaderVisible={true}
          searchable={false}
          exportable={false}
          showDatePicker={false}
          data={users?.data}
          isLoading={loading}
          columns={columns}
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
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tabs={tabs}
          filter={null}
        />

        <ModalView
          openModel={modelOpen}
          setOpenModel={setModelOpen}
          showClose={false}
          width="440px"
        >
          <div className="flex flex-col items-center justify-center text-center">
            <h2 className="text-[24px] font-medium text-[#2C6587] leading-snug">
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
                className="h-11 rounded-full border border-[#2C6587] text-[#2C6587]"
              >
                {t("cancel")}
              </button>

              {/* Ban / Unban */}
              <button
                onClick={handleBanToggle}
                disabled={banLoading}
                className={`h-11 rounded-full font-medium transition ${
                  banLoading
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : selectedUser?.is_banned
                      ? "bg-[#2C6587] text-white hover:bg-[#24546F]" // Unban
                      : "bg-red-600 text-white hover:bg-red-700" // Ban
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