import React, { useState, useEffect, useMemo } from "react";
import MainLayout from "../../layouts/MainLayout";
import Table from "../../components/Table";
import Button from "../../components/Button";
import userImg from "../../assets/image/Profile.png";
import { Image } from "@heroui/react";
import { FaEye } from "react-icons/fa";
import { IoIosCheckmark } from "react-icons/io";
import Input from "../../components/Input";
import ModalView from "../../components/Model";
import { VscFilePdf } from "react-icons/vsc";
import axiosInstance from "../../lib/Axios";
import IconAndTextModal from "../../components/IconAndTextModal";
import { formatDateAndTimeUTCToLocal } from "../../utils/DateAndTimeConversion";
import { Spinner } from "@heroui/react";
import { toast } from "sonner";
import {
  getVerifyDetail,
  getUserById,
  verifyDoc,
  rejectDoc,
} from "../../apis/verification.api";
import { FiSearch } from "react-icons/fi";
import { useTranslation } from "react-i18next";

export const formatDate = (dateString) => {
  if (!dateString) return "-";

  return new Date(dateString).toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const Verification = () => {
  const [modelOpen, setModelOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, size: 10, total: 0 });
  const [userData, setUserData] = useState({});
  const [searchVal, setSearchVal] = useState("");
  const { t } = useTranslation();
  const [textAreaShow, settestAreaShow] = useState(false);
  const [value, setValue] = useState("");
  const [reasonError, setReasonError] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const size = Object.keys(userData?.documents || {}).length;

  const tabs = [
    { id: "all", label: "All" },
    { id: "individual", label: "Individual Provider" },
    { id: "business", label: "Business Provider" },
  ];

  const columns = useMemo(
    () => [
      { key: "id", label: t("number"), width: "60px" },
      {
        key: "first_name",
        label: t("verificationData.firstName"),
        width: "180px",
        render: (value, row) => (
          <div className="flex items-center gap-3">
            {row.profile_photo_url ? (
              <div className="flex items-center gap-2">
                <Image
                  src={`${row.profile_photo_url}`}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span>{value}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold text-gray-700">
                  {value?.charAt(0)?.toUpperCase()}
                </div>
                <span>{value}</span>
              </div>
            )}
          </div>
        ),
      },
      {
        key: "last_name",
        label: t("verificationData.lastName"),
        width: "160px",
      },
      { 
        key: "account_type", 
        label: "Account Type",
        width: "140px",
      },
      { key: "email", label: t("verificationData.email") },
      {
        key: "created_at",
        label: t("verificationData.accountCreatedOn"),
        width: "160px",
        render: (id, row) => {
          return <div className="text-black">{formatDate(row.created_at)}</div>;
        },
      },
      {
        key: "action",
        label: t("verificationData.action"),
        width: "160px",
        render: (id, row) => (
          <div className="flex gap-3">
            <button
              className="group h-10 w-10 bg-[#FF94291F] hover:bg-[#FF9429] transition-colors flex items-center justify-center rounded-xl"
              onClick={() => {
                getUserDetail(row?.user_id);
              }}
            >
              <FaEye className="text-[#EC613D] group-hover:text-white" />
            </button>
          </div>
        ),
      },
    ],
    [t],
  );

  const getVerificationDetail = async (pageNum = 1, limit = pageSize) => {
    setIsLoading(true);
    try {
      // const res = await axiosInstance.get("/admin/pending-verification",
      const res = await getVerifyDetail({
        params: { 
          search: searchVal, 
          page: pageNum, 
          limit: limit,
          account_type: activeTab !== "all" ? activeTab : undefined
        },
      });

      // if (res?.status !== 200)
      //   throw new Error(
      //     res?.data?.msg || "Failed to fetch verification detail",
      //   );

      const respData = res?.data?.data.data || [];
      setData(
        respData.map((item, index) => ({
          ...item,
          id: (pageNum - 1) * 10 + index + 1,
        })),
      );
      setPagination({
        page: res?.data?.page || 1,
        size: res?.data?.limit || 10,
        total: res?.data?.total || 0,
      });
    } catch (error) {
      toast.error(error?.message || "Failed to fetch verification");
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getUserDetail = async (id) => {
    try {
      // const res = await axiosInstance.get(`/admin/view-professional/${id}`);
      const res = await getUserById(id);
      setUserData(res?.data);
      setModelOpen(true);
    } catch (err) {
      toast.error(err?.message || "Failed to fetch detail");
    }
  };

  const verifyDoc = async (id) => {
    try {
      const res = await axiosInstance.patch(`/admin/verify-document/${id}`);
      if (res.status || res.status == 200) {
        toast.success(res?.data?.message || "Documents accepted successfully", {
          id: "verification-success",
        });
        setModelOpen(false);
        await getVerificationDetail(page);
      }
    } catch (err) {
      toast.error(err?.message || "Error");
    }
  };

  const rejectDoc = async (id) => {
    try {
      const res = await axiosInstance.patch(`/admin/reject-document/${id}`, {
        reason: value,
      });
      if (res.status || res.status == 200) {
        toast.success(res?.data?.message || "Documents Rejected");
        setModelOpen(false);
        settestAreaShow(false);
        setValue("");
        await getVerificationDetail(page);
      }
    } catch (err) {
      toast.error(err?.message || "Error");
    }
  };

  useEffect(() => {
    getVerificationDetail(page, pageSize);
  }, [page, searchVal, pageSize, activeTab]);

  const isPdf = (filePath) => {
    return filePath?.toLowerCase().endsWith(".pdf");
  };

  return (
    <MainLayout title={t("verificationData.verification")}>
      <div className="mt-5 relative">
        {/* Search Icon */}
        <FiSearch
          className="absolute left-4 top-[42%] -translate-y-1/2 text-[#5CACE0] font-extrabold "
          size={18}
        />

        <Input
          size="lg"
          placeholder={t("verificationData.searchRequests")}
          className="mb-4 p-4 bg-white border-none rounded-xl text-black !pl-14 "
          onChange={(e) => setSearchVal(e.target.value)}
        />
      </div>

      <Table
        title={t("verificationData.pendingVerification")}
        isHeaderVisible={true}
        searchable={false}
        exportable={false}
        showDatePicker={false}
        data={data}
        columns={columns}
        pagination={pagination}
        onPageChange={(p) => setPage(p)}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
        isLoading={loading}
        showtabs={true}
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onTabChange={(tabId) => {
          setActiveTab(tabId);
          setPage(1);
        }}
      />

      <ModalView
        openModel={modelOpen}
        setOpenModel={() => {
          setModelOpen(false);
          settestAreaShow(false);
          setValue("");
        }}
        width="480px"
        minHeight="auto"
      >
        <div className="px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {t("verificationData.verfiyProficinal")}
            </h2>
          </div>

          <div className="flex items-start gap-4 mb-6">
            {userData?.user?.profile_photo_url ? (
              <Image
                src={`${userData?.user?.profile_photo_url}`}
                alt="Avatar"
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-semibold text-gray-600">
                {userData?.user?.first_name.charAt(0)?.toUpperCase()}
              </div>
            )}

            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                {userData?.user?.first_name + " " + userData?.user?.last_name}
              </h3>
              <p className="text-sm text-gray-500">
                {userData?.user?.email}
              </p>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">
                Contact
              </span>
              <span className="text-sm text-gray-900">
                {userData?.user?.phone_country_code +
                  " " +
                  userData?.user?.phone_number}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Email</span>
              <span className="text-sm text-gray-900">{userData?.user?.email}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">
                Account Type
              </span>
              <span className="text-sm text-gray-900">
                {userData?.user?.account_type || "-"}
              </span>
            </div>

            <div className="flex justify-between items-start">
              <span className="text-sm font-medium text-gray-600">
                Address
              </span>
              <span className="text-sm text-gray-900 text-right max-w-[200px]">
                {userData?.user?.address || "-"}
              </span>
            </div>
          </div>

          {size > 0 && (
            <>
              <div className="mb-6">
                <h3 className="text-base font-medium text-gray-900 mb-4">
                  {t("verificationData.reviewDocument")}
                </h3>

                <div className="grid grid-cols-3 gap-4 mb-6 mt-3">
                {[
                  {
                    name: "Certificate of Incorporation",
                    key: "id_document_file_id",
                  },
                  {
                    name: "CIPA Extract",
                    key: "kbis_extract_file_id",
                  },
                  {
                    name: "Tax Clearance Certificate",
                    key: "tax_clearance_file_id",
                  },
                  {
                    name: "Proof of Residence",
                    key: "proof_of_residence_file_id",
                  },
                  {
                    name: "Company Profile",
                    key: "company_profile_file_id",
                  },
                  {
                    name: "Director Identity Documents",
                    key: "director_id_file_id",
                  },
                ].map((doc) => {
                  const file = userData?.documents?.[doc.key];

                  return (
                    <div key={doc.key} className="w-full">
                      <p className="text-[14px] text-[#818285] p-2 text-center font-medium"
                         title={doc.name}
                         style={{
                           maxWidth: "100%",
                           overflow: "hidden",
                           textOverflow: "ellipsis",
                           whiteSpace: "nowrap",
                         }}
                      >
                        {doc.name}
                      </p>
                      {isPdf(file) ? (
                        <button
                          className="border-2 border-dotted border-[#818285] h-[100px] w-full rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer"
                          onClick={() => window.open(`${file}`, "_blank")}
                        >
                          <VscFilePdf className="text-2xl text-[#818285]" />
                          <p className="text-sm text-[#818285]">
                            View Document
                          </p>
                        </button>
                      ) : (
                        <div className="h-[100px] w-full rounded-xl overflow-hidden border flex items-center justify-center">
                          {file ? (
                            <Image
                              src={`${file}`}
                              alt="Document"
                              className="w-full h-full object-cover cursor-pointer"
                              onClick={() => window.open(`${file}`)}
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center text-[#818285] text-sm">
                              <p>No Document</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
                </div>
              </div>
            </>
          )}
          
          <div className="flex justify-end gap-3">
            <button
              variant="secondary"
              className="border-2 border-[#EC613D] text-[#EC613D] bg-white hover:bg-gray-50 rounded-xl px-6 h-11 font-medium transition-colors"
              onClick={() => {
                settestAreaShow(true);
                setModelOpen(false);
              }}
            >
              {t("verificationData.reject")}
            </button>
            <button
              className="bg-[#EC613D] text-white hover:bg-[#D5522C] rounded-xl px-6 h-11 font-medium transition-colors"
              onClick={() => {
                verifyDoc(userData?.user?.id);
              }}
            >
              {t("verificationData.verify")}
            </button>
          </div>
        </div>
      </ModalView>

      <ModalView
        openModel={textAreaShow}
        setOpenModel={() => {
          settestAreaShow(false);
          setValue("");
          setReasonError("");
        }}
        width="520px"
        minHeight="auto"
      >
        <div className="px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Reason of Rejection ?
            </h2>
          </div>

          <div className="mb-6">
            <textarea
              className="w-full p-3 bg-[#F5F5F5] text-black rounded-md focus:outline-none focus:border-none hover:border-none resize-none"
              placeholder="Enter description here..."
              value={value || ""}
              onChange={(e) => {
                if (e.target.value.length <= 250) {
                  setValue(e.target.value);
                  if (reasonError) setReasonError("");
                }
              }}
              rows={4}
              maxLength={250}
              style={{
                minHeight: "120px",
                fontFamily: "inherit",
                fontSize: "14px",
                border: reasonError ? "1px solid #fb2c36" : "none",
                outline: "none",
                boxShadow: "none",
              }}
            />
            {reasonError && (
              <p
                className="text-[#fb2c36] text-sm mt-1"
                style={{
                  color: "#fb2c36",
                  fontSize: "12px",
                  marginTop: "4px",
                }}
              >
                {reasonError}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <button
              className="border-2 border-[#EC613D] text-[#EC613D] bg-white hover:bg-gray-50 rounded-xl px-6 h-11 font-medium transition-colors"
              onClick={() => {
                settestAreaShow(false);
                setValue("");
                setReasonError("");
              }}
            >
              Cancel
            </button>
            <button
              className="bg-[#EC613D] text-white hover:bg-[#D5522C] rounded-xl px-6 h-11 font-medium transition-colors"
              onClick={() => {
                const trimmedValue = value ? value.trim() : "";
                const allowedRegex = /^[A-Za-z0-9 .,!?()'\-]+$/;

                if (!trimmedValue) {
                  setReasonError("Please enter a reason for rejection");
                  return;
                }

                if (!allowedRegex.test(trimmedValue)) {
                  setReasonError(
                    "Only letters, numbers and basic punctuation allowed",
                  );
                  return;
                }

                const sqlPattern =
                  /(select|insert|delete|drop|update|--|;)/i;
                if (sqlPattern.test(trimmedValue)) {
                  setReasonError("Invalid input detected");
                  return;
                }
                if (trimmedValue.length < 6) {
                  setReasonError("Reason must be at least 6 characters");
                  return;
                }
                if (trimmedValue.length > 250) {
                  setReasonError("Reason must be maximum 250 characters");
                  return;
                }
                setReasonError("");
                rejectDoc(userData?.user?.id);
                settestAreaShow(false);
                setValue("");
              }}
            >
              Reject
            </button>
          </div>
        </div>
      </ModalView>
    </MainLayout>
  );
};

export default Verification;
