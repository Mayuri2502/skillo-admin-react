import React, { useCallback, useEffect, useMemo, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import Table from "../../components/Table";
import Input from "../../components/Input";
import { Image, pagination } from "@heroui/react";
import userImg from "../../assets/image/Profile.png";
import diyImg from "../../assets/image/diy.png";
import { MdDateRange, MdAccessTime } from "react-icons/md";
import { BsPatchCheckFill } from "react-icons/bs";
import { FaPhoneAlt } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { getRequestDetail } from "../../apis/requestManagement.api";
import { toast } from "sonner";
import { renderIcons, STATUS_COLOR_MAP } from "./components/requestColumns";
import { formateDate } from "../../utils/DateAndTimeConversion";
import { formatAmount } from "../../utils/helper";
import { FiSearch } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { TruncatedCell } from "../usermanagment/components/Columns";

const QUOTE_STATUS_MAP = {
  send: "Pending",
  accepted: "Accepted",
  rejected: "Rejected",
};

const RequestDetails = () => {
  const { id } = useParams();
  const [request, setRequest] = useState({});
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const pageSize = 10;
  const fetchRequest = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getRequestDetail(id);
      setRequest(response?.data);
    } catch (error) {
      toast.error(error.message || error.msg || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;
    fetchRequest();
  }, [id, fetchRequest]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const serviceDetails = useMemo(() => {
    const sd = request?.service_details;

    if (!sd) {
      return {
        serviceId: "-",
        category: null,
        serviceName: "-",
        elderName: "-",
        valuation: "-",
        professional: "-",
        status: "-",
        address: "-",
        paymentStatus: "N/A",
        date: "-",
        time: "-",
      };
    }

    return {
      serviceId: sd.id,
      category: sd.category.name,
      serviceName: sd?.subcategory.name,
      elderName: sd.elder_name,
      valuation: `€${formatAmount(sd.validation_amount)}`,
      professional: request?.assigned_professional?.name ?? "N/A",
      status: sd.service_status,
      address: sd.address,
      paymentStatus: sd.payment_status ?? "N/A",
      image: sd.subcategory.icon,
      date: sd.chosen_datetime
        ? new Date(sd.chosen_datetime).toDateString()
        : "",
      time: sd.chosen_datetime
        ? new Date(sd.chosen_datetime).toLocaleTimeString()
        : "",
    };
  }, [request]);

  const professional = useMemo(() => {
    const p = request?.assigned_professional;
    console.log("P", request);
    if (!p) return null;

    return {
      name: p.name ?? "N/A",
      phone: p.phone ?? "N/A",
      rating: p.rating,
      isCertified: Boolean(p.is_certified),
      image: p.image ?? "../../assets/image/Profile.png",
    };
  }, [request]);

  const statusColor = {
    Accepted: "text-[#22C55E]",
    Rejected: "text-[#EF4444]",
    Pending: "text-[#F59E0B]",
  };

  const allQuotes = useMemo(() => {
    if (!Array.isArray(request?.quotes?.results)) return [];
    return request.quotes.results.map((q) => ({
      id: q.id,
      name: q.created_by_name || "",
      amount: ` €${formatAmount(q.provider_quote_amount)}`,
      // status: STATUS_COLOR_MAP[q.status] ?? "Pending",
      status: q.status,
      createdAt: q.created_at,
      description: q.description,
    }));
  }, [request]);

  const filteredQuotes = useMemo(() => {
    if (!search.trim()) return allQuotes;

    const keyword = search.toLowerCase();

    return allQuotes.filter(
      (q) =>
        q.name.toLowerCase().includes(keyword) ||
        q.amount.toLowerCase().includes(keyword) ||
        q.status.toLowerCase().includes(keyword),
    );
  }, [allQuotes, search]);

  const paginatedQuotes = useMemo(() => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return filteredQuotes.slice(start, end);
  }, [filteredQuotes, page, pageSize]);

  function convert24To12(timeString) {
    const [hours, minutes, seconds] = timeString.split(":");

    let hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";

    hour = hour % 12;
    hour = hour === 0 ? 12 : hour;

    return `${hour.toString().padStart(2, "0")}:${minutes} ${ampm}`;
  }

  const columns = [
    {
      key: "name",
      label: t("RequestManagementData.professionalName"),
      render: (v, row) => <TruncatedCell title={v} value={v} maxWidth={70} />,
    },
    { key: "amount", label: t("RequestManagementData.quoteAmount") },
    {
      key: "status",
      label: t("RequestManagementData.status"),

      render: (value) => (
        <span className={`font-medium ${STATUS_COLOR_MAP[value]} capitalize`}>
          {value}
        </span>
      ),
    },
  ];

  const imageUrl = renderIcons(serviceDetails.category);
  console.log(
    "imageUrl",
    serviceDetails.date,
    request?.service_details?.chosen_datetime,
  );

  return (
    <MainLayout title={t("RequestManagementData.requestManagement")}>
      {/* SEARCH */}
      <div
        className="bg-[#FFFFFF] font-medium my-4 sm:my-5  text-xs sm:text-sm p-3 sm:p-5 rounded-lg cursor-pointer"
        onClick={() => navigate(-1)}
      >
        <IoIosArrowBack className="inline mb-1 mr-2" />
        {t("RequestManagementData.backToAllreq")}
      </div>

      <div className="mt-5 relative">
        {/* Search Icon */}
        <FiSearch
          className="absolute left-4 top-[42%] -translate-y-1/2 text-[#5CACE0] font-extrabold"
          size={18}
        />

        {/* Input */}
        <Input
          size="lg"
          placeholder={t("RequestManagementData.requests")}
          className="mb-4 p-4 bg-white border-none rounded-xl text-black !pl-14"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* <div className="mt-5 mb-4">
        <Input
          size="lg"
          disabled={paginatedQuotes?.length === 0}
          placeholder="Search quotes by name, amount or status..."
          className="p-4 bg-white border-none rounded-xl"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* 50 / 50 LAYOUT */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* LEFT SIDE */}
        <div className="space-y-6">
          {/* SERVICE DETAILS */}
          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-lg  mb-4">
              {t("RequestManagementData.serviceRequestDetails")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 bg-[#EAF0F3] rounded-2xl p-4 mb-6 items-start sm:items-center">
              {/* Service Image */}
              <Image
                src={serviceDetails.image}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover flex-shrink-0"
              />

              {/* Content */}
              <div className="flex flex-col gap-3 flex-1 ">
                {/* Service Name */}
                <p className="text-base px-3 sm:text-lg font-semibold text-[#2C6587]">
                  {serviceDetails.serviceName}
                </p>

                {/* Category */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm text-[#64748B] w-fit">
                  <Image
                    src={`/assets/icons/${imageUrl}.png`}
                    className="w-4 h-4"
                  />
                  <span>
                    {serviceDetails.category ?? "Pets"}{" "}
                    {t("RequestManagementData.Services")}
                  </span>
                </div>

                {/* Date & Time */}
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  {/* Date */}
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm text-[#334155]">
                    <Image
                      src="/assets/icons/Calendar.png"
                      className="w-4 h-4 sm:w-5 sm:h-5"
                    />
                    <span>{serviceDetails.date}</span>
                  </div>

                  {/* Time */}
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm text-[#334155]">
                    <Image
                      src="/assets/icons/Clock.png"
                      className="w-4 h-4 sm:w-5 sm:h-5"
                    />
                    <span>{convert24To12(serviceDetails.time)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-[150px_1fr] gap-y-3 text-sm">
              <p className="font-medium">
                {t("RequestManagementData.serviceID")}
              </p>
              <p className="truncate" title={serviceDetails.serviceId}>
                {serviceDetails.serviceId}
              </p>

              <p className="font-medium">
                {t("RequestManagementData.category")}
              </p>
              <p
                className="flex items-center gap-2 truncate"
                title={serviceDetails.category}
              >
                <Image
                  src={`/assets/icons/${imageUrl}.png`}
                  className="w-4 h-4 flex-shrink-0"
                />
                <span className="truncate">
                  {serviceDetails.category ?? t("RequestManagementData.pets")}
                </span>
              </p>

              <p className="font-medium">
                {t("RequestManagementData.serviceName")}
              </p>
              <p className="truncate" title={serviceDetails.serviceName}>
                {serviceDetails.serviceName}
              </p>

              <p className="font-medium">
                {t("RequestManagementData.elderName")}
              </p>
              <p className="truncate" title={serviceDetails.elderName}>
                {serviceDetails.elderName}
              </p>

              <p className="font-medium">
                {t("RequestManagementData.valuation")}{" "}
              </p>
              <p className="truncate" title={serviceDetails.valuation}>
                {serviceDetails.valuation}
              </p>

              <p className="font-medium">
                {t("RequestManagementData.assignedProfessional")}
              </p>
              <p className="truncate" title={serviceDetails.professional}>
                {serviceDetails.professional}
              </p>

              <p className="font-medium">
                {t("RequestManagementData.serviceStatus")}
              </p>
              <p
                className="text-[#46BCAA] font-medium capitalize truncate"
                title={serviceDetails.status}
              >
                {serviceDetails.status}
              </p>

              <p className="font-medium">
                {t("RequestManagementData.serviceAddress")}
              </p>
              <p className="break-words" title={serviceDetails.address}>
                {serviceDetails.address}
              </p>

              <p className="font-medium">
                {t("RequestManagementData.paymentStatus")}
              </p>
              <p
                className="text-[#22C55E] font-medium truncate"
                title={serviceDetails.paymentStatus}
              >
                {serviceDetails.paymentStatus}
              </p>
            </div>
          </div>

          {/* ASSIGNED PROFESSIONAL */}
          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-lg  mb-4">
              {t("RequestManagementData.AssignedProfessional")}
            </p>

            {professional && professional.name !== "N/A" ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  {professional.image ? (
                    <>
                      <Image
                        src={professional.image}
                        alt="img"
                        className="w-14 h-14 rounded-full flex-shrink-0"
                      />
                    </>
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold text-gray-700 flex-shrink-0">
                        {professional?.name?.charAt(0)?.toUpperCase()}
                      </div>
                    </>
                  )}

                  <div className="min-w-0">
                    <p
                      className="font-semibold truncate"
                      title={professional.name}
                    >
                      {professional.name}
                    </p>
                    <p
                      className="text-sm text-[#64748B] flex items-center gap-2 truncate"
                      title={professional.phone}
                    >
                      <FaPhoneAlt className="flex-shrink-0" />
                      <span className="truncate">{professional.phone}</span>
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 flex-shrink-0">
                  <div className="border rounded-xl px-4 py-2 text-center min-w-[80px]">
                    <p className="font-semibold text-[#0F766E]">
                      {professional.rating ?? "—"}
                    </p>
                    <p className="text-xs">Overall rating</p>
                  </div>

                  {professional.isCertified && (
                    <div className="border rounded-xl px-4 py-2 flex items-center gap-2">
                      <BsPatchCheckFill className="text-[#0F766E] flex-shrink-0" />
                      <span className="text-sm truncate">
                        {t("RequestManagementData.certified")}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                {t("RequestManagementData.noProficinalAssignedyet")}
              </p>
            )}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="bg-white rounded-2xl shadow p-4">
          {filteredQuotes.length > 0 ? (
            <Table
              title={t("RequestManagementData.reciveQuates")}
              isHeaderVisible
              data={paginatedQuotes}
              columns={columns}
              searchable={false}
              exportable={false}
              showDatePicker={false}
              pagination={{
                page,
                size: pageSize,
                total: filteredQuotes.length,
              }}
              onPageChange={(p) => setPage(p)}
            />
          ) : (
            <p className="text-center text-gray-500 py-10">
              {t("RequestManagementData.noQuetesReceivedyet")}
            </p>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default RequestDetails;
