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

  const size = Object.keys(userData?.documents || {}).length;

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";

    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

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
              className="group h-10 w-10 bg-[#FF94291F] hover:bg-[#2C6587] transition-colors flex items-center justify-center rounded-xl"
              onClick={() => {
                getUserDetail(row?.user_id);
              }}
            >
              <FaEye className="text-[#FF9429] group-hover:text-white" />
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
        params: { search: searchVal, page: pageNum, limit: limit },
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
  }, [page, searchVal, pageSize]);

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
      />

      <ModalView
        openModel={modelOpen}
        setOpenModel={() => {
          setModelOpen(false);
          settestAreaShow(false);
          setValue("");
        }}
        width="500px"
        minHeight="220px"
      >
        <div
          className="px-1 scrollbar-hide"
          style={{
            maxHeight: "70vh",
            overflowY: "auto",
          }}
        >
          <p className="text-lg font-semibold mb-4">
            {t("verificationData.verfiyProficinal")}
          </p>

          <div className="flex items-center gap-3 mb-4">
            {userData?.user?.profile_photo_url ? (
              <div className="flex items-center gap-2">
                <Image
                  src={`${userData?.user?.profile_photo_url}`}
                  alt="Avatar"
                  className="w-[80px] h-[80px] rounded-full object-cover"
                />
                {/* <span>{value}</span> */}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-[80px] h-[80px] rounded-full bg-gray-300 flex items-center justify-center text-[40px] font-semibold text-gray-700">
                  {userData?.user?.first_name.charAt(0)?.toUpperCase()}
                </div>
                {/* <span>{value}</span> */}
              </div>
            )}

            <span className="text-base font-medium text-[#0F172A]">
              {userData?.user?.first_name + " " + userData?.user?.last_name}
            </span>
          </div>

          <div className="space-y-3 text-sm mb-4">
            <div className="flex justify-between gap-6">
              <span className="font-medium">
                {t("verificationData.contact")}
              </span>
              <span className="text-[#545454]">
                {userData?.user?.phone_country_code +
                  " " +
                  userData?.user?.phone_number}
              </span>
            </div>

            <div className="flex justify-between gap-6">
              <span className="font-medium">{t("verificationData.email")}</span>
              <span className="text-[#545454]">{userData?.user?.email}</span>
            </div>

            <div className="flex justify-between gap-6">
              <span className="font-medium">
                {t("verificationData.subscritionStatus")}
              </span>
              <span className="text-[#46BCAA] font-medium">
                {userData?.subscription_status == null
                  ? t("verificationData.notCompleted")
                  : userData?.subscription_status}
              </span>
            </div>

            <div className="flex justify-between gap-6">
              <span className="font-medium">
                {t("verificationData.Address")}
              </span>
              <span
                className="text-[#545454] text-right max-w-[260px] truncate"
                title={userData?.user?.address || "-"}
              >
                {userData?.user?.address || "-"}
              </span>
            </div>
          </div>

          {size > 0 && (
            <>
              <p className="text-base font-medium mb-3">
                {t("verificationData.reviewDocument")}
              </p>

              <div className="flex gap-3 mb-6 mt-3">
                {[
                  {
                    name: t("verificationData.AcopyofID"),
                    key: "id_document_file_id",
                  },
                  {
                    name: t("verificationData.KbisExtract"),
                    key: "kbis_extract_file_id",
                  },
                  {
                    name: t("verificationData.ProofOfResidence"),
                    key: "proof_of_residence_file_id",
                  },
                ].map((doc) => {
                  const file = userData?.documents?.[doc.key];

                  return (
                    <div key={doc.key}>
                      {isPdf(file) ? (
                        <>
                          <p className="text-[14px] text-[#818285] p-2">
                            {doc.name}
                          </p>
                          <button
                            className="border-2 border-dotted border-[#818285] h-[100px] w-[120px] rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer"
                            onClick={() => window.open(`${file}`, "_blank")}
                          >
                            <VscFilePdf className="text-2xl text-[#818285]" />
                            <p className="text-sm text-[#818285]">
                              {t("verificationData.viewPdf")}
                            </p>
                          </button>
                        </>
                      ) : (
                        <>
                          <p
                            className="text-[14px] text-[#818285] p-2"
                            title={doc.name}
                            width="120px"
                            style={{
                              maxWidth: "120px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {doc.name}
                          </p>
                          <div className="max-h-[100px] w-[120px] rounded-xl overflow-hidden border">
                            {file ? (
                              <Image
                                src={`${file}`}
                                alt="Document"
                                className="w-full h-full object-cover cursor-pointer"
                                onClick={() => window.open(`${file}`)}
                              />
                            ) : (
                              <div className="flex justify-center min-h-[100px] items-center text-center mt-2 text-[#818285] text-sm">
                                {t("verificationData.notUploaded")}
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
          {/* textAreaShow , settestAreaShow */}
          {textAreaShow ? (
            <div
              className="mt-4"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                width: "100%",
              }}
            >
              <div className="w-full">
                <textarea
                  className="w-full p-3 bg-[#F5F5F5] text-black rounded-md focus:outline-none focus:border-none hover:border-none"
                  placeholder="Enter reason of reject"
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
                    width: "100%",
                    minHeight: "120px",
                    resize: "vertical",
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
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "12px",
                  width: "100%",
                }}
              >
                <Button
                  variant="secondary"
                  btnStyle="rounded-xl px-6 h-10"
                  onClick={() => {
                    settestAreaShow(false);
                    setValue("");
                    setReasonError("");
                  }}
                >
                  Cancel
                </Button>
                <Button
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
                  }}
                  className="rounded-xl px-10 h-11"
                >
                  Submit
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex justify-end gap-3">
              <Button
                variant="secondary"
                btnStyle="rounded-xl px-10 h-11"
                onClick={() => {
                  settestAreaShow(true);
                  // rejectDoc(userData?.user?.id);
                }}
              >
                {t("verificationData.reject")}
              </Button>
              <Button
                btnStyle="rounded-xl px-10 h-11"
                onClick={() => {
                  verifyDoc(userData?.user?.id);
                }}
              >
                {t("verificationData.verify")}
              </Button>
            </div>
          )}
        </div>
      </ModalView>
    </MainLayout>
  );
};

export default Verification;
