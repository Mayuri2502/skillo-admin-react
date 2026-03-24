import React, { useMemo, useState, useRef } from "react";
import MainLayout from "../../layouts/MainLayout";
import Table from "../../components/Table";
import Input from "../../components/Input";
import Button from "../../components/Button";
import ModalView from "../../components/Model";
import { FaEye } from "react-icons/fa";
import { CiFilter } from "react-icons/ci";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button as HeroUIButton,
} from "@heroui/react";
import { useEffect } from "react";
import axiosInstance from "../../lib/Axios";
import IconAndTextModal from "../../components/IconAndTextModal";
import FilterDropdown from "./FilterDropdown";
import { toast } from "sonner";
import { getPayment } from "../../apis/paymentManagment.api";
import { columns } from "./components/Columns";
import { useTranslation } from "react-i18next";
import { FiSearch } from "react-icons/fi";
import { columnsProf } from "./components/Columns";

const PaymentManagement = () => {
  const [activeTab, setActiveTab] = useState("transactions");
  const [tempStatusFilter, setTempStatusFilter] = useState([]);
  const [appliedStatusFilter, setAppliedStatusFilter] = useState([]);
  const [page, setPage] = useState(1);
  const [modelOpen, setModelOpen] = useState(false);
  const [loading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState();
  const [searchVal, setSearchVal] = useState("");
  const [filter, setFilter] = useState(false);
  const [open, setOpen] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const { t } = useTranslation();
  const [isTabChanging, setIsTabChanging] = useState(false);
  const columnsWithTranslation = useMemo(() => columns(t), [t]);
  const columnstab2 = useMemo(() => columnsProf(t), [t]);

  const tabs = [
    { id: "transactions", label: t("transactionData.transactions") },
    {
      id: "professional_withdrawals",
      label: t("transactionData.professionalwithdraw"),
    },
  ];

  const handleApply = () => {
    setAppliedStatusFilter(tempStatusFilter);
    setPage(1);
    setOpen(false);
  };

  const handleClear = () => {
    setTempStatusFilter([]);
    setAppliedStatusFilter([]);
    setPage(1);
    setOpen(false);
  };

  const getPaymentDetail = async (
    pageNum = 1,
    limit = pageSize,
    tab = activeTab,
    search = searchVal,
    status = appliedStatusFilter,
  ) => {
    try {
      setIsLoading(true);
      const res = await getPayment({
        paramsSerializer: (params) => {
          return new URLSearchParams(
            Object.entries(params).flatMap(([key, value]) =>
              Array.isArray(value)
                ? value.map((v) => [key, v])
                : [[key, value]],
            ),
          ).toString();
        },
        params: {
          search: search,
          section: tab,
          status: status,
          page: pageNum,
          limit: limit,
        },
      });

      if (res?.status !== 200)
        throw new Error(res?.data?.msg || "Failed to fetch payment details");
      let respData;
      if (tab == "transactions") {
        respData = res?.data?.data.transactions || [];
      } else {
        respData = res?.data?.data.withdrawals || [];
      }

      setData(
        respData.map((item, index) => ({
          ...item,
          id: (pageNum - 1) * limit + index + 1,
        })),
      );

      setPagination({
        page: res?.data?.data?.pagination?.page || 1,
        size: res?.data?.data?.pagination?.limit || 10,
        total: res?.data?.data?.pagination?.total_records,
      });
    } catch (error) {
      toast.error(error?.message || "Failed to fetch payment");
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset filters and pagination when tab changes
  useEffect(() => {
    setPage(1);
    setTempStatusFilter([]);
    setAppliedStatusFilter([]);
    setSearchVal("");
    // Fetch data with reset filters after state updates
    getPaymentDetail(1, pageSize, activeTab, [], []);
  }, [activeTab]);

  useEffect(() => {
     if (isTabChanging) {
       setIsTabChanging(false);
       return;
     }

    getPaymentDetail(page, pageSize);
  }, [searchVal, filter, appliedStatusFilter, page, pageSize, isTabChanging]);

  return (
    <MainLayout title={t("transactionList")}>
      {/* SEARCH */}
      <div className="mt-5 relative">
        {/* Search Icon */}
        <FiSearch
          className="absolute left-4 top-[42%] -translate-y-1/2 text-[#5CACE0] font-extrabold"
          size={18}
        />

        {/* Input */}
        <Input
          size="lg"
          placeholder={t("transactionData.searchtransaction")}
          className="mb-4 p-4 bg-white border-none rounded-xl text-black !pl-14"
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <Table
        title={t("transactionList")}
        data={data}
        columns={
          activeTab == "transactions" ? columnsWithTranslation : columnstab2
        }
        isHeaderVisible
        isLoading={loading}
        searchable={false}
        exportable={false}
        showDatePicker={false}
        showtabs
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        filter={
          <FilterDropdown
            activeTab={activeTab}
            open={open}
            setOpen={setOpen}
            tempStatusFilter={tempStatusFilter}
            setTempStatusFilter={setTempStatusFilter}
            onApply={handleApply}
            onClear={handleClear}
            t={t}
          />
        }
        pagination={pagination}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
      />

      {/* MODAL */}
      <ModalView
        openModel={modelOpen}
        setOpenModel={setModelOpen}
        width="500px"
      >
        <p className="text-lg font-medium mb-4">{t("paymentDetails")}</p>
        <Button btnStyle="rounded-xl px-10">{t("close")}</Button>
      </ModalView>
    </MainLayout>
  );
};

export default PaymentManagement;
