import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import Table from "../../components/Table";
import Button from "../../components/Button";
import Input from "../../components/Input";
import ModalView from "../../components/Model";
import userImg from "../../assets/image/Profile.png";
import { toast } from "sonner";
import { getRequestList } from "../../apis/requestManagement.api";
import { getRequestColumns } from "./components/requestColumns";
import StatusFilterDropdown from "./components/StatusFilterDropdown";
import useIsMobile from "../../hooks/useIsMobile";
import { FiSearch } from "react-icons/fi";
import { CiFilter } from "react-icons/ci";
import { useTranslation } from "react-i18next";

const BusinessRequests = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modelOpen, setModelOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [list, setList] = useState({ results: [], total: 0 });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const isMobile = useIsMobile();
  const { t } = useTranslation();

  const effectiveStatusFilter = useMemo(() => {
    if (isMobile) return statusFilter !== "all" ? statusFilter : "" || "";
    return activeTab === "all" ? "" : activeTab;
  }, [isMobile, activeTab, statusFilter]);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: pageSize,
        request_type: "business", // Filter for business requests
      };
      if (effectiveStatusFilter) {
        params.status = effectiveStatusFilter;
      }
      if (debouncedSearch) {
        params.search = debouncedSearch;
      }
      const response = await getRequestList(params);

      // Handle different response structures
      if (response && response.results) {
        setList({ results: response.results, total: response.total || 0 });
      } else if (response && response.data && response.data.results) {
        setList({
          results: response.data.results,
          total: response.data.total || 0,
        });
      } else {
        console.warn("Unexpected response structure:", response);
        setList({ results: [], total: 0 });
      }
    } catch (error) {
      console.error("Error fetching business requests:", error);
      toast.error(error?.message || error?.msg || "Failed to fetch business requests");
      setList({ results: [], total: 0 });
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, effectiveStatusFilter, pageSize]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [activeTab, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // reset page on new search
    }, 500); //  debounce

    return () => clearTimeout(timer);
  }, [search]);

  const tabs = [
    { id: "all", label: "All" },
    { id: "pending", label: "Pending" },
    { id: "assigned", label: "Assigned" },
    { id: "completed", label: "Completed" },
    { id: "filter", label: "", isFilter: true },
  ];

  const columns = useMemo(
    () =>
      getRequestColumns({
        navigate,
        t,
      }),
    [navigate, t],
  );

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setStatusFilter("all");
    setPage(1);
  };
  const handleMobileApply = () => {
    setPage(1);
  };

  return (
    <MainLayout title={t("requestsManagement")}>
      <div className="mt-5 relative">
        {/* Search Icon */}
        <FiSearch
          className="absolute left-4 top-[42%] -translate-y-1/2 text-[#5CACE0] font-extrabold"
          size={18}
        />

        {/* Input */}
        <Input
          size="lg"
          placeholder="search request"
          className="mb-4 p-4 bg-white border-none rounded-xl text-black !pl-14"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Table
        title="All Requests"
        data={list.results}
        columns={columns}
        isLoading={loading}
        pagination={{
          page,
          size: pageSize,
          total: list.total,
        }}
        onPageChange={(e) => setPage(e)}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
        searchable={false}
        exportable={false}
        showDatePicker={false}
        isHeaderVisible
        showtabs={!isMobile}
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        filter={
          isMobile && (
            <StatusFilterDropdown
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              setPage={setPage}
              onApply={handleMobileApply}
            />
          )
        }
      />

      <ModalView
        openModel={modelOpen}
        setOpenModel={setModelOpen}
        width="500px"
        minHeight="220px"
        showClose
      >
        <p className="text-lg font-medium mb-4">Request Details</p>
        <Button btnStyle="rounded-xl px-10">Close</Button>
      </ModalView>
    </MainLayout>
  );
};

export default BusinessRequests;
