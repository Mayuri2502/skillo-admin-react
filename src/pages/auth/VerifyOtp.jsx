import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import GuestLayout from "../../layouts/GuestLayout";
import OtpInput from "../../components/OtpInput";
import authServices from "../../services/authServices";
import ModalView from "../../components/Model";
import Button from "../../components/Button";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [otpError, setOtpError] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    open: false,
    title: "",
    message: "",
    messageType: "success",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const otpInputRef = useRef(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (!email) {
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [timer]);

  const showModal = (title, message, messageType = "success") => {
    setModalConfig({
      open: true,
      title,
      message,
      messageType,
    });
  };

  const handleOtpComplete = async (otp) => {
    try {
      setOtpError(false);
      setErrorMessage("");

      if (!otp || otp.length !== 4) {
        throw new Error(t("pleaseEnterValidOtp"));
      }

      const response = await authServices.verifyOtp(email, otp);

      if (response?.status === 200 || response?.status === "success") {
        toast.success(t("otpVerifiedSuccessRedirecting"));
        setTimeout(() => {
          navigate("/login/reset-password", {
            state: { email: email },
          });
        }, 2000);
      } else {
        throw new Error(response?.data?.message || t("invalidOtp"));
      }
    } catch (error) {
      console.error("Verify OTP error:", error);
      setErrorMessage(error.message || t("invalidOtpPleaseTryAgain"));
      setOtpError(true);

      if (otpInputRef.current) {
        otpInputRef.current.setError();
        setTimeout(() => {
          otpInputRef.current.reset();
          setOtpError(false);
        }, 1000);
      }
    }
  };

  const handleResendCode = async () => {
    if (!canResend || !email) return;

    try {
      const response = await authServices.forgotPassword({ email });

      if (response?.status === 200 || response?.status === "success") {
        toast.success(t("newOtpSentToEmail"));
        setTimer(60);
        setCanResend(false);
        setErrorMessage("");
      } else {
        throw new Error(response?.data?.message || t("failedToResendOtp"));
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      toast.error(error.message || t("failedToResendOtpPleaseTryAgain"));
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleCloseModal = () => {
    setModalConfig((prev) => ({ ...prev, open: false }));
  };

  return (
    <GuestLayout
      title={t("enterOtp")}
      description={`${t("otpSentTo")} ${email}`}
    >
      <div className="flex flex-col gap-6 items-center w-full">
        <OtpInput
          ref={otpInputRef}
          length={4}
          onComplete={handleOtpComplete}
          error={otpError}
          className="w-full"
        />

        <div className="flex flex-col items-center justify-center w-full text-center mt-4">
          <p className="font-medium text-base m-0">
            <button
              onClick={handleResendCode}
              disabled={!canResend}
              className={`bg-transparent border-none font-medium text-base ${
                canResend
                  ? "text-[#285B7A] cursor-pointer hover:opacity-80"
                  : "text-gray-500 cursor-not-allowed"
              } transition-opacity px-2`}
            >
              {t("resendCode")}
            </button>
          </p>
          {!canResend && (
            <p className="text-sm text-gray-600 mt-2">
              {t("youCanResendCodeIn")}{" "}
              <span className="font-bold">{formatTime(timer)}</span>
            </p>
          )}
        </div>
      </div>
    </GuestLayout>
  );
};

export default VerifyOtp;
